'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    User,
    MapPin,
    GitBranch,
    Mail,
    Phone,
    TreePine,
    Calendar,
    Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MemberProfile {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    location: string | null;
    branchName: string | null;
    phone: string | null;
    grampsPersonId: string | null;
    role: string;
    createdAt: string;
    personLink: { personHandle: string } | null;
}

export default function MemberProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [member, setMember] = useState<MemberProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                if (!token || !apiUrl) return;

                const res = await fetch(`${apiUrl}/directory/members/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const json = await res.json();
                    setMember(json.data);
                }
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [params.id]);

    const roleLabel: Record<string, string> = {
        ADMIN: 'Quản trị',
        EDITOR: 'Biên tập',
        MODERATOR: 'Kiểm duyệt',
        ARCHIVIST: 'Lưu trữ',
        MEMBER: 'Thành viên',
        GUEST: 'Khách',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (!member) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
                </Button>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <User className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Không tìm thấy thành viên</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Back button */}
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh bạ
            </Button>

            {/* Profile header */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            {member.avatarUrl ? (
                                <img
                                    src={member.avatarUrl}
                                    alt={member.displayName}
                                    className="h-20 w-20 rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-10 w-10 text-primary" />
                            )}
                        </div>

                        {/* Main info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl font-bold">{member.displayName}</h1>
                                <Badge variant="outline">
                                    <Shield className="h-3 w-3 mr-1" />
                                    {roleLabel[member.role] || member.role}
                                </Badge>
                            </div>

                            {member.bio && (
                                <p className="text-muted-foreground mt-2">{member.bio}</p>
                            )}

                            <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                {member.branchName && (
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <GitBranch className="h-4 w-4" />
                                        {member.branchName}
                                    </span>
                                )}
                                {member.location && (
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        {member.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    Tham gia {new Date(member.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contact info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{member.email}</span>
                    </div>
                    {member.phone && (
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{member.phone}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Genealogy link */}
            {member.personLink && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Liên kết Gia phả</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="outline"
                            onClick={() => router.push(`/people/${member.personLink!.personHandle}`)}
                        >
                            <TreePine className="h-4 w-4 mr-2" />
                            Xem trong cây gia phả
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
