'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Heart, Image, FileText, History, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { MOCK_PEOPLE } from '@/lib/mock-genealogy';

interface PersonDetail {
    handle: string;
    gramps_id: string;
    gender: number;
    displayName: string;
    surname: string;
    firstName: string;
    birthYear?: number;
    birthDate?: string;
    birthPlace?: string;
    deathYear?: number;
    deathDate?: string;
    deathPlace?: string;
    isLiving: boolean;
    isPrivacyFiltered: boolean;
    _privacyNote?: string;
    families?: string[];
    parentFamilies?: string[];
    mediaCount?: number;
    phone?: string;
}

export default function PersonProfilePage() {
    const params = useParams();
    const router = useRouter();
    const handle = params.handle as string;
    const [person, setPerson] = useState<PersonDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerson = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                if (token && apiUrl) {
                    const res = await fetch(`${apiUrl}/genealogy/people/${handle}`, {
                        headers: { Authorization: `Bearer ${token}` },
                        signal: AbortSignal.timeout(3000),
                    });
                    if (res.ok) {
                        const json = await res.json();
                        setPerson(json.data);
                        setLoading(false);
                        return;
                    }
                }
            } catch {
                // API unavailable
            }
            // Fallback to mock data
            const mockPerson = MOCK_PEOPLE.find((p) => p.handle === handle) || null;
            setPerson(mockPerson);
            setLoading(false);
        };
        fetchPerson();
    }, [handle]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (!person) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">Không tìm thấy người này</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
            </div>
        );
    }

    const genderLabel = person.gender === 1 ? 'Nam' : person.gender === 2 ? 'Nữ' : 'Không rõ';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            {person.displayName}
                            {person.isPrivacyFiltered && (
                                <Badge variant="outline" className="text-amber-500 border-amber-500">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Thông tin bị giới hạn
                                </Badge>
                            )}
                        </h1>
                        <p className="text-muted-foreground">
                            {genderLabel} • {person.gramps_id}
                            {person.isLiving && ' • Còn sống'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Privacy notice */}
            {person.isPrivacyFiltered && person._privacyNote && (
                <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-600 dark:text-amber-400">
                    🔒 {person._privacyNote}
                </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview" className="gap-1">
                        <User className="h-3.5 w-3.5" /> Tổng quan
                    </TabsTrigger>
                    <TabsTrigger value="relationships" className="gap-1">
                        <Heart className="h-3.5 w-3.5" /> Quan hệ
                    </TabsTrigger>
                    <TabsTrigger value="media" className="gap-1">
                        <Image className="h-3.5 w-3.5" /> Tư liệu
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-1">
                        <History className="h-3.5 w-3.5" /> Lịch sử
                    </TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <InfoRow label="Họ" value={person.surname || '—'} />
                            <InfoRow label="Tên" value={person.firstName || '—'} />
                            <InfoRow label="Giới tính" value={genderLabel} />
                            <InfoRow label="Ngày sinh" value={person.birthDate || (person.birthYear ? `${person.birthYear}` : '—')} />
                            <InfoRow label="Nơi sinh" value={person.birthPlace || '—'} />
                            {!person.isLiving && (
                                <>
                                    <InfoRow label="Ngày mất" value={person.deathDate || (person.deathYear ? `${person.deathYear}` : '—')} />
                                    <InfoRow label="Nơi mất" value={person.deathPlace || '—'} />
                                </>
                            )}
                            {person.phone && <InfoRow label="Điện thoại" value={person.phone} />}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Relationships */}
                <TabsContent value="relationships">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quan hệ gia đình</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Gia đình (cha/mẹ)</p>
                                    {person.parentFamilies && person.parentFamilies.length > 0 ? (
                                        person.parentFamilies.map((f) => (
                                            <Badge key={f} variant="outline" className="mr-1">{f}</Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Không có thông tin</p>
                                    )}
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Gia đình (vợ/chồng, con)</p>
                                    {person.families && person.families.length > 0 ? (
                                        person.families.map((f) => (
                                            <Badge key={f} variant="outline" className="mr-1">{f}</Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Không có thông tin</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Media */}
                <TabsContent value="media">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Tư liệu liên quan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                {person.mediaCount ? `${person.mediaCount} tư liệu` : 'Chưa có tư liệu nào'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Tính năng xem chi tiết sẽ được bổ sung trong Epic 3 (Media Library).
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History */}
                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Lịch sử thay đổi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Audit log cho entity này sẽ được bổ sung trong Epic 4.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="text-sm">{value}</p>
        </div>
    );
}
