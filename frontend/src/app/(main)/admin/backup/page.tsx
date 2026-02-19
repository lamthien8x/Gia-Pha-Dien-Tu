'use client';

import { useEffect, useState } from 'react';
import { Database, Download, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface BackupRecord {
    id: string;
    type: string;
    fileName: string;
    fileSize: number;
    status: string;
    createdAt: string;
    completedAt?: string;
}

export default function BackupPage() {
    const [backups, setBackups] = useState<BackupRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const fetchBackups = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/backup`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed');
            const json = await res.json();
            setBackups(json.data || []);
        } catch {
            setBackups([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBackups(); }, []);

    const createBackup = async () => {
        try {
            setCreating(true);
            const token = localStorage.getItem('accessToken');
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/backup`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchBackups();
        } finally {
            setCreating(false);
        }
    };

    const downloadBackup = (id: string) => {
        const token = localStorage.getItem('accessToken');
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/backup/${id}/download?token=${token}`, '_blank');
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
                        <Database className="h-6 w-6" />
                        Sao lưu & Khôi phục
                    </h1>
                    <p className="text-muted-foreground">Quản lý sao lưu cơ sở dữ liệu</p>
                </div>
                <Button onClick={createBackup} disabled={creating}>
                    <Plus className="mr-2 h-4 w-4" />
                    {creating ? 'Đang tạo...' : 'Tạo backup mới'}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Lịch sử sao lưu</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên file</TableHead>
                                    <TableHead>Loại</TableHead>
                                    <TableHead>Kích thước</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Thời gian</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {backups.map((b) => (
                                    <TableRow key={b.id}>
                                        <TableCell className="font-mono text-xs">{b.fileName}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{b.type}</Badge>
                                        </TableCell>
                                        <TableCell>{formatSize(b.fileSize)}</TableCell>
                                        <TableCell>
                                            <Badge variant={b.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                                {b.status === 'COMPLETED' ? 'Hoàn tất' : b.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs">{new Date(b.createdAt).toLocaleString('vi-VN')}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => downloadBackup(b.id)}>
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {backups.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                            Chưa có bản sao lưu nào
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
