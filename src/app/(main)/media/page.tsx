'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Image as ImageIcon, Upload, Search, Check, X, Loader2, FileImage, FileVideo, FileText, Eye, Tags, Calendar, UserPlus, Edit2, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';
import { TagPicker } from '@/components/ui/tag-picker';
import { mediaApi, peopleApi, eventsApi } from '@/lib/api';

interface MediaItem {
    id: string;
    file_name: string;
    mime_type: string | null;
    file_size: number | null;
    title: string | null;
    description: string | null;
    state: string;
    uploader_id: string | null;
    created_at: string;
    uploader?: { display_name: string | null; email: string };
    tagged_people?: string[] | null;
    tagged_events?: string[] | null;
}

const STATE_BADGE: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
    PENDING: { variant: 'secondary', label: 'Chờ duyệt' },
    PUBLISHED: { variant: 'default', label: 'Đã duyệt' },
    REJECTED: { variant: 'destructive', label: 'Bị từ chối' },
};

export default function MediaLibraryPage() {
    const { user, isAdmin, isLoggedIn } = useAuth();
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('all');
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Dữ liệu cho Tagging
    const [peopleList, setPeopleList] = useState<any[]>([]);
    const [eventsList, setEventsList] = useState<any[]>([]);

    // Upload Dialog State
    const [uploadDialogFile, setUploadDialogFile] = useState<File | null>(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadPeople, setUploadPeople] = useState<string[]>([]);
    const [uploadEvents, setUploadEvents] = useState<string[]>([]);

    // Edit Tags State
    const [editTagsItem, setEditTagsItem] = useState<MediaItem | null>(null);
    const [editPeople, setEditPeople] = useState<string[]>([]);
    const [editEvents, setEditEvents] = useState<string[]>([]);
    const [savingTags, setSavingTags] = useState(false);

    const fetchMedia = useCallback(async (state?: string) => {
        setLoading(true);
        const { data, error } = await mediaApi.list(state);
        if (error) {
            console.error('Fetch media error:', error);
        } else if (data) {
            setItems(data);
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchMedia(tab === 'all' ? undefined : tab); }, [tab, fetchMedia]);

    useEffect(() => {
        if (!isLoggedIn) return;
        Promise.all([
            peopleApi.list(),
            eventsApi.list()
        ]).then(([pRes, eRes]) => {
            if (pRes.data) setPeopleList(pRes.data);
            if (eRes.data) setEventsList(eRes.data);
        });
    }, [isLoggedIn]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadDialogFile(file);
        setUploadTitle(file.name);
        setUploadPeople([]);
        setUploadEvents([]);
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleConfirmUpload = async () => {
        if (!uploadDialogFile || !user) return;
        setUploading(true);
        setError('');

        const { error } = await mediaApi.upload(uploadDialogFile, user.id, uploadTitle, uploadPeople, uploadEvents);
        if (error) {
            setError(error);
        } else {
            fetchMedia(tab === 'all' ? undefined : tab);
            setUploadDialogFile(null);
        }
        setUploading(false);
    };

    const handleCreateEvent = async (title: string, isEditMode: boolean = false) => {
        if (!user) return;
        const res = await eventsApi.create({
            title,
            start_at: new Date().toISOString(),
            creator_id: user.id,
            type: 'OTHER' // Default type
        });
        if (res.data) {
            const newEvent = res.data as any;
            setEventsList([...eventsList, newEvent]);
            if (isEditMode) {
                setEditEvents([...editEvents, newEvent.id]);
            } else {
                setUploadEvents([...uploadEvents, newEvent.id]);
            }
        } else {
            alert(res.error || 'Lỗi tạo sự kiện');
        }
    };

    const handleSaveTags = async () => {
        if (!editTagsItem) return;
        setSavingTags(true);
        const { error } = await mediaApi.updateTags(editTagsItem.id, editPeople, editEvents);
        if (error) {
            setError(error);
        } else {
            // Update local state to reflect new tags
            setItems(prev => prev.map(item => item.id === editTagsItem.id ? { ...item, tagged_people: editPeople, tagged_events: editEvents } : item));
            setPreviewItem(prev => prev ? { ...prev, tagged_people: editPeople, tagged_events: editEvents } : null);
            setEditTagsItem(null);
        }
        setSavingTags(false);
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        await mediaApi.updateState(id, action);
        fetchMedia(tab === 'all' ? undefined : tab);
    };

    const formatSize = (bytes: number | null) => {
        if (!bytes) return '—';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1048576).toFixed(1)} MB`;
    };

    const getPublicUrl = (item: MediaItem) => {
        if (!item.uploader_id) return null;
        const { data } = supabase.storage
            .from('media')
            .getPublicUrl(`${item.uploader_id}/${item.file_name}`);
        return data.publicUrl;
    };

    const getFileIcon = (mimeType: string | null) => {
        if (!mimeType) return <FileText className="h-5 w-5" />;
        if (mimeType.startsWith('image/')) return <FileImage className="h-5 w-5 text-blue-500" />;
        if (mimeType.startsWith('video/')) return <FileVideo className="h-5 w-5 text-purple-500" />;
        return <FileText className="h-5 w-5 text-gray-500" />;
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            if (searchQuery && !item.title?.toLowerCase().includes(searchQuery.toLowerCase()) && !item.file_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        });
    }, [items, searchQuery]);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* Modern Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-8 sm:p-12">
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-primary/10 rounded-full blur-2xl opacity-50"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                            <ImageIcon className="w-4 h-4" /> Kho dữ liệu
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                            Thư viện Gia phả
                        </h1>
                        <p className="text-muted-foreground max-w-lg text-lg">
                            Quản lý hình ảnh, video và tài liệu. Lưu giữ những khoảnh khắc và kỷ vật quý giá của dòng họ.
                        </p>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="bg-background/80 backdrop-blur-sm px-6 py-4 rounded-2xl border shadow-sm text-center">
                            <div className="text-3xl font-bold text-primary">{items.length}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Tài liệu</div>
                        </div>
                        {isLoggedIn && (
                            <div className="flex flex-col gap-2 relative z-20">
                                <input ref={fileRef} type="file" className="hidden" accept="image/*,video/*,.pdf" onChange={handleFileSelect} />
                                <Button size="lg" className="rounded-xl shadow-md" onClick={() => fileRef.current?.click()} disabled={uploading}>
                                    <Upload className="mr-2 h-5 w-5" />{uploading ? 'Đang chuẩn bị...' : 'Tải lên'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between border border-destructive/20">
                    <span className="font-medium">{error}</span>
                    <Button variant="ghost" size="sm" className="hover:bg-destructive/20 rounded-full" onClick={() => setError('')}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Main Content Area with View Mode Tabs */}
            <Tabs defaultValue="list" className="space-y-6">

                {/* Filters and View Toggles */}
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between sticky top-16 z-20 bg-background/95 backdrop-blur py-3 rounded-lg -mx-2 px-2">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm tài liệu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 h-11 rounded-full bg-muted/50 border-transparent hover:bg-muted focus:bg-background transition-colors"
                            />
                        </div>

                        {/* Elegant Filter Pills for State */}
                        <div className="flex gap-2 items-center overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                            <div className="h-6 w-px bg-border mx-2 hidden sm:block"></div>

                            <Badge
                                variant={tab === 'all' ? 'default' : 'secondary'}
                                className="h-9 px-4 cursor-pointer hover:bg-primary/80 transition-colors whitespace-nowrap rounded-full text-sm font-medium"
                                onClick={() => setTab('all')}
                            >
                                Tất cả
                            </Badge>
                            <Badge
                                variant={tab === 'PUBLISHED' ? 'default' : 'secondary'}
                                className="h-9 px-4 cursor-pointer hover:bg-primary/80 transition-colors whitespace-nowrap rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                                data-state={tab === 'PUBLISHED' ? 'active' : 'inactive'}
                                onClick={() => setTab('PUBLISHED')}
                            >
                                Đã duyệt
                            </Badge>
                            <Badge
                                variant={tab === 'PENDING' ? 'default' : 'secondary'}
                                className="h-9 px-4 cursor-pointer hover:bg-primary/80 transition-colors whitespace-nowrap rounded-full text-sm font-medium bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                                data-state={tab === 'PENDING' ? 'active' : 'inactive'}
                                onClick={() => setTab('PENDING')}
                            >
                                Chờ duyệt
                            </Badge>
                        </div>
                    </div>

                    <TabsList className="bg-muted/50 p-1 rounded-full h-11 shrink-0 self-end lg:self-auto">
                        <TabsTrigger value="list" className="rounded-full px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><ListIcon className="w-4 h-4 mr-2" /> Danh sách</TabsTrigger>
                        <TabsTrigger value="grid" className="rounded-full px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"><LayoutGrid className="w-4 h-4 mr-2" /> Lưới</TabsTrigger>
                    </TabsList>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center bg-muted/20 rounded-3xl border border-dashed border-muted-foreground/20">
                        <ImageIcon className="h-16 w-16 text-muted-foreground/40 mb-4" />
                        <h3 className="text-xl font-semibold text-foreground">Không có tài liệu</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">Chưa có tài liệu nào trong thư viện hoặc không khớp với tìm kiếm.</p>
                        {searchQuery && (
                            <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSearchQuery('')}>Xóa tìm kiếm</Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* List View */}
                        <TabsContent value="list" className="m-0 focus-visible:outline-none">
                            <Card className="rounded-2xl overflow-hidden border-border/50 shadow-sm">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead className="py-4 pl-6 font-semibold text-foreground">Tài liệu</TableHead>
                                                <TableHead className="py-4 hidden sm:table-cell font-semibold text-foreground">Trạng thái</TableHead>
                                                <TableHead className="py-4 hidden md:table-cell font-semibold text-foreground">Kích thước</TableHead>
                                                <TableHead className="py-4 hidden lg:table-cell font-semibold text-foreground">Người tải lên</TableHead>
                                                <TableHead className="py-4 font-semibold text-foreground text-right pr-6">Hành động</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredItems.map((item) => {
                                                const publicUrl = getPublicUrl(item);
                                                const isImage = item.mime_type?.startsWith('image/');
                                                return (
                                                    <TableRow key={item.id} className="group hover:bg-muted/40 transition-colors cursor-pointer" onClick={(e) => {
                                                        const target = e.target as HTMLElement;
                                                        if (target.closest('button')) return;
                                                        if (isImage) setPreviewItem(item);
                                                    }}>
                                                        <TableCell className="pl-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-border shadow-sm">
                                                                    {isImage && publicUrl ? (
                                                                        <img src={publicUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                                    ) : (
                                                                        getFileIcon(item.mime_type)
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-[15px] group-hover:text-primary transition-colors max-w-[200px] sm:max-w-xs truncate">
                                                                        {item.title || item.file_name}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground mt-0.5">{item.mime_type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell py-4">
                                                            <Badge variant={STATE_BADGE[item.state]?.variant || 'secondary'} className="font-medium shadow-sm">
                                                                {STATE_BADGE[item.state]?.label || item.state}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell py-4">
                                                            <span className="text-muted-foreground text-sm font-medium">{formatSize(item.file_size)}</span>
                                                        </TableCell>
                                                        <TableCell className="hidden lg:table-cell py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium">
                                                                    {item.uploader?.display_name || item.uploader?.email?.split('@')[0] || 'Ẩn danh'}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right pr-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                            {isAdmin && item.state === 'PENDING' ? (
                                                                <div className="flex gap-2 justify-end">
                                                                    <Button size="sm" variant="outline" className="h-8 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleAction(item.id, 'approve')}>
                                                                        <Check className="h-3.5 w-3.5 mr-1" /> Duyệt
                                                                    </Button>
                                                                    <Button size="sm" variant="destructive" className="h-8 rounded-lg" onClick={() => handleAction(item.id, 'reject')}>
                                                                        <X className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground" onClick={() => isImage && setPreviewItem(item)}>
                                                                    <Eye className="w-4 h-4 mr-1.5" /> Xem
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Grid View */}
                        <TabsContent value="grid" className="m-0 focus-visible:outline-none">
                            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full">
                                {filteredItems.map(item => {
                                    const publicUrl = getPublicUrl(item);
                                    const isImage = item.mime_type?.startsWith('image/');
                                    return (
                                        <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 transform hover:-translate-y-1 bg-gradient-to-b from-background to-muted/10 rounded-2xl flex flex-col group">
                                            <div
                                                className="aspect-[4/3] bg-muted/50 flex items-center justify-center cursor-pointer relative overflow-hidden w-full"
                                                onClick={() => isImage && setPreviewItem(item)}
                                            >
                                                {isImage && publicUrl ? (
                                                    <>
                                                        <img
                                                            src={publicUrl}
                                                            alt={item.title || item.file_name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                            <Eye className="h-10 w-10 text-white drop-shadow-lg" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center p-4">
                                                        <div className="bg-background/80 p-4 rounded-full inline-flex shadow-sm mb-3">
                                                            {getFileIcon(item.mime_type)}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-2 truncate w-full px-4">{item.file_name}</p>
                                                    </div>
                                                )}
                                                <Badge
                                                    variant={STATE_BADGE[item.state]?.variant || 'secondary'}
                                                    className="absolute top-3 right-3 shadow-md border-transparent"
                                                >
                                                    {STATE_BADGE[item.state]?.label || item.state}
                                                </Badge>
                                            </div>
                                            <CardContent className="p-5 flex flex-col flex-1">
                                                <h3 className="font-bold text-[1.05rem] truncate mb-1.5 leading-tight group-hover:text-primary transition-colors">
                                                    {item.title || item.file_name}
                                                </h3>
                                                <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                                                    <span className="font-medium">{formatSize(item.file_size)}</span>
                                                    <span className="px-2 py-0.5 bg-muted rounded-md">{item.mime_type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50 text-xs text-muted-foreground">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 ring-2 ring-background">
                                                        {(item.uploader?.display_name || item.uploader?.email || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="truncate flex-1 font-medium">{item.uploader?.display_name || item.uploader?.email?.split('@')[0] || 'Ẩn danh'}</span>
                                                    <span>{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                                {isAdmin && item.state === 'PENDING' && (
                                                    <div className="flex gap-2 pt-4 mt-2 border-t border-border/50">
                                                        <Button size="sm" variant="outline" className="flex-1 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleAction(item.id, 'approve')}>
                                                            <Check className="h-4 w-4 mr-1.5" />Duyệt
                                                        </Button>
                                                        <Button size="sm" variant="destructive" className="flex-1 rounded-lg" onClick={() => handleAction(item.id, 'reject')}>
                                                            <X className="h-4 w-4 mr-1.5" />Từ chối
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </TabsContent>
                    </>
                )}
            </Tabs>

            {/* Upload Settings Dialog */}
            <Dialog open={!!uploadDialogFile} onOpenChange={(open) => !open && setUploadDialogFile(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chi tiết tài liệu tải lên</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Tên tài liệu / Tiêu đề</label>
                            <Input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="Nhập tiêu đề..." />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* People Tagging */}
                            <div className="border rounded-md p-3 space-y-3">
                                <label className="text-sm font-medium flex items-center gap-2"><UserPlus className="w-4 h-4" />Những người có mặt trong bức ảnh</label>
                                <TagPicker
                                    options={peopleList.map(p => ({
                                        value: p.handle,
                                        label: p.generation ? `${p.display_name} (Đời ${p.generation})` : p.display_name,
                                        avatar: (
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 overflow-hidden">
                                                {p.avatar_url ? <img src={p.avatar_url} className="w-full h-full object-cover" /> : p.display_name?.charAt(0)}
                                            </div>
                                        )
                                    }))}
                                    value={uploadPeople}
                                    onChange={setUploadPeople}
                                    placeholder="Chọn người..."
                                    searchPlaceholder="Tìm tên..."
                                />
                            </div>

                            {/* Events Tagging */}
                            <div className="border rounded-md p-3 space-y-3">
                                <label className="text-sm font-medium flex items-center gap-2"><Calendar className="w-4 h-4" />Gắn thẻ Sự kiện</label>
                                <TagPicker
                                    options={eventsList.map(e => ({
                                        value: e.id,
                                        label: e.title,
                                        icon: <Calendar className="w-4 h-4 shrink-0" />
                                    }))}
                                    value={uploadEvents}
                                    onChange={setUploadEvents}
                                    placeholder="Chọn sự kiện..."
                                    searchPlaceholder="Tìm sự kiện..."
                                    createLabel="Tạo sự kiện"
                                    emptyText="Chưa có sự kiện này"
                                    onCreate={(val) => handleCreateEvent(val)}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setUploadDialogFile(null)}>Hủy</Button>
                        <Button onClick={handleConfirmUpload} disabled={uploading}>
                            {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Xác nhận Tải lên
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <div className="flex items-center justify-between pr-4">
                            <DialogTitle>{previewItem?.title || previewItem?.file_name}</DialogTitle>
                            {isLoggedIn && (
                                <Button variant="outline" size="sm" onClick={() => {
                                    setEditPeople(previewItem?.tagged_people || []);
                                    setEditEvents(previewItem?.tagged_events || []);
                                    setEditTagsItem(previewItem);
                                }}>
                                    <Edit2 className="w-4 h-4 mr-2" /> Gắn thẻ
                                </Button>
                            )}
                        </div>
                    </DialogHeader>
                    {previewItem && getPublicUrl(previewItem) && (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <img
                                src={getPublicUrl(previewItem)!}
                                alt={previewItem.title || previewItem.file_name}
                                className="max-h-[60vh] object-contain"
                            />

                            {/* Tags display in preview */}
                            <div className="w-full text-left space-y-2">
                                {previewItem.tagged_people && previewItem.tagged_people.length > 0 && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Tags className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Những người có mặt trong bức ảnh:</span>
                                        {previewItem.tagged_people.map(id => {
                                            const p = peopleList.find(x => x.handle === id);
                                            return (
                                                <Badge key={id} variant="secondary" className="gap-1 pr-2 pl-1 py-1 font-medium bg-muted/60">
                                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 overflow-hidden">
                                                        {p?.avatar_url ? <img src={p.avatar_url} className="w-full h-full object-cover" /> : (p?.display_name?.charAt(0) || '?')}
                                                    </div>
                                                    {p?.generation ? `${p.display_name} (Đời ${p.generation})` : (p?.display_name || id)}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                )}
                                {previewItem.tagged_events && previewItem.tagged_events.length > 0 && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Sự kiện:</span>
                                        {previewItem.tagged_events.map(id => {
                                            const e = eventsList.find(x => x.id === id);
                                            return (
                                                <Badge key={id} variant="secondary" className="gap-1 font-medium bg-muted/60">
                                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                                    {e?.title || 'Sự kiện'}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Tags Dialog */}
            <Dialog open={!!editTagsItem} onOpenChange={(open) => !open && setEditTagsItem(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Gắn thẻ: {editTagsItem?.title || editTagsItem?.file_name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* People Tagging */}
                            <div className="border rounded-md p-3 space-y-3">
                                <label className="text-sm font-medium flex items-center gap-2"><UserPlus className="w-4 h-4" />Những người có mặt trong bức ảnh</label>
                                <TagPicker
                                    options={peopleList.map(p => ({
                                        value: p.handle,
                                        label: p.generation ? `${p.display_name} (Đời ${p.generation})` : p.display_name,
                                        avatar: (
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 overflow-hidden">
                                                {p.avatar_url ? <img src={p.avatar_url} className="w-full h-full object-cover" /> : p.display_name?.charAt(0)}
                                            </div>
                                        )
                                    }))}
                                    value={editPeople}
                                    onChange={setEditPeople}
                                    placeholder="Chọn người..."
                                    searchPlaceholder="Tìm tên..."
                                />
                            </div>

                            {/* Events Tagging */}
                            <div className="border rounded-md p-3 space-y-3">
                                <label className="text-sm font-medium flex items-center gap-2"><Calendar className="w-4 h-4" />Sự kiện</label>
                                <TagPicker
                                    options={eventsList.map(e => ({
                                        value: e.id,
                                        label: e.title,
                                        icon: <Calendar className="w-4 h-4 shrink-0" />
                                    }))}
                                    value={editEvents}
                                    onChange={setEditEvents}
                                    placeholder="Chọn sự kiện..."
                                    searchPlaceholder="Tìm sự kiện..."
                                    createLabel="Tạo sự kiện"
                                    emptyText="Chưa có sự kiện này"
                                    onCreate={(val) => handleCreateEvent(val, true)}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setEditTagsItem(null)}>Hủy</Button>
                        <Button onClick={handleSaveTags} disabled={savingTags}>
                            {savingTags && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Lưu thay đổi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
