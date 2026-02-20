'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    Bell,
    Check,
    CheckCheck,
    ExternalLink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NotificationItem {
    id: string;
    type: string;
    title: string;
    message: string;
    linkUrl: string | null;
    isRead: boolean;
    createdAt: string;
}

const typeIcons: Record<string, string> = {
    NEW_POST: '📝',
    NEW_COMMENT: '💬',
    EVENT_REMINDER: '🔔',
    RSVP_UPDATE: '✅',
    SYSTEM: '⚙️',
};

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!token || !apiUrl) return;

            const res = await fetch(`${apiUrl}/notifications?page=${page}&limit=20`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const json = await res.json();
                setNotifications(json.data);
                setTotalPages(json.meta.totalPages);
                setUnreadCount(json.unreadCount);
            }
        } catch { /* ignore */ } finally { setLoading(false); }
    }, [page]);

    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!token || !apiUrl) return;

            await fetch(`${apiUrl}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
            );
            setUnreadCount((c) => Math.max(0, c - 1));
        } catch { /* ignore */ }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!token || !apiUrl) return;

            await fetch(`${apiUrl}/notifications/read-all`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch { /* ignore */ }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Bell className="h-6 w-6" />
                        Thông báo
                    </h1>
                    <p className="text-muted-foreground">
                        {unreadCount > 0 ? `${unreadCount} chưa đọc` : 'Tất cả đã đọc'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                        <CheckCheck className="h-4 w-4 mr-1" />
                        Đánh dấu tất cả đã đọc
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : notifications.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Chưa có thông báo nào</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notif) => (
                        <Card
                            key={notif.id}
                            className={`cursor-pointer transition-colors ${!notif.isRead ? 'bg-primary/5 border-primary/20' : ''}`}
                            onClick={() => {
                                if (!notif.isRead) markAsRead(notif.id);
                                if (notif.linkUrl) router.push(notif.linkUrl);
                            }}
                        >
                            <CardContent className="p-4 flex items-start gap-3">
                                <span className="text-lg">{typeIcons[notif.type] || '📌'}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{notif.title}</span>
                                        {!notif.isRead && (
                                            <Badge variant="default" className="text-xs">Mới</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(notif.createdAt).toLocaleDateString('vi-VN', {
                                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                {notif.linkUrl && (
                                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                        Trang trước
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Trang {page} / {totalPages}
                    </span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                        Trang sau
                    </Button>
                </div>
            )}
        </div>
    );
}
