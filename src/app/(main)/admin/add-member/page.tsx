'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, UserPlus, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth-provider';

interface PersonOption {
    handle: string;
    display_name: string;
    gender: number;
    generation: number;
}

type Mode = 'descendant' | 'ancestor';

export default function AddMemberPage() {
    const router = useRouter();
    const { isAdmin, loading: authLoading } = useAuth();

    const [mode, setMode] = useState<Mode>('descendant');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Person form
    const [displayName, setDisplayName] = useState('');
    const [gender, setGender] = useState<'1' | '2'>('1');
    const [birthYear, setBirthYear] = useState('');
    const [deathYear, setDeathYear] = useState('');
    const [isLiving, setIsLiving] = useState(true);
    const [generation, setGeneration] = useState('1');
    const [isPatrilineal, setIsPatrilineal] = useState(true);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');

    // Descendant mode: choose father of new person
    const [males, setMales] = useState<PersonOption[]>([]);
    const [selectedFather, setSelectedFather] = useState('');
    const [selectedMother, setSelectedMother] = useState('');

    // Ancestor mode: choose which existing person is the child of new person
    const [allPeople, setAllPeople] = useState<PersonOption[]>([]);
    const [selectedChild, setSelectedChild] = useState('');

    const [showContact, setShowContact] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAdmin) router.push('/tree');
        fetchPeople();
    }, [authLoading, isAdmin, router]);

    // Auto-fill generation based on selected reference
    useEffect(() => {
        if (mode === 'descendant' && selectedFather) {
            const father = males.find(p => p.handle === selectedFather);
            if (father) setGeneration(String(father.generation + 1));
        }
    }, [selectedFather, males, mode]);

    useEffect(() => {
        if (mode === 'ancestor' && selectedChild) {
            const child = allPeople.find(p => p.handle === selectedChild);
            if (child) setGeneration(String(child.generation - 1));
        }
    }, [selectedChild, allPeople, mode]);

    const fetchPeople = async () => {
        try {
            const { data } = await supabase
                .from('people')
                .select('handle, display_name, gender, generation')
                .order('generation')
                .order('display_name');
            if (data) {
                setAllPeople(data);
                setMales(data.filter((p: PersonOption) => p.gender === 1));
            }
        } catch (err) {
            console.error('Failed to fetch people:', err);
        }
    };

    const generateHandle = (name: string) => {
        const clean = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '');
        return `P${Date.now()}${clean.slice(0, 5).toUpperCase()}`;
    };

    const resetForm = () => {
        setDisplayName(''); setGender('1'); setBirthYear(''); setDeathYear('');
        setIsLiving(true); setGeneration('1'); setIsPatrilineal(true);
        setPhone(''); setEmail(''); setAddress(''); setNotes('');
        setSelectedFather(''); setSelectedMother(''); setSelectedChild('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName.trim()) { setError('Vui lòng nhập họ tên'); return; }
        setLoading(true); setError(''); setSuccess('');

        try {
            const parsedGen = parseInt(generation);
            let genNum = isNaN(parsedGen) ? 1 : parsedGen;
            let shiftAmount = 0;
            const handle = generateHandle(displayName);

            if (mode === 'ancestor' && genNum <= 0) {
                shiftAmount = 1 - genNum; // e.g., genNum=0 → shiftAmount=1; genNum=-1 → shiftAmount=2
                genNum = 1;
            }

            // 1. Insert the new person
            const { error: personError } = await supabase.from('people').insert({
                handle,
                display_name: displayName.trim(),
                gender: gender === '1' ? 1 : 2,
                birth_year: birthYear ? parseInt(birthYear) : null,
                death_year: deathYear ? parseInt(deathYear) : null,
                is_living: isLiving,
                generation: genNum,
                is_patrilineal: isPatrilineal,
                families: [],
                parent_families: [],
                phone: phone || null,
                email: email || null,
                current_address: address || null,
                notes: notes || null,
            });
            if (personError) throw personError;

            // 2. Connect relationships
            if (mode === 'descendant' && selectedFather) {
                // New person is a child → create family with father
                const familyHandle = `F${Date.now()}`;
                const { error: famErr } = await supabase.from('families').insert({
                    handle: familyHandle,
                    father_handle: selectedFather,
                    mother_handle: selectedMother || null,
                    children: [handle],
                });
                if (famErr) throw famErr;

                // Update new person's parent_families
                await supabase.from('people').update({ parent_families: [familyHandle] }).eq('handle', handle);

                // Update father's families array
                const father = males.find(p => p.handle === selectedFather);
                const fatherFamilies = father ? [] : [];
                const { data: fatherData } = await supabase.from('people').select('families').eq('handle', selectedFather).single();
                const updatedFamilies = [...((fatherData?.families as string[]) || []), familyHandle];
                await supabase.from('people').update({ families: updatedFamilies }).eq('handle', selectedFather);

            } else if (mode === 'ancestor' && selectedChild) {
                // New person is a parent → find or create family where selectedChild is a child
                const familyHandle = `F${Date.now()}`;

                // Get child's current parent_families
                const { data: childData } = await supabase
                    .from('people').select('parent_families').eq('handle', selectedChild).single();
                const existingParentFamilies = (childData?.parent_families as string[]) || [];

                if (existingParentFamilies.length > 0) {
                    // Update existing family to set this new person as father/mother
                    const famHandle = existingParentFamilies[0];
                    const updateField = gender === '1' ? 'father_handle' : 'mother_handle';
                    await supabase.from('families').update({ [updateField]: handle }).eq('handle', famHandle);
                    // Update new person's families
                    await supabase.from('people').update({ families: [famHandle] }).eq('handle', handle);
                } else {
                    // Create a new family with the selected child
                    const { error: famErr } = await supabase.from('families').insert({
                        handle: familyHandle,
                        father_handle: gender === '1' ? handle : null,
                        mother_handle: gender === '2' ? handle : null,
                        children: [selectedChild],
                    });
                    if (famErr) throw famErr;
                    // Update new person's families
                    await supabase.from('people').update({ families: [familyHandle] }).eq('handle', handle);
                    // Update child's parent_families
                    await supabase.from('people').update({ parent_families: [familyHandle] }).eq('handle', selectedChild);
                }
            }

            if (shiftAmount > 0) {
                const { data: { session } } = await supabase.auth.getSession();
                const res = await fetch('/api/people/shift-generations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session?.access_token || ''}`
                    },
                    body: JSON.stringify({
                        amount: shiftAmount,
                        excludeHandle: handle
                    }),
                });

                if (!res.ok) {
                    console.error('Failed to shift generations, please run SQL manually', await res.text());
                    // We don't throw to avoid rolling back person insertion, since that succeeded
                }
            }

            setSuccess(`✅ Đã thêm "${displayName}" thành công! (Đời ${genNum})${shiftAmount > 0 ? ` - Đã tự động dời các đời khác xuống ${shiftAmount} bậc` : ''}`);
            resetForm();
            await fetchPeople();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err: unknown) {
            setError((err as Error).message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
    if (!isAdmin) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Bạn không có quyền truy cập trang này.</p></div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <UserPlus className="h-6 w-6" />
                    Thêm thành viên mới
                </h1>
                <p className="text-muted-foreground">Thêm thành viên vào gia phả dòng họ</p>
            </div>

            {/* Mode selector */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setMode('descendant')}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors ${mode === 'descendant'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'}`}
                >
                    <div className={`rounded-full p-2 ${mode === 'descendant' ? 'bg-primary/10' : 'bg-muted'}`}>
                        <ArrowDown className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Thêm thế hệ sau</p>
                        <p className="text-xs text-muted-foreground">Người này là con/cháu</p>
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => setMode('ancestor')}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors ${mode === 'ancestor'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'}`}
                >
                    <div className={`rounded-full p-2 ${mode === 'ancestor' ? 'bg-primary/10' : 'bg-muted'}`}>
                        <ArrowUp className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Thêm thế hệ trước</p>
                        <p className="text-xs text-muted-foreground">Người này là cha/mẹ tổ</p>
                    </div>
                </button>
            </div>

            {error && <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
            {success && <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 text-sm text-green-700 dark:text-green-400">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Họ tên *</label>
                                <Input
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Hồ Văn A"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giới tính</label>
                                <div className="flex gap-4 pt-2">
                                    {[{ v: '1', l: 'Nam' }, { v: '2', l: 'Nữ' }].map(({ v, l }) => (
                                        <label key={v} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="gender" value={v}
                                                checked={gender === v} onChange={() => setGender(v as '1' | '2')}
                                                className="w-4 h-4" />
                                            {l}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Năm sinh</label>
                                <Input type="number" value={birthYear}
                                    onChange={(e) => setBirthYear(e.target.value)} placeholder="1950" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Năm mất</label>
                                <Input type="number" value={deathYear}
                                    onChange={(e) => setDeathYear(e.target.value)}
                                    placeholder="Năm mất" disabled={isLiving} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Trạng thái</label>
                                <div className="flex items-center gap-2 pt-2">
                                    <input type="checkbox" id="isLiving" checked={isLiving}
                                        onChange={(e) => { setIsLiving(e.target.checked); if (e.target.checked) setDeathYear(''); }}
                                        className="w-4 h-4" />
                                    <label htmlFor="isLiving" className="text-sm cursor-pointer">Còn sống</label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Đời (thế hệ) *
                                    <span className="text-xs text-muted-foreground ml-1">— tự điền khi chọn quan hệ</span>
                                </label>
                                <Input type="number" value={generation}
                                    onChange={(e) => setGeneration(e.target.value)}
                                    placeholder="1" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Dòng</label>
                                <div className="flex gap-4 pt-2">
                                    {[{ v: true, l: 'Chính tộc' }, { v: false, l: 'Ngoại tộc' }].map(({ v, l }) => (
                                        <label key={l} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="patrilineal" checked={isPatrilineal === v}
                                                onChange={() => setIsPatrilineal(v)} className="w-4 h-4" />
                                            {l}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Relationship section — changes based on mode */}
                <Card className="border-primary/30">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            {mode === 'descendant' ? <ArrowDown className="h-4 w-4 text-primary" /> : <ArrowUp className="h-4 w-4 text-primary" />}
                            {mode === 'descendant' ? 'Quan hệ — Cha mẹ của người này' : 'Quan hệ — Người này là cha/mẹ của'}
                        </CardTitle>
                        <CardDescription>
                            {mode === 'descendant'
                                ? 'Chọn cha (bắt buộc nếu muốn gắn vào cây phả hệ). Đời sẽ tự cập nhật.'
                                : 'Chọn con/cháu đã có trong hệ thống. Đời sẽ tự cập nhật (= đời con - 1).'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {mode === 'descendant' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cha</label>
                                    <select value={selectedFather} onChange={(e) => setSelectedFather(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm bg-background">
                                        <option value="">-- Chọn cha (không bắt buộc) --</option>
                                        {males.map((p) => (
                                            <option key={p.handle} value={p.handle}>
                                                {p.display_name} · Đời {p.generation}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Mẹ (handle, không bắt buộc)</label>
                                    <select value={selectedMother} onChange={(e) => setSelectedMother(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm bg-background">
                                        <option value="">-- Chọn mẹ (không bắt buộc) --</option>
                                        {allPeople.filter(p => p.gender === 2).map((p) => (
                                            <option key={p.handle} value={p.handle}>
                                                {p.display_name} · Đời {p.generation}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Con/cháu đã có trong hệ thống *</label>
                                <select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background">
                                    <option value="">-- Chọn con/cháu --</option>
                                    {allPeople.map((p) => (
                                        <option key={p.handle} value={p.handle}>
                                            {p.display_name} · Đời {p.generation} · {p.gender === 1 ? 'Nam' : 'Nữ'}
                                        </option>
                                    ))}
                                </select>
                                {selectedChild && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        💡 Đời của người mới sẽ là <strong className="text-primary">{Math.max(1, (allPeople.find(p => p.handle === selectedChild)?.generation || 0) - 1)}</strong>.
                                        {((allPeople.find(p => p.handle === selectedChild)?.generation || 0) - 1) <= 0 && (
                                            <span className="block mt-1 text-amber-600">
                                                Lưu ý: Vì người con đang ở đời 1, đời của người mới sẽ thành đời 1, và toàn bộ dòng họ sẽ tự động lùi xuống {(1 - ((allPeople.find(p => p.handle === selectedChild)?.generation || 0) - 1))} đời để đảm bảo thuỷ tổ luôn ở đời 1.
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Contact info — collapsible */}
                <Card>
                    <CardHeader className="cursor-pointer" onClick={() => setShowContact(!showContact)}>
                        <CardTitle className="text-base flex items-center justify-between">
                            <span>Thông tin liên lạc <span className="text-muted-foreground font-normal text-xs">(không bắt buộc)</span></span>
                            {showContact ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </CardTitle>
                    </CardHeader>
                    {showContact && (
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Điện thoại</label>
                                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0901234567" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Địa chỉ</label>
                                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Địa chỉ hiện tại" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ghi chú</label>
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Ghi chú thêm..."
                                    className="w-full border rounded-lg px-3 py-2 min-h-[80px] bg-background text-sm" />
                            </div>
                        </CardContent>
                    )}
                </Card>

                <div className="flex gap-2">
                    <Button type="submit" disabled={loading || !displayName.trim()}>
                        {loading ? 'Đang lưu...' : <><Save className="h-4 w-4 mr-2" />Lưu thành viên</>}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        <X className="h-4 w-4 mr-2" />Hủy
                    </Button>
                </div>
            </form>
        </div>
    );
}
