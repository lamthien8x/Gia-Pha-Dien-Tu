'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    MapPin,
    User,
    Users,
    Check,
    X,
    HelpCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EventDetail {
    id: string;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string | null;
    location: string | null;
    type: string;
    isRecurring: boolean;
    creator: { id: string; displayName: string; avatarUrl: string | null };
    rsvps: RsvpItem[];
    _count: { rsvps: number };
}

interface RsvpItem {
    id: string;
    status: string;
    guestsCount: number;
    note: string | null;
    user: { id: string; displayName: string; avatarUrl: string | null };
}

const typeLabels: Record<string, string> = {
    MEMORIAL: '🕯️ Giỗ',
    MEETING: '🤝 Họp họ',
    FESTIVAL: '🎊 Lễ hội',
    BIRTHDAY: '🎂 Sinh nhật',
    GENERAL: '📋 Khác',
};

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [rsvpStatus, setRsvpStatus] = useState('');
    const [guestsCount, setGuestsCount] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                if (!token || !apiUrl) return;

                const res = await fetch(`${apiUrl}/events/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const json = await res.json();
                    setEvent(json.data);
                }
            } catch { /* ignore */ } finally { setLoading(false); }
        };
        fetchEvent();
    }, [params.id]);

    const handleRsvp = async (status: string) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!token || !apiUrl) return;

            const res = await fetch(`${apiUrl}/events/${params.id}/rsvp`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, guestsCount }),
            });
            if (res.ok) {
                setRsvpStatus(status);
                // Refresh event data
                const eventRes = await fetch(`${apiUrl}/events/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (eventRes.ok) {
                    const json = await eventRes.json();
                    setEvent(json.data);
                }
            }
        } catch { /* ignore */ } finally { setSubmitting(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
                </Button>
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        Không tìm thấy sự kiện
                    </CardContent>
                </Card>
            </div>
        );
    }

    const goingCount = event.rsvps.filter(r => r.status === 'GOING').length;
    const maybeCount = event.rsvps.filter(r => r.status === 'MAYBE').length;
    const totalGuests = event.rsvps
        .filter(r => r.status === 'GOING')
        .reduce((sum, r) => sum + 1 + r.guestsCount, 0);

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
            </Button>

            {/* Event info */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-sm">
                            {typeLabels[event.type] || event.type}
                        </Badge>
                        {event.isRecurring && <Badge variant="secondary">Hàng năm</Badge>}
                    </div>

                    <h1 className="text-2xl font-bold">{event.title}</h1>

                    {event.description && (
                        <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            {new Date(event.startAt).toLocaleDateString('vi-VN', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                            })}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-primary" />
                            {new Date(event.startAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            {event.endAt && ` — ${new Date(event.endAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`}
                        </span>
                        {event.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-primary" />
                                {event.location}
                            </span>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Tạo bởi {event.creator.displayName}
                    </p>
                </CardContent>
            </Card>

            {/* RSVP */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Đăng ký tham dự</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-3 items-end">
                        <div>
                            <label className="text-xs text-muted-foreground">Số khách đi cùng</label>
                            <Input
                                type="number"
                                min={0} max={50}
                                value={guestsCount}
                                onChange={(e) => setGuestsCount(parseInt(e.target.value) || 0)}
                                className="w-24"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant={rsvpStatus === 'GOING' ? 'default' : 'outline'}
                            onClick={() => handleRsvp('GOING')}
                            disabled={submitting}
                        >
                            <Check className="h-4 w-4 mr-1" /> Tham dự
                        </Button>
                        <Button
                            variant={rsvpStatus === 'MAYBE' ? 'secondary' : 'outline'}
                            onClick={() => handleRsvp('MAYBE')}
                            disabled={submitting}
                        >
                            <HelpCircle className="h-4 w-4 mr-1" /> Có thể
                        </Button>
                        <Button
                            variant={rsvpStatus === 'NOT_GOING' ? 'destructive' : 'outline'}
                            onClick={() => handleRsvp('NOT_GOING')}
                            disabled={submitting}
                        >
                            <X className="h-4 w-4 mr-1" /> Không đi
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-sm text-muted-foreground pt-2 border-t">
                        <span className="flex items-center gap-1">
                            <Check className="h-4 w-4 text-green-500" />
                            {goingCount} tham dự ({totalGuests} người + khách)
                        </span>
                        <span className="flex items-center gap-1">
                            <HelpCircle className="h-4 w-4 text-yellow-500" />
                            {maybeCount} có thể
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Attendees */}
            {event.rsvps.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Danh sách đăng ký ({event.rsvps.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {event.rsvps.map((rsvp) => (
                                <div key={rsvp.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <span className="text-sm font-medium">{rsvp.user.displayName}</span>
                                        {rsvp.guestsCount > 0 && (
                                            <span className="text-xs text-muted-foreground">+{rsvp.guestsCount} khách</span>
                                        )}
                                    </div>
                                    <Badge variant={
                                        rsvp.status === 'GOING' ? 'default' :
                                            rsvp.status === 'MAYBE' ? 'secondary' : 'destructive'
                                    }>
                                        {rsvp.status === 'GOING' ? 'Tham dự' :
                                            rsvp.status === 'MAYBE' ? 'Có thể' : 'Không đi'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
