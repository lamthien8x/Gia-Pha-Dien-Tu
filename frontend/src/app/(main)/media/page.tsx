'use client';

import { useEffect, useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Search, Filter, Check, X, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MediaItem {
    id: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    title?: string;
    description?: string;
    state: 'PENDING' | 'PUBLISHED' | 'REJECTED';
    createdAt: string;
    uploader?: { displayName: string };
    signedUrl?: string;
}

const STATE_BADGE: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
    PENDING: { variant: 'secondary', label: 'Chờ duyệt' },
    PUBLISHED: { variant: 'default', label: 'Đã duyệt' },
    REJECTED: { variant: 'destructive', label: 'Bị từ chối' },
};

export default function MediaLibraryPage() {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('all');
    const [uploadOpen, setUploadOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMedia = async (state?: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const url = state && state !== 'all'
                ? `${process.env.NEXT_PUBLIC_API_URL}/media?state=${state}`
                : `${process.env.NEXT_PUBLIC_API_URL}/media`;
            const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) throw new Error('Failed');
            const json = await res.json();
            setMedia(json.data || []);
        } catch {
            setMedia([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia(tab === 'all' ? undefined : tab);
    }, [tab]);

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (!formData.get('file')) return;

        try {
            setUploading(true);
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (res.ok) {
                setUploadOpen(false);
                fetchMedia(tab === 'all' ? undefined : tab);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        const token = localStorage.getItem('accessToken');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/${id}/${action}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchMedia(tab === 'all' ? undefined : tab);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1048576).toFixed(1)} MB`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ImageIcon className="h-6 w-6" />
                        Thư viện tư liệu
                    </h1>
                    <p className="text-muted-foreground">{media.length} tư liệu</p>
                </div>

                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Upload className="mr-2 h-4 w-4" />
                            Tải lên
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tải lên tư liệu mới</DialogTitle>
                            <DialogDescription>Hỗ trợ JPG, PNG, PDF (tối đa 10MB)</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpload} className="space-y-4 mt-4">
                            <Input name="file" type="file" accept=".jpg,.jpeg,.png,.pdf" ref={fileInputRef} />
                            <Input name="title" placeholder="Tiêu đề (tùy chọn)" />
                            <Input name="description" placeholder="Mô tả (tùy chọn)" />
                            <Button type="submit" className="w-full" disabled={uploading}>
                                {uploading ? 'Đang tải...' : 'Tải lên'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="PENDING" className="gap-1">
                        <Clock className="h-3.5 w-3.5" /> Chờ duyệt
                    </TabsTrigger>
                    <TabsTrigger value="PUBLISHED" className="gap-1">
                        <Check className="h-3.5 w-3.5" /> Đã duyệt
                    </TabsTrigger>
                    <TabsTrigger value="REJECTED" className="gap-1">
                        <X className="h-3.5 w-3.5" /> Bị từ chối
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={tab}>
                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    ) : media.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
                                <p>Chưa có tư liệu nào</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {media.map((item) => {
                                const badge = STATE_BADGE[item.state];
                                return (
                                    <Card key={item.id} className="overflow-hidden">
                                        {/* Preview area */}
                                        <div className="aspect-video bg-muted flex items-center justify-center">
                                            {item.mimeType.startsWith('image/') && item.signedUrl ? (
                                                <img src={item.signedUrl} alt={item.title || item.fileName} className="object-cover w-full h-full" />
                                            ) : (
                                                <ImageIcon className="h-10 w-10 text-muted-foreground opacity-50" />
                                            )}
                                        </div>
                                        <CardContent className="p-3 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">{item.title || item.fileName}</p>
                                                    <p className="text-xs text-muted-foreground">{formatSize(item.fileSize)} • {item.uploader?.displayName}</p>
                                                </div>
                                                <Badge variant={badge.variant}>{badge.label}</Badge>
                                            </div>
                                            {item.state === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <Button size="sm" className="flex-1" onClick={() => handleAction(item.id, 'approve')}>
                                                        <Check className="h-3 w-3 mr-1" /> Duyệt
                                                    </Button>
                                                    <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleAction(item.id, 'reject')}>
                                                        <X className="h-3 w-3 mr-1" /> Từ chối
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
