'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Image as ImageIcon, Upload, Search, Check, X, Loader2, FileImage, FileVideo, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';

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

    const fetchMedia = useCallback(async (state?: string) => {
        setLoading(true);
        let query = supabase.from('media').select('*, uploader:profiles(display_name, email)').order('created_at', { ascending: false });
        if (state && state !== 'all') query = query.eq('state', state);
        const { data } = await query;
        if (data) setItems(data);
        setLoading(false);
    }, []);

    useEffect(() => { fetchMedia(tab === 'all' ? undefined : tab); }, [tab, fetchMedia]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        setUploading(true);

        try {
            // Tạo file path: user_id/timestamp_filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
            const filePath = `${user.id}/${fileName}`;

            // Upload file lên Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                setError(`Lỗi upload: ${uploadError.message}`);
                return;
            }

            // Lấy public URL
            const { data: urlData } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            // Insert metadata vào media table
            const { error: dbError } = await supabase.from('media').insert({
                file_name: fileName,
                mime_type: file.type,
                file_size: file.size,
                state: 'PENDING',
                uploader_id: user.id,
                title: file.name,
            });

            if (dbError) {
                console.error('DB error:', dbError);
                setError(`Lỗi lưu metadata: ${dbError.message}`);
                return;
            }

            // Refresh danh sách
            fetchMedia(tab === 'all' ? undefined : tab);
        } catch (err) {
            console.error('Upload error:', err);
            setError('Upload thất bại. Vui lòng thử lại.');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        const newState = action === 'approve' ? 'PUBLISHED' : 'REJECTED';
        await supabase.from('media').update({ state: newState }).eq('id', id);
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
                        <input ref={fileRef} type="file" className="hidden" accept="image/*,video/*,.pdf" onChange={handleUpload} />
                        <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
                            <Upload className="mr-2 h-4 w-4" />{uploading ? 'Đang tải...' : 'Tải lên'}
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

            {/* Preview Dialog */}
            <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{previewItem?.title || previewItem?.file_name}</DialogTitle>
                    </DialogHeader>
                    {previewItem && getPublicUrl(previewItem) && (
                        <div className="flex items-center justify-center">
                            <img
                                src={getPublicUrl(previewItem)!}
                                alt={previewItem.title || previewItem.file_name}
                                className="max-h-[70vh] object-contain"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
