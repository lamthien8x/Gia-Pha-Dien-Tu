'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Image as ImageIcon, Upload, Search, Check, X, Loader2, FileImage, FileVideo, FileText, Eye, Tags, Calendar, UserPlus, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><ImageIcon className="h-6 w-6" />Thư viện</h1>
                    <p className="text-muted-foreground">Quản lý hình ảnh và tài liệu</p>
                </div>
                {isLoggedIn && (
                    <div>
                        <input ref={fileRef} type="file" className="hidden" accept="image/*,video/*,.pdf" onChange={handleFileSelect} />
                        <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
                            <Upload className="mr-2 h-4 w-4" />{uploading ? 'Đang chuẩn bị...' : 'Tải lên'}
                        </Button>
                    </div>
                )}
            </div>

            {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => setError('')}>✕</Button>
                </div>
            )}

            <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="PENDING">Chờ duyệt</TabsTrigger>
                    <TabsTrigger value="PUBLISHED">Đã duyệt</TabsTrigger>
                </TabsList>
            </Tabs>

            {loading ? (
                <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : items.length === 0 ? (
                <Card><CardContent className="flex flex-col items-center justify-center py-12">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Chưa có tài liệu nào</p>
                </CardContent></Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map(item => {
                        const publicUrl = getPublicUrl(item);
                        const isImage = item.mime_type?.startsWith('image/');
                        return (
                            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <div
                                    className="aspect-square bg-muted flex items-center justify-center cursor-pointer relative group"
                                    onClick={() => isImage && setPreviewItem(item)}
                                >
                                    {isImage && publicUrl ? (
                                        <>
                                            <img
                                                src={publicUrl}
                                                alt={item.title || item.file_name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Eye className="h-8 w-8 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-4">
                                            {getFileIcon(item.mime_type)}
                                            <p className="text-xs text-muted-foreground mt-2 truncate">{item.file_name}</p>
                                        </div>
                                    )}
                                    <Badge
                                        variant={STATE_BADGE[item.state]?.variant || 'secondary'}
                                        className="absolute top-2 right-2"
                                    >
                                        {STATE_BADGE[item.state]?.label || item.state}
                                    </Badge>
                                </div>
                                <CardContent className="p-3 space-y-2">
                                    <p className="font-medium text-sm truncate">{item.title || item.file_name}</p>
                                    <p className="text-xs text-muted-foreground">{formatSize(item.file_size)} · {item.mime_type}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.uploader?.display_name || item.uploader?.email?.split('@')[0] || 'Ẩn danh'} · {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                    </p>
                                    {item.tagged_people && item.tagged_people.length > 0 && (
                                        <div className="flex -space-x-2 overflow-hidden mt-2">
                                            {item.tagged_people.map((id) => {
                                                const p = peopleList.find(x => x.handle === id);
                                                if (!p) return null;
                                                return (
                                                    <div key={id} className="inline-block h-6 w-6 rounded-full ring-2 ring-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary" title={p.display_name}>
                                                        {p.avatar_url ? <img src={p.avatar_url} className="w-full h-full rounded-full object-cover" /> : (p.display_name?.charAt(0) || '?')}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {item.tagged_events && item.tagged_events.length > 0 && (
                                        <div className="flex gap-1 flex-wrap mt-1">
                                            {item.tagged_events.map((id) => {
                                                const e = eventsList.find(x => x.id === id);
                                                if (!e) return null;
                                                return (
                                                    <Badge key={id} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-muted/50 rounded-sm">
                                                        {e.title}
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {isAdmin && item.state === 'PENDING' && (
                                        <div className="flex gap-2 pt-2">
                                            <Button size="sm" variant="outline" className="flex-1" onClick={() => handleAction(item.id, 'approve')}>
                                                <Check className="h-3 w-3 mr-1" />Duyệt
                                            </Button>
                                            <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleAction(item.id, 'reject')}>
                                                <X className="h-3 w-3 mr-1" />Từ chối
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

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
