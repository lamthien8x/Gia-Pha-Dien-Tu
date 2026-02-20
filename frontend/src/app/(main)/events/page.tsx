'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    CalendarDays,
    MapPin,
    Clock,
    Users,
    Plus,
    ChevronLeft,
    ChevronRight,
    User,
    Check,
    X,
    HelpCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

// === Types ===

interface EventItem {
    id: string;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    location: string | null;
    type: string;
    isRecurring: boolean;
    creator: { id: string; displayName: string; avatarUrl: string | null };
    _count: { rsvps: number };
}

interface RsvpItem {
    id: string;
    status: string;
    guestsCount: number;
    note: string | null;
    user: { id: string; displayName: string; avatarUrl: string | null };
}

// === Helpers ===

const typeLabels: Record<string, { label: string; emoji: string }> = {
    MEMORIAL: { label: 'Giỗ', emoji: '🕯️' },
    MEETING: { label: 'Họp họ', emoji: '🤝' },
    FESTIVAL: { label: 'Lễ hội', emoji: '🎊' },
    BIRTHDAY: { label: 'Sinh nhật', emoji: '🎂' },
    GENERAL: { label: 'Khác', emoji: '📋' },
};

const rsvpStatusLabels: Record<string, { label: string; icon: typeof Check; variant: 'default' | 'secondary' | 'destructive' }> = {
    GOING: { label: 'Tham dự', icon: Check, variant: 'default' },
    MAYBE: { label: 'Có thể', icon: HelpCircle, variant: 'secondary' },
    NOT_GOING: { label: 'Không đi', icon: X, variant: 'destructive' },
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

// === Create Event Dialog ===

function CreateEventDialog({ onCreated }: { onCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('MEMORIAL');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !startAt) return;
        setSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!token || !apiUrl) return;

            const res = await fetch(`${apiUrl}/events`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description: description || undefined,
                    startAt: new Date(startAt).toISOString(),
                    endAt: endAt ? new Date(endAt).toISOString() : undefined,
                    location: location || undefined,
                    type,
                }),
            });
            if (res.ok) {
                setOpen(false);
                setTitle(''); setDescription(''); setStartAt(''); setEndAt(''); setLocation('');
                onCreated();
            }
        } catch { /* ignore */ } finally { setSubmitting(false); }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Tạo sự kiện</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Tạo sự kiện mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                        {Object.entries(typeLabels).map(([key, { label, emoji }]) => (
                            <option key={key} value={key}>{emoji} {label}</option>
                        ))}
                    </select>
                    <Input placeholder="Tên sự kiện *" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Textarea placeholder="Mô tả chi tiết" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-muted-foreground">Bắt đầu *</label>
                            <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">Kết thúc</label>
                            <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
                        </div>
                    </div>
                    <Input placeholder="Địa điểm" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <Button onClick={handleSubmit} disabled={!title.trim() || !startAt || submitting} className="w-full">
                        {submitting ? 'Đang tạo...' : 'Tạo sự kiện'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// === Event Card ===

function EventCard({ event }: { event: EventItem }) {
    const router = useRouter();
    const typeInfo = typeLabels[event.type] || { label: event.type, emoji: '📋' };
    const isPast = new Date(event.startAt) < new Date();

    return (
        <Card
            className={`cursor-pointer hover:shadow-md transition-shadow ${isPast ? 'opacity-60' : ''}`}
            onClick={() => router.push(`/events/${event.id}`)}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    {/* Date block */}
                    <div className="bg-primary/10 rounded-lg p-2 text-center min-w-[56px]">
                        <div className="text-xs text-primary font-medium">
                            {new Date(event.startAt).toLocaleDateString('vi-VN', { month: 'short' })}
                        </div>
                        <div className="text-2xl font-bold text-primary">
                            {new Date(event.startAt).getDate()}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold truncate">{event.title}</h3>
                            <Badge variant="outline" className="text-xs">
                                {typeInfo.emoji} {typeInfo.label}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatTime(event.startAt)}
                            </span>
                            {event.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {event.location}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {event._count.rsvps} đăng ký
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// === Main Events Page ===

export default function EventsPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [typeFilter, setTypeFilter] = useState('');

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!token || !apiUrl) return;

            const params = new URLSearchParams({ page: String(page), limit: '20' });
            if (typeFilter) params.set('type', typeFilter);

            const res = await fetch(`${apiUrl}/events?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const json = await res.json();
                setEvents(json.data);
                setTotalPages(json.meta.totalPages);
            }
        } catch { /* ignore */ } finally { setLoading(false); }
    }, [page, typeFilter]);

    useEffect(() => { fetchEvents(); }, [fetchEvents]);
    useEffect(() => { setPage(1); }, [typeFilter]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <CalendarDays className="h-6 w-6" />
                        Sự kiện & Lịch Dòng họ
                    </h1>
                    <p className="text-muted-foreground">
                        Giỗ, họp họ, lễ hội và các sự kiện quan trọng
                    </p>
                </div>
                <CreateEventDialog onCreated={fetchEvents} />
            </div>

            {/* Type filters */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={typeFilter === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTypeFilter('')}
                >
                    Tất cả
                </Button>
                {Object.entries(typeLabels).map(([key, { label, emoji }]) => (
                    <Button
                        key={key}
                        variant={typeFilter === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTypeFilter(key)}
                    >
                        {emoji} {label}
                    </Button>
                ))}
            </div>

            {/* Event list */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : events.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Chưa có sự kiện nào</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                        <ChevronLeft className="h-4 w-4" /> Trước
                    </Button>
                    <span className="text-sm text-muted-foreground">Trang {page} / {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                        Sau <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
