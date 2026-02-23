'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, LayoutGrid, List as ListIcon, UserCircle, Calendar, GraduationCap, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Person {
    handle: string;
    displayName: string;
    gender: number;
    birthYear?: number;
    deathYear?: number;
    isLiving: boolean;
    isPrivacyFiltered: boolean;
    avatarUrl?: string;
    generation?: number;
}

export default function PeopleListPage() {
    const router = useRouter();
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState<number | null>(null);
    const [livingFilter, setLivingFilter] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const { supabase } = await import('@/lib/supabase');
                const { data, error } = await supabase
                    .from('people')
                    .select('handle, display_name, gender, birth_year, death_year, is_living, is_privacy_filtered, avatar_url, generation')
                    .order('generation', { ascending: true })
                    .order('birth_year', { ascending: true, nullsFirst: false });

                if (!error && data) {
                    setPeople(data.map((row: any) => ({
                        handle: row.handle,
                        displayName: row.display_name,
                        gender: row.gender,
                        birthYear: row.birth_year,
                        deathYear: row.death_year,
                        isLiving: row.is_living,
                        isPrivacyFiltered: row.is_privacy_filtered,
                        avatarUrl: row.avatar_url,
                        generation: row.generation,
                    })));
                }
            } catch { /* ignore */ }
            setLoading(false);
        };
        fetchPeople();
    }, []);

    const filtered = useMemo(() => {
        return people.filter((p) => {
            if (search && !p.displayName.toLowerCase().includes(search.toLowerCase())) return false;
            if (genderFilter !== null && p.gender !== genderFilter) return false;
            if (livingFilter !== null && p.isLiving !== livingFilter) return false;
            return true;
        });
    }, [people, search, genderFilter, livingFilter]);

    const generationsCount = useMemo(() => {
        const gens = new Set(people.map(p => p.generation).filter(Boolean));
        return gens.size;
    }, [people]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary" />
                <p className="text-muted-foreground animate-pulse">Đang tải danh sách thành viên...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Modern Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-8 sm:p-12">
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-primary/10 rounded-full blur-2xl opacity-50"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                            <Users className="w-4 h-4" /> Danh bạ gia phả
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                            Thành viên Dòng họ
                        </h1>
                        <p className="text-muted-foreground max-w-lg text-lg">
                            Duyệt qua danh sách các thành viên, tra cứu thông tin và tìm hiểu về các thế hệ trong gia đình.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-background/80 backdrop-blur-sm px-6 py-4 rounded-2xl border shadow-sm text-center">
                            <div className="text-3xl font-bold text-primary">{people.length}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Thành viên</div>
                        </div>
                        <div className="bg-background/80 backdrop-blur-sm px-6 py-4 rounded-2xl border shadow-sm text-center">
                            <div className="text-3xl font-bold text-primary">{generationsCount}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Thế hệ</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area with Tabs */}
            <Tabs defaultValue="list" className="space-y-6">

                {/* Filters and View Toggles */}
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between sticky top-16 z-20 bg-background/95 backdrop-blur py-3 rounded-lg -mx-2 px-2">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo tên..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-11 h-11 rounded-full bg-muted/50 border-transparent hover:bg-muted focus:bg-background transition-colors"
                            />
                        </div>

                        {/* Elegant Filter Pills */}
                        <div className="flex gap-2 items-center overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                            <div className="h-6 w-px bg-border mx-2 hidden sm:block"></div>

                            <Badge
                                variant={genderFilter === null ? 'default' : 'secondary'}
                                className="h-9 px-4 cursor-pointer hover:bg-primary/80 transition-colors whitespace-nowrap rounded-full text-sm font-medium"
                                onClick={() => setGenderFilter(genderFilter === null ? 1 : null)}
                            >
                                {genderFilter === 1 ? 'Chỉ hiển thị Nam' : 'Nam'}
                            </Badge>
                            <Badge
                                variant={genderFilter === 2 ? 'default' : 'secondary'}
                                className="h-9 px-4 cursor-pointer hover:bg-primary/80 transition-colors whitespace-nowrap rounded-full text-sm font-medium"
                                onClick={() => setGenderFilter(genderFilter === 2 ? null : 2)}
                            >
                                Nữ
                            </Badge>

                            <div className="h-6 w-px bg-border mx-2"></div>

                            <Badge
                                variant={livingFilter === true ? 'default' : 'secondary'}
                                className="h-9 px-4 cursor-pointer hover:bg-primary/80 transition-colors whitespace-nowrap rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                                data-state={livingFilter === true ? 'active' : 'inactive'}
                                onClick={() => setLivingFilter(livingFilter === true ? null : true)}
                            >
                                Còn sống
                            </Badge>
                            <Badge
                                variant={livingFilter === false ? 'default' : 'secondary'}
                                className="h-9 px-4 cursor-pointer hover:bg-primary/80 transition-colors whitespace-nowrap rounded-full text-sm font-medium bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                                data-state={livingFilter === false ? 'active' : 'inactive'}
                                onClick={() => setLivingFilter(livingFilter === false ? null : false)}
                            >
                                Đã mất
                            </Badge>
                        </div>
                    </div>

                    <TabsList className="bg-muted/50 p-1 rounded-full h-11 shrink-0 self-end lg:self-auto">
                        <TabsTrigger value="list" className="rounded-full px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><ListIcon className="w-4 h-4 mr-2" /> Danh sách</TabsTrigger>
                        <TabsTrigger value="grid" className="rounded-full px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><LayoutGrid className="w-4 h-4 mr-2" /> Lưới</TabsTrigger>
                    </TabsList>
                </div>

                {filtered.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center justify-center bg-muted/20 rounded-3xl border border-dashed border-muted-foreground/20">
                        <UserCircle className="h-16 w-16 text-muted-foreground/40 mb-4" />
                        <h3 className="text-xl font-semibold text-foreground">Không tìm thấy ai</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác.</p>
                        <Button variant="outline" className="mt-6 rounded-full" onClick={() => { setSearch(''); setGenderFilter(null); setLivingFilter(null); }}>
                            Xóa toàn bộ bộ lọc
                        </Button>
                    </div>
                )}

                {/* Grid View */}
                <TabsContent value="grid" className="m-0 focus-visible:outline-none">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((p) => (
                            <Card
                                key={p.handle}
                                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 transform hover:-translate-y-1 bg-gradient-to-b from-background to-muted/10 rounded-2xl"
                                onClick={() => router.push(`/people/${p.handle}`)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative mb-5">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-full blur-xl scale-125 group-hover:scale-150 transition-transform opacity-50"></div>
                                            <Avatar className="h-24 w-24 ring-4 ring-background shadow-md relative z-10">
                                                <AvatarImage src={p.avatarUrl} alt={p.displayName} className="object-cover" />
                                                <AvatarFallback className="text-2xl font-bold bg-muted text-muted-foreground">
                                                    {p.displayName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {p.isLiving ? (
                                                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background z-20" title="Còn sống"></span>
                                            ) : (
                                                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-slate-400 border-2 border-background z-20" title="Đã mất"></span>
                                            )}
                                        </div>

                                        <h3 className="text-[1.1rem] font-bold text-foreground mb-1 leading-tight group-hover:text-primary transition-colors flex items-center gap-1.5">
                                            {p.displayName}
                                            {p.isPrivacyFiltered && <span className="text-amber-500 text-sm" title="Riêng tư">🔒</span>}
                                        </h3>

                                        <div className="flex items-center gap-2 mt-2 mb-4 h-6">
                                            {p.generation && (
                                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-semibold px-2.5">
                                                    Đời {p.generation}
                                                </Badge>
                                            )}
                                            <Badge variant="secondary" className="font-normal text-muted-foreground bg-muted/50">
                                                {p.gender === 1 ? 'Nam' : p.gender === 2 ? 'Nữ' : 'Khác'}
                                            </Badge>
                                        </div>

                                        <div className="w-full pt-4 border-t border-border/50 flex flex-col gap-2">
                                            <div className="flex items-center justify-center text-sm text-muted-foreground gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 opacity-70" />
                                                <span>{p.birthYear || '...'}</span>
                                                <ArrowRight className="w-3 h-3 opacity-40 mx-0.5" />
                                                <span>{p.deathYear || (p.isLiving ? 'Nay' : '...')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* List View */}
                <TabsContent value="list" className="m-0 focus-visible:outline-none">
                    <Card className="rounded-2xl overflow-hidden border-border/50 shadow-sm">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="py-4 pl-6 font-semibold text-foreground">Họ và tên</TableHead>
                                        <TableHead className="py-4 font-semibold text-foreground">Đời</TableHead>
                                        <TableHead className="py-4 hidden sm:table-cell font-semibold text-foreground">Giới tính</TableHead>
                                        <TableHead className="py-4 hidden md:table-cell font-semibold text-foreground">Năm sinh</TableHead>
                                        <TableHead className="py-4 hidden lg:table-cell font-semibold text-foreground">Năm mất</TableHead>
                                        <TableHead className="py-4 font-semibold text-foreground text-right pr-6">Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((p) => (
                                        <TableRow
                                            key={p.handle}
                                            className="cursor-pointer hover:bg-muted/40 transition-colors group"
                                            onClick={() => router.push(`/people/${p.handle}`)}
                                        >
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                                        <AvatarImage src={p.avatarUrl} className="object-cover" />
                                                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-medium">
                                                            {p.displayName.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-[15px] group-hover:text-primary transition-colors flex items-center gap-1">
                                                            {p.displayName}
                                                            {p.isPrivacyFiltered && <span className="text-amber-500 text-xs">🔒</span>}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {p.generation ? (
                                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 text-primary font-bold text-sm">
                                                        {p.generation}
                                                    </span>
                                                ) : <span className="text-muted-foreground">—</span>}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell py-4">
                                                <span className="text-muted-foreground text-sm font-medium">
                                                    {p.gender === 1 ? 'Nam' : p.gender === 2 ? 'Nữ' : 'Khác'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell py-4">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {p.birthYear || '...'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell py-4">
                                                <span className="text-muted-foreground text-sm">
                                                    {p.deathYear || (p.isLiving ? '—' : '...')}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right pr-6 py-4">
                                                <Badge
                                                    variant="outline"
                                                    className={`border-transparent font-medium ${p.isLiving ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-600'}`}
                                                >
                                                    {p.isLiving ? 'Còn sống' : 'Đã mất'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

