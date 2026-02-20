'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Contact, Search, MapPin, GitBranch, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DirectoryMember {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    location: string | null;
    branchName: string | null;
    role: string;
    createdAt: string;
}

interface FilterOption {
    name: string;
    count: number;
}

export default function DirectoryPage() {
    const router = useRouter();
    const [members, setMembers] = useState<DirectoryMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [branches, setBranches] = useState<FilterOption[]>([]);
    const [locations, setLocations] = useState<FilterOption[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!token || !apiUrl) return;

            const params = new URLSearchParams({ page: String(page), limit: '20' });
            if (search) params.set('q', search);
            if (branchFilter) params.set('branch', branchFilter);
            if (locationFilter) params.set('location', locationFilter);

            const res = await fetch(`${apiUrl}/directory/members?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const json = await res.json();
                setMembers(json.data);
                setTotal(json.meta.total);
                setTotalPages(json.meta.totalPages);
            }
        } catch {
            // API unavailable
        } finally {
            setLoading(false);
        }
    }, [search, branchFilter, locationFilter, page]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    // Fetch filter options once
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                if (!token || !apiUrl) return;
                const headers = { Authorization: `Bearer ${token}` };

                const [brRes, locRes] = await Promise.all([
                    fetch(`${apiUrl}/directory/branches`, { headers }),
                    fetch(`${apiUrl}/directory/locations`, { headers }),
                ]);
                if (brRes.ok) {
                    const json = await brRes.json();
                    setBranches(json.data);
                }
                if (locRes.ok) {
                    const json = await locRes.json();
                    setLocations(json.data);
                }
            } catch {
                // ignore
            }
        };
        fetchFilters();
    }, []);

    // Reset page on filter change
    useEffect(() => {
        setPage(1);
    }, [search, branchFilter, locationFilter]);

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'destructive' as const;
            case 'EDITOR':
            case 'MODERATOR':
                return 'default' as const;
            default:
                return 'secondary' as const;
        }
    };

    const roleLabel: Record<string, string> = {
        ADMIN: 'Quản trị',
        EDITOR: 'Biên tập',
        MODERATOR: 'Kiểm duyệt',
        ARCHIVIST: 'Lưu trữ',
        MEMBER: 'Thành viên',
        GUEST: 'Khách',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Contact className="h-6 w-6" />
                    Danh bạ Dòng họ
                </h1>
                <p className="text-muted-foreground">
                    {total} thành viên trong dòng họ
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {branches.length > 0 && (
                    <div className="flex items-center gap-1">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="">Tất cả chi nhánh</option>
                            {branches.map((b) => (
                                <option key={b.name} value={b.name}>
                                    {b.name} ({b.count})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {locations.length > 0 && (
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="">Tất cả khu vực</option>
                            {locations.map((l) => (
                                <option key={l.name} value={l.name}>
                                    {l.name} ({l.count})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Member Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : members.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <User className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            {search ? 'Không tìm thấy thành viên nào' : 'Chưa có dữ liệu danh bạ'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((member) => (
                        <Card
                            key={member.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => router.push(`/directory/${member.id}`)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        {member.avatarUrl ? (
                                            <img
                                                src={member.avatarUrl}
                                                alt={member.displayName}
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-6 w-6 text-primary" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-semibold truncate">
                                                {member.displayName}
                                            </h3>
                                            <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs">
                                                {roleLabel[member.role] || member.role}
                                            </Badge>
                                        </div>

                                        {member.branchName && (
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                <GitBranch className="h-3 w-3" />
                                                {member.branchName}
                                            </p>
                                        )}
                                        {member.location && (
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {member.location}
                                            </p>
                                        )}
                                        {member.bio && (
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {member.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Trang trước
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Trang {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Trang sau
                    </Button>
                </div>
            )}
        </div>
    );
}
