'use client';

import { useEffect, useState, useCallback } from 'react';
import { Check, X, Clock, MessageSquarePlus, ExternalLink, RefreshCw, ChevronDown, ChevronRight, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────
interface Contribution {
    id: string;
    author_id: string;
    author_email: string;
    person_handle: string;
    person_name: string;
    field_name: string;
    field_label: string;
    old_value: string | null;
    new_value: string;
    note: string | null;
    status: 'pending' | 'approved' | 'rejected';
    admin_note: string | null;
    created_at: string;
    reviewed_at: string | null;
}

// Fields that map directly to people table columns
const PEOPLE_FIELD_MAP: Record<string, string> = {
    display_name: 'display_name',
    surname: 'surname',
    first_name: 'first_name',
    nick_name: 'nick_name',
    birth_year: 'birth_year',
    birth_date: 'birth_date',
    birth_place: 'birth_place',
    death_year: 'death_year',
    death_date: 'death_date',
    death_place: 'death_place',
    phone: 'phone',
    email: 'email',
    zalo: 'zalo',
    facebook: 'facebook',
    hometown: 'hometown',
    current_address: 'current_address',
    occupation: 'occupation',
    company: 'company',
    education: 'education',
    biography: 'biography',
    notes: 'notes',
    gender: 'gender',
};

const STATUS_COLORS = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
};
const STATUS_LABELS = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' };

// ─── Main Page ───────────────────────────────────────────────
export default function AdminEditsPage() {
    const { isAdmin, loading: authLoading, user } = useAuth();
    const router = useRouter();
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
    // Group by person for easier review
    const [expandedPersons, setExpandedPersons] = useState<Set<string>>(new Set());
    const [bulkProcessing, setBulkProcessing] = useState<string | null>(null); // personHandle

    const fetchContributions = useCallback(async () => {
        setLoading(true);
        let query = supabase.from('contributions').select('*').order('created_at', { ascending: false });
        if (filter !== 'all') query = query.eq('status', filter);
        const { data } = await query;
        setContributions((data as Contribution[]) || []);
        setLoading(false);
    }, [filter]);

    useEffect(() => {
        if (!authLoading && !isAdmin) { router.push('/tree'); return; }
        if (!authLoading && isAdmin) fetchContributions();
    }, [authLoading, isAdmin, fetchContributions, router]);

    // Approve single contribution AND apply to DB
    const handleApprove = async (c: Contribution) => {
        setProcessingId(c.id);
        try {
            // 1. Apply to people table if field is known
            const dbField = PEOPLE_FIELD_MAP[c.field_name];
            if (dbField) {
                const val = ['birth_year', 'death_year', 'gender'].includes(c.field_name)
                    ? parseInt(c.new_value) || null
                    : c.new_value;
                await supabase.from('people').update({ [dbField]: val }).eq('handle', c.person_handle);
            }
            // 2. Mark as approved
            await supabase.from('contributions').update({
                status: 'approved',
                admin_note: adminNotes[c.id] || null,
                reviewed_by: user?.id,
                reviewed_at: new Date().toISOString(),
            }).eq('id', c.id);
        } finally {
            setProcessingId(null);
            fetchContributions();
        }
    };

    // Reject single contribution
    const handleReject = async (id: string) => {
        setProcessingId(id);
        await supabase.from('contributions').update({
            status: 'rejected',
            admin_note: adminNotes[id] || null,
            reviewed_by: user?.id,
            reviewed_at: new Date().toISOString(),
        }).eq('id', id);
        setProcessingId(null);
        fetchContributions();
    };

    // Approve ALL pending for a person in one click
    const handleApproveAll = async (personHandle: string) => {
        setBulkProcessing(personHandle);
        const pending = contributions.filter(c => c.person_handle === personHandle && c.status === 'pending');
        for (const c of pending) {
            const dbField = PEOPLE_FIELD_MAP[c.field_name];
            if (dbField) {
                const val = ['birth_year', 'death_year', 'gender'].includes(c.field_name)
                    ? parseInt(c.new_value) || null
                    : c.new_value;
                await supabase.from('people').update({ [dbField]: val }).eq('handle', c.person_handle);
            }
            await supabase.from('contributions').update({
                status: 'approved',
                reviewed_by: user?.id,
                reviewed_at: new Date().toISOString(),
            }).eq('id', c.id);
        }
        setBulkProcessing(null);
        fetchContributions();
    };

    // Group contributions by person
    const grouped = contributions.reduce<Record<string, Contribution[]>>((acc, c) => {
        const key = c.person_handle;
        if (!acc[key]) acc[key] = [];
        acc[key].push(c);
        return acc;
    }, {});

    const pendingCount = contributions.filter(c => c.status === 'pending').length;
    const togglePerson = (handle: string) => {
        setExpandedPersons(prev => {
            const next = new Set(prev);
            next.has(handle) ? next.delete(handle) : next.add(handle);
            return next;
        });
    };

    if (authLoading) return (
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <MessageSquarePlus className="h-5 w-5" />
                        Duyệt đóng góp thông tin
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {pendingCount > 0
                            ? <><span className="font-semibold text-amber-600">{pendingCount}</span> đóng góp đang chờ duyệt</>
                            : 'Không có đóng góp nào chờ duyệt 🎉'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchContributions} disabled={loading}>
                        <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                        Tải lại
                    </Button>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 border rounded-lg overflow-hidden text-xs w-fit">
                {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 font-medium transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                        {f === 'all' ? 'Tất cả' : STATUS_LABELS[f]}
                        {f === 'pending' && pendingCount > 0 && (
                            <span className="ml-1.5 bg-amber-500 text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
            ) : Object.keys(grouped).length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
                        <Clock className="h-8 w-8 opacity-30" />
                        <p className="text-sm">Không có đóng góp nào {filter !== 'all' ? `(${STATUS_LABELS[filter]})` : ''}</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {Object.entries(grouped).map(([personHandle, items]) => {
                        const pendingItems = items.filter(c => c.status === 'pending');
                        const isExpanded = expandedPersons.has(personHandle);
                        const personName = items[0].person_name || personHandle;

                        return (
                            <Card key={personHandle} className={pendingItems.length > 0 ? 'border-amber-300/70 shadow-sm' : ''}>
                                {/* Person header */}
                                <div
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 rounded-t-xl transition-colors"
                                    onClick={() => togglePerson(personHandle)}
                                >
                                    <div className="flex items-center gap-3">
                                        {isExpanded
                                            ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        }
                                        <div>
                                            <p className="font-semibold text-sm">{personName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {personHandle} · {items.length} đóng góp
                                                {pendingItems.length > 0 && <span className="text-amber-600 font-medium"> · {pendingItems.length} chờ duyệt</span>}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                        <Button
                                            variant="ghost" size="sm"
                                            className="h-7 text-xs gap-1"
                                            onClick={() => router.push(`/people/${personHandle}`)}
                                        >
                                            <ExternalLink className="h-3 w-3" /> Xem profile
                                        </Button>
                                        {pendingItems.length > 1 && (
                                            <Button
                                                size="sm"
                                                className="h-7 text-xs gap-1 bg-green-600 hover:bg-green-700"
                                                disabled={bulkProcessing === personHandle}
                                                onClick={() => handleApproveAll(personHandle)}
                                            >
                                                {bulkProcessing === personHandle
                                                    ? <RefreshCw className="h-3 w-3 animate-spin" />
                                                    : <CheckCheck className="h-3 w-3" />
                                                }
                                                Duyệt tất cả ({pendingItems.length})
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Contributions list */}
                                {isExpanded && (
                                    <div className="border-t divide-y">
                                        {items.map(c => (
                                            <div key={c.id} className="px-4 py-3 flex items-start gap-3">
                                                <div className="flex-1 min-w-0 space-y-1.5">
                                                    {/* Field + status */}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[c.status]}`}>
                                                            {STATUS_LABELS[c.status]}
                                                        </span>
                                                        <span className="text-xs font-medium text-primary">
                                                            {c.field_label || c.field_name}
                                                        </span>
                                                        {!PEOPLE_FIELD_MAP[c.field_name] && (
                                                            <Badge variant="outline" className="text-[9px] text-orange-600 border-orange-300">
                                                                Cần xử lý thủ công
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Value */}
                                                    <div className="bg-muted/40 rounded-lg px-3 py-2">
                                                        <p className="text-sm font-medium break-words">{c.new_value}</p>
                                                        {c.note && (
                                                            <p className="text-xs text-muted-foreground mt-1 italic">📝 {c.note}</p>
                                                        )}
                                                    </div>

                                                    {/* Meta */}
                                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                                                        <span>📧 {c.author_email}</span>
                                                        <span>·</span>
                                                        <span>{new Date(c.created_at).toLocaleString('vi-VN')}</span>
                                                        {c.admin_note && (
                                                            <>
                                                                <span>·</span>
                                                                <span className="text-blue-600">💬 {c.admin_note}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                {c.status === 'pending' && (
                                                    <div className="flex flex-col gap-1.5 flex-shrink-0 items-end">
                                                        <Input
                                                            placeholder="Ghi chú (tuỳ chọn)..."
                                                            className="text-xs h-7 w-40"
                                                            value={adminNotes[c.id] || ''}
                                                            onChange={e => setAdminNotes(prev => ({ ...prev, [c.id]: e.target.value }))}
                                                        />
                                                        <div className="flex gap-1">
                                                            <Button
                                                                size="sm"
                                                                className="h-7 text-xs px-2.5 bg-green-600 hover:bg-green-700 gap-1"
                                                                disabled={processingId === c.id}
                                                                onClick={() => handleApprove(c)}
                                                            >
                                                                {processingId === c.id
                                                                    ? <RefreshCw className="h-3 w-3 animate-spin" />
                                                                    : <Check className="h-3 w-3" />
                                                                }
                                                                Duyệt & lưu
                                                            </Button>
                                                            <Button
                                                                size="sm" variant="outline"
                                                                className="h-7 text-xs px-2.5 text-red-600 border-red-200 hover:bg-red-50 gap-1"
                                                                disabled={processingId === c.id}
                                                                onClick={() => handleReject(c.id)}
                                                            >
                                                                <X className="h-3 w-3" /> Từ chối
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
