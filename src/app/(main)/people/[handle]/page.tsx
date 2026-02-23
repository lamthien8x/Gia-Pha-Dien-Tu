'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Users, Image as ImageIcon, History, MapPin, Briefcase, Phone, MessageCircle, Heart, Lock, GitBranch, ArrowLeft, Pencil, FileText, Check, AlertCircle, Trash2, X, Save, Loader2, FileImage, FileVideo, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { zodiacYear } from '@/lib/genealogy-types';
import type { PersonDetail } from '@/lib/genealogy-types';
import { CommentSection } from '@/components/comment-section';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';
import { mediaApi } from '@/lib/api';

// ─── Types for relationship display ──────────────────────────
interface FamilyRelation {
    handle: string;
    fatherHandle?: string;
    motherHandle?: string;
    children: string[];
}
interface RelatedPerson {
    handle: string;
    display_name: string;
    gender: number;
    generation: number;
    is_living: boolean;
    avatar_url?: string;
    birth_year?: number;
}

// ─── Mini person card for relationships ──────────────────────
function PersonMiniCard({ person, role }: { person: RelatedPerson; role?: string }) {
    return (
        <Link
            href={`/people/${person.handle}`}
            className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-accent/50 transition-colors group"
        >
            <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${person.gender === 1 ? 'bg-blue-500' : 'bg-pink-400'}`}>
                    {person.avatar_url ? (
                        <img src={person.avatar_url} alt={person.display_name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        person.display_name.charAt(0)
                    )}
                </div>
                {person.is_living ? (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                ) : (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-slate-400 border-2 border-white rounded-full" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                    {person.display_name}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {role && <span className="font-medium text-primary/80">{role}</span>}
                    {role && <span>·</span>}
                    <span>{person.gender === 1 ? 'Nam' : 'Nữ'}</span>
                    <span>·</span>
                    <span>Đời {person.generation}</span>
                    {person.birth_year && (
                        <>
                            <span>·</span>
                            <span>{person.birth_year}</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}

// ─── Inline edit field component ────────────────────────────
function EditableField({
    label, value, displayValue, fieldKey, personHandle, type = 'text',
    options,
    onSaved,
}: {
    label: string;
    value: string | number | boolean | undefined | null;
    displayValue?: React.ReactNode;
    fieldKey: string;
    personHandle: string;
    type?: 'text' | 'number' | 'textarea' | 'select';
    options?: { value: string; label: string }[];
    onSaved: (key: string, val: string) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(String(value ?? ''));
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        let finalValue: any = draft || null;
        if (type === 'select' && (draft === 'true' || draft === 'false')) {
            finalValue = draft === 'true';
        } else if (type === 'select' && fieldKey === 'gender') {
            finalValue = parseInt(draft, 10);
        }

        const { error } = await supabase
            .from('people')
            .update({ [fieldKey]: finalValue })
            .eq('handle', personHandle);
        setSaving(false);
        if (!error) {
            onSaved(fieldKey, draft);
            setEditing(false);
        } else {
            console.error(error);
            alert('Lỗi cập nhật: ' + error.message);
        }
    };

    const handleCancel = () => { setDraft(String(value ?? '')); setEditing(false); };

    if (!editing) {
        return (
            <div className="group flex items-start justify-between gap-2">
                <div>
                    <p className="text-xs font-medium text-muted-foreground">{label}</p>
                    <p className="text-sm">{displayValue ?? value ?? <span className="text-muted-foreground italic">—</span>}</p>
                </div>
                <button
                    onClick={() => { setDraft(String(value ?? '')); setEditing(true); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                    title="Chỉnh sửa"
                >
                    <Pencil className="h-3.5 w-3.5" />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            {type === 'textarea' ? (
                <textarea
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    autoFocus
                    rows={3}
                    className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background resize-y"
                />
            ) : type === 'select' ? (
                <select
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    autoFocus
                    className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background"
                >
                    {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            ) : (
                <Input
                    type={type}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    autoFocus
                    className="h-8 text-sm"
                    onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                />
            )}
            <div className="flex gap-1">
                <Button size="sm" className="h-7 px-2" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                </Button>
                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={handleCancel}>
                    <X className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}

// ─── Static InfoRow (for non-admin view) ────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="text-sm">{value}</p>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────
export default function PersonProfilePage() {
    const params = useParams();
    const router = useRouter();
    const handle = params.handle as string;
    const { isAdmin } = useAuth();

    const [person, setPerson] = useState<PersonDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    // Relationship data
    const [relFamilies, setRelFamilies] = useState<FamilyRelation[]>([]);
    const [relPeople, setRelPeople] = useState<Map<string, RelatedPerson>>(new Map());

    // Media data
    const [personMedia, setPersonMedia] = useState<any[]>([]);
    const [mediaLoading, setMediaLoading] = useState(true);

    useEffect(() => {
        const fetchPerson = async () => {
            try {
                const { data, error } = await supabase
                    .from('people')
                    .select('*')
                    .eq('handle', handle)
                    .single();
                if (!error && data) {
                    const row = data as Record<string, unknown>;
                    setPerson({
                        handle: row.handle as string,
                        displayName: row.display_name as string,
                        avatarUrl: row.avatar_url as string | undefined,
                        gender: row.gender as number,
                        birthYear: row.birth_year as number | undefined,
                        deathYear: row.death_year as number | undefined,
                        generation: row.generation as number,
                        isLiving: row.is_living as boolean,
                        isPrivacyFiltered: row.is_privacy_filtered as boolean,
                        isPatrilineal: row.is_patrilineal as boolean,
                        families: (row.families as string[]) || [],
                        parentFamilies: (row.parent_families as string[]) || [],
                        phone: row.phone as string | undefined,
                        email: row.email as string | undefined,
                        currentAddress: row.current_address as string | undefined,
                        hometown: row.hometown as string | undefined,
                        occupation: row.occupation as string | undefined,
                        education: row.education as string | undefined,
                        notes: row.notes as string | undefined,
                        surname: row.surname as string | undefined,
                        firstName: row.first_name as string | undefined,
                        birthDate: row.birth_date as string | undefined,
                        birthPlace: row.birth_place as string | undefined,
                        deathDate: row.death_date as string | undefined,
                        deathPlace: row.death_place as string | undefined,
                        zalo: row.zalo as string | undefined,
                        facebook: row.facebook as string | undefined,
                        company: row.company as string | undefined,
                        nickName: row.nick_name as string | undefined,
                        biography: row.biography as string | undefined,
                    } as PersonDetail);
                }
            } catch { /* ignore */ }
            setLoading(false);
        };
        fetchPerson();
    }, [handle]);

    // Fetch relationship details when person loads
    useEffect(() => {
        if (!person) return;
        const allFamilyHandles = [...(person.parentFamilies || []), ...(person.families || [])];
        if (allFamilyHandles.length === 0) return;

        const fetchRelations = async () => {
            // Step 1: Fetch all directly related families
            const { data: famData } = await supabase
                .from('families')
                .select('handle, father_handle, mother_handle, children')
                .in('handle', allFamilyHandles);
            if (!famData) return;

            let families: FamilyRelation[] = famData.map(f => ({
                handle: f.handle,
                fatherHandle: f.father_handle || undefined,
                motherHandle: f.mother_handle || undefined,
                children: (f.children as string[]) || [],
            }));

            // Step 2: Collect parent handles from parentFamilies to find their spouses
            const parentHandles = new Set<string>();
            const parentFams = families.filter(f => (person.parentFamilies || []).includes(f.handle));
            for (const fam of parentFams) {
                if (fam.fatherHandle) parentHandles.add(fam.fatherHandle);
                if (fam.motherHandle) parentHandles.add(fam.motherHandle);
            }

            // Step 3: Fetch parents' families arrays to find their spouse families
            if (parentHandles.size > 0) {
                const { data: parentPeople } = await supabase
                    .from('people')
                    .select('handle, families')
                    .in('handle', Array.from(parentHandles));
                if (parentPeople) {
                    const extraFamHandles = new Set<string>();
                    for (const pp of parentPeople) {
                        for (const fh of ((pp.families as string[]) || [])) {
                            if (!allFamilyHandles.includes(fh)) extraFamHandles.add(fh);
                        }
                    }
                    if (extraFamHandles.size > 0) {
                        const { data: extraFamData } = await supabase
                            .from('families')
                            .select('handle, father_handle, mother_handle, children')
                            .in('handle', Array.from(extraFamHandles));
                        if (extraFamData) {
                            const extraFamilies = extraFamData.map(f => ({
                                handle: f.handle,
                                fatherHandle: f.father_handle || undefined,
                                motherHandle: f.mother_handle || undefined,
                                children: (f.children as string[]) || [],
                            }));
                            families = [...families, ...extraFamilies];
                        }
                    }
                }
            }

            setRelFamilies(families);

            // Step 4: Collect ALL related person handles
            const personHandles = new Set<string>();
            for (const f of families) {
                if (f.fatherHandle) personHandles.add(f.fatherHandle);
                if (f.motherHandle) personHandles.add(f.motherHandle);
                for (const ch of f.children) personHandles.add(ch);
            }
            personHandles.delete(handle); // exclude self

            if (personHandles.size === 0) return;

            const { data: peopleData } = await supabase
                .from('people')
                .select('handle, display_name, gender, generation, is_living, avatar_url, birth_year')
                .in('handle', Array.from(personHandles));

            if (peopleData) {
                const map = new Map<string, RelatedPerson>();
                for (const p of peopleData) map.set(p.handle, p as RelatedPerson);
                setRelPeople(map);
            }
        };
        fetchRelations();
    }, [person, handle]);

    useEffect(() => {
        if (!handle) return;
        const fetchPersonMedia = async () => {
            setMediaLoading(true);
            const res = await mediaApi.listByPerson(handle);
            if (res.data) setPersonMedia(res.data);
            setMediaLoading(false);
        };
        fetchPersonMedia();
    }, [handle]);

    // Called by EditableField when a save succeeds
    const handleFieldSaved = useCallback((fieldKey: string, val: string) => {
        const keyMap: Record<string, keyof PersonDetail> = {
            display_name: 'displayName', birth_year: 'birthYear', death_year: 'deathYear',
            birth_place: 'birthPlace', death_place: 'deathPlace', phone: 'phone',
            email: 'email', zalo: 'zalo', facebook: 'facebook',
            current_address: 'currentAddress', hometown: 'hometown',
            occupation: 'occupation', company: 'company', education: 'education',
            notes: 'notes', biography: 'biography', nick_name: 'nickName',
            surname: 'surname', first_name: 'firstName',
            is_living: 'isLiving', gender: 'gender'
        };
        const domainKey = keyMap[fieldKey];
        if (domainKey && person) {
            let newVal: any = val || undefined;
            if (fieldKey === 'is_living') newVal = val === 'true';
            if (fieldKey === 'gender') newVal = parseInt(val, 10);
            if (fieldKey === 'birth_year' || fieldKey === 'death_year') newVal = val ? parseInt(val, 10) : undefined;

            setPerson(prev => prev ? { ...prev, [domainKey]: newVal } : prev);
        }
        setSaveMsg('✅ Đã lưu!');
        setTimeout(() => setSaveMsg(''), 2000);
    }, [person]);

    const handleDelete = async () => {
        if (!confirm('Bạn có chắc chắn muốn xoá thành viên này? Hành động này không thể hoàn tác và sẽ gỡ bỏ họ khỏi cây phả hệ.')) return;
        setIsDeleting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/people/${handle}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.access_token || ''}`
                }
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete');
            }
            router.push('/tree');
        } catch (err: any) {
            alert('Lỗi: ' + err.message);
            setIsDeleting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );

    if (!person) return (
        <div className="text-center py-20">
            <p className="text-muted-foreground">Không tìm thấy người này</p>
            <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />Quay lại
            </Button>
        </div>
    );

    const genderLabel = person.gender === 1 ? 'Nam' : person.gender === 2 ? 'Nữ' : 'Không rõ';

    // Helper: render a field as editable (admin) or static (others)
    const Field = ({ label, value, displayValue, fieldKey, type, options }: {
        label: string;
        value: string | number | boolean | undefined | null;
        displayValue?: React.ReactNode;
        fieldKey: string;
        type?: 'text' | 'number' | 'textarea' | 'select';
        options?: { value: string; label: string }[];
    }) =>
        isAdmin
            ? <EditableField label={label} value={value} displayValue={displayValue} fieldKey={fieldKey} personHandle={handle} type={type ?? 'text'} options={options} onSaved={handleFieldSaved} />
            : <InfoRow label={label} value={(displayValue ?? value) ? String(displayValue ?? value) : '—'} />;

    return (
        <div className="space-y-6">
            {/* Header */}
            {/* Modern Header Profile */}
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6 shadow-sm">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10"></div>

                <div className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-md overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                                {person.avatarUrl ? (
                                    <img src={person.avatarUrl} alt={person.displayName} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-slate-400" />
                                )}
                            </div>
                            {person.isLiving ? (
                                <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" title="Còn sống" />
                            ) : (
                                <span className="absolute bottom-1 right-1 w-5 h-5 bg-slate-400 border-2 border-white rounded-full flex items-center justify-center text-white" title="Đã mất">
                                    <span className="text-[10px] leading-none">✝</span>
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="space-y-1.5">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 flex-wrap text-slate-900 dark:text-white">
                                {person.displayName}
                                {person.isPrivacyFiltered && (
                                    <Badge variant="outline" className="text-amber-500 border-amber-500 bg-amber-50 dark:bg-amber-950/50">
                                        <Lock className="h-3 w-3 mr-1" />Bảo mật
                                    </Badge>
                                )}
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-blue-500" />
                                    {genderLabel}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5 ">
                                    <GitBranch className="w-4 h-4 text-emerald-500" />
                                    Đời thứ {person.generation || '?'}
                                </span>
                                {person.birthYear && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1.5">
                                            Tuổi: {person.isLiving ? new Date().getFullYear() - person.birthYear : (person.deathYear ? person.deathYear - person.birthYear : '?')}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 whitespace-nowrap">
                        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-1.5 shadow-sm">
                            <ArrowLeft className="h-4 w-4" /> Quay lại Cây
                        </Button>
                        {isAdmin && (
                            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting} className="gap-1.5 shadow-sm bg-red-500 hover:bg-red-600">
                                <Trash2 className="h-4 w-4" /> {isDeleting ? 'Đang xoá...' : 'Xoá thành viên'}
                            </Button>
                        )}
                        {saveMsg && <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-50 rounded-md">{saveMsg}</span>}
                        {isAdmin && (
                            <Badge variant="secondary" className="text-[10px] font-medium text-blue-600 bg-blue-100/50 tracking-wide mt-1">
                                <Pencil className="h-3 w-3 mr-1" /> Bấm để sửa
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Privacy notice */}
            {person.isPrivacyFiltered && person._privacyNote && (
                <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-600 dark:text-amber-400">
                    🔒 {person._privacyNote}
                </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview" className="gap-1"><User className="h-3.5 w-3.5" /> Tổng quan</TabsTrigger>
                    <TabsTrigger value="relationships" className="gap-1"><Heart className="h-3.5 w-3.5" /> Gia đình</TabsTrigger>
                    <TabsTrigger value="media" className="gap-1"><ImageIcon className="h-3.5 w-3.5" /> Tư liệu</TabsTrigger>
                    <TabsTrigger value="history" className="gap-1"><History className="h-3.5 w-3.5" /> Lịch sử</TabsTrigger>
                    <TabsTrigger value="comments" className="gap-1"><MessageCircle className="h-3.5 w-3.5" /> Bình luận</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="h-4 w-4" /> Thông tin cá nhân
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <Field label="Họ tên" value={person.displayName} fieldKey="display_name" />
                            <Field label="Giới tính" value={person.gender} displayValue={genderLabel} fieldKey="gender" type="select" options={[{ value: '1', label: 'Nam' }, { value: '2', label: 'Nữ' }]} />
                            <Field label="Tình trạng" value={person.isLiving} displayValue={person.isLiving ? 'Còn sống' : 'Đã mất'} fieldKey="is_living" type="select" options={[{ value: 'true', label: 'Còn sống' }, { value: 'false', label: 'Đã mất' }]} />
                            {person.nickName && <Field label="Tên thường gọi" value={person.nickName} fieldKey="nick_name" />}
                            <Field label="Năm sinh" value={person.birthYear} fieldKey="birth_year" type="number" />
                            {person.birthYear && <InfoRow label="Năm âm lịch" value={zodiacYear(person.birthYear) || '—'} />}
                            <Field label="Nơi sinh" value={person.birthPlace} fieldKey="birth_place" />
                            {!person.isLiving && (
                                <>
                                    <Field label="Năm mất" value={person.deathYear} fieldKey="death_year" type="number" />
                                    <Field label="Nơi mất" value={person.deathPlace} fieldKey="death_place" />
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Contact */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Phone className="h-4 w-4" /> Liên hệ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <Field label="Điện thoại" value={person.phone} fieldKey="phone" />
                            <Field label="Email" value={person.email} fieldKey="email" />
                            <Field label="Zalo" value={person.zalo} fieldKey="zalo" />
                            <Field label="Facebook" value={person.facebook} fieldKey="facebook" />
                        </CardContent>
                    </Card>

                    {/* Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Địa chỉ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <Field label="Quê quán" value={person.hometown} fieldKey="hometown" />
                            <Field label="Nơi ở hiện tại" value={person.currentAddress} fieldKey="current_address" />
                        </CardContent>
                    </Card>

                    {/* Work & Education */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Briefcase className="h-4 w-4" /> Nghề nghiệp & Học vấn
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <Field label="Nghề nghiệp" value={person.occupation} fieldKey="occupation" />
                            <Field label="Nơi công tác" value={person.company} fieldKey="company" />
                            <Field label="Học vấn" value={person.education} fieldKey="education" type="textarea" />
                        </CardContent>
                    </Card>

                    {/* Notes & Bio */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Tiểu sử & Ghi chú
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Field label="Tiểu sử" value={person.biography} fieldKey="biography" type="textarea" />
                            <Field label="Ghi chú" value={person.notes} fieldKey="notes" type="textarea" />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Relationships */}
                <TabsContent value="relationships" className="space-y-4">
                    {/* Parents */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-500" />
                                Cha mẹ
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(() => {
                                const parentFams = relFamilies.filter(f => (person.parentFamilies || []).includes(f.handle));
                                if (parentFams.length === 0) {
                                    return <p className="text-sm text-muted-foreground italic">Chưa có thông tin cha mẹ</p>;
                                }
                                const parents: { person: RelatedPerson; role: string }[] = [];
                                const addedHandles = new Set<string>();
                                for (const fam of parentFams) {
                                    if (fam.fatherHandle && relPeople.has(fam.fatherHandle) && !addedHandles.has(fam.fatherHandle)) {
                                        parents.push({ person: relPeople.get(fam.fatherHandle)!, role: 'Cha' });
                                        addedHandles.add(fam.fatherHandle);
                                    }
                                    if (fam.motherHandle && relPeople.has(fam.motherHandle) && !addedHandles.has(fam.motherHandle)) {
                                        parents.push({ person: relPeople.get(fam.motherHandle)!, role: 'Mẹ' });
                                        addedHandles.add(fam.motherHandle);
                                    }
                                }
                                // If only one parent found, check their other families for a spouse
                                const hasFather = parents.some(p => p.role === 'Cha');
                                const hasMother = parents.some(p => p.role === 'Mẹ');
                                if (hasFather && !hasMother) {
                                    const father = parents.find(p => p.role === 'Cha')!;
                                    for (const fam of relFamilies) {
                                        if (fam.fatherHandle === father.person.handle && fam.motherHandle && !addedHandles.has(fam.motherHandle)) {
                                            const mother = relPeople.get(fam.motherHandle);
                                            if (mother) {
                                                parents.push({ person: mother, role: 'Mẹ' });
                                                addedHandles.add(fam.motherHandle);
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (hasMother && !hasFather) {
                                    const mother = parents.find(p => p.role === 'Mẹ')!;
                                    for (const fam of relFamilies) {
                                        if (fam.motherHandle === mother.person.handle && fam.fatherHandle && !addedHandles.has(fam.fatherHandle)) {
                                            const father = relPeople.get(fam.fatherHandle);
                                            if (father) {
                                                parents.push({ person: father, role: 'Cha' });
                                                addedHandles.add(fam.fatherHandle);
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (parents.length === 0) {
                                    return <p className="text-sm text-muted-foreground italic">Cha mẹ chưa được cập nhật</p>;
                                }
                                return (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {parents.map(({ person: p, role }) => (
                                            <PersonMiniCard key={p.handle} person={p} role={role} />
                                        ))}
                                    </div>
                                );
                            })()}
                        </CardContent>
                    </Card>

                    {/* Siblings — right after parents */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Users className="h-4 w-4 text-amber-500" />
                                Anh chị em
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(() => {
                                const parentFams = relFamilies.filter(f => (person.parentFamilies || []).includes(f.handle));
                                const parentHandles = new Set<string>();
                                parentFams.forEach(f => {
                                    if (f.fatherHandle) parentHandles.add(f.fatherHandle);
                                    if (f.motherHandle) parentHandles.add(f.motherHandle);
                                });

                                // Siblings are children from ANY family where the person's father or mother is a parent
                                const siblingFams = relFamilies.filter(f =>
                                    (f.fatherHandle && parentHandles.has(f.fatherHandle)) ||
                                    (f.motherHandle && parentHandles.has(f.motherHandle))
                                );

                                const siblings: RelatedPerson[] = [];
                                const seen = new Set<string>();
                                for (const fam of siblingFams) {
                                    for (const ch of fam.children) {
                                        if (ch === handle) continue;
                                        const sibling = relPeople.get(ch);
                                        if (sibling && !seen.has(ch)) {
                                            seen.add(ch);
                                            siblings.push(sibling);
                                        }
                                    }
                                }
                                if (siblings.length === 0) {
                                    return <p className="text-sm text-muted-foreground italic">Không có anh chị em</p>;
                                }
                                return (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {siblings.map(s => (
                                            <PersonMiniCard key={s.handle} person={s} role={s.gender === 1 ? 'Anh/Em trai' : 'Chị/Em gái'} />
                                        ))}
                                    </div>
                                );
                            })()}
                        </CardContent>
                    </Card>

                    {/* Spouse */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Heart className="h-4 w-4 text-pink-500" />
                                Vợ/Chồng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(() => {
                                const myFams = relFamilies.filter(f => (person.families || []).includes(f.handle));
                                const spouses: { person: RelatedPerson; familyIdx: number }[] = [];
                                myFams.forEach((fam, idx) => {
                                    const spouseHandle = person.gender === 1 ? fam.motherHandle : fam.fatherHandle;
                                    const sp = spouseHandle ? relPeople.get(spouseHandle) : undefined;
                                    if (sp) spouses.push({ person: sp, familyIdx: idx });
                                });
                                if (spouses.length === 0) {
                                    return <p className="text-sm text-muted-foreground italic">Chưa cập nhật thông tin</p>;
                                }
                                return (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {spouses.map(({ person: sp }) => (
                                            <PersonMiniCard
                                                key={sp.handle}
                                                person={sp}
                                                role={person.gender === 1 ? 'Vợ' : 'Chồng'}
                                            />
                                        ))}
                                    </div>
                                );
                            })()}
                        </CardContent>
                    </Card>

                    {/* Children */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <GitBranch className="h-4 w-4 text-emerald-500" />
                                Con
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(() => {
                                const myFams = relFamilies.filter(f => (person.families || []).includes(f.handle));
                                const allChildren: RelatedPerson[] = [];
                                const seen = new Set<string>();
                                for (const fam of myFams) {
                                    for (const ch of fam.children) {
                                        const child = relPeople.get(ch);
                                        if (child && !seen.has(ch)) {
                                            seen.add(ch);
                                            allChildren.push(child);
                                        }
                                    }
                                }
                                if (allChildren.length === 0) {
                                    return <p className="text-sm text-muted-foreground italic">Chưa có con</p>;
                                }
                                return (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {allChildren.map(ch => (
                                            <PersonMiniCard key={ch.handle} person={ch} role={ch.gender === 1 ? 'Con trai' : 'Con gái'} />
                                        ))}
                                    </div>
                                );
                            })()}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Media */}
                <TabsContent value="media">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Tư liệu liên quan</CardTitle></CardHeader>
                        <CardContent>
                            {mediaLoading ? (
                                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                            ) : personMedia.length === 0 ? (
                                <div className="text-center py-8">
                                    <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground text-sm">Chưa có tư liệu nào</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {personMedia.map(item => {
                                        const publicUrl = item.uploader_id && supabase.storage.from('media').getPublicUrl(`${item.uploader_id}/${item.file_name}`).data.publicUrl;
                                        const isImage = item.mime_type?.startsWith('image/');
                                        return (
                                            <div key={item.id} className="group relative rounded-lg border overflow-hidden aspect-square bg-muted">
                                                {isImage && publicUrl ? (
                                                    <>
                                                        <img src={publicUrl} alt={item.title || item.file_name} className="w-full h-full object-cover" />
                                                        <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Eye className="text-white w-6 h-6" />
                                                        </a>
                                                    </>
                                                ) : (
                                                    <a href={publicUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full h-full flex flex-col items-center justify-center p-4 hover:bg-black/5 transition-colors">
                                                        {item.mime_type?.startsWith('video/') ? <FileVideo className="w-8 h-8 text-purple-500 mb-2" /> : <FileText className="w-8 h-8 text-gray-500 mb-2" />}
                                                        <span className="text-xs text-center truncate w-full px-2">{item.title || item.file_name}</span>
                                                    </a>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History */}
                <TabsContent value="history">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Lịch sử thay đổi</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">Audit log sẽ được bổ sung trong Epic 4.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Comments */}
                <TabsContent value="comments">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" /> Bình luận
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CommentSection personHandle={handle} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
