'use client';

import { useState, useEffect } from 'react';
import { X, Send, MessageSquarePlus, User, Phone, MapPin, Briefcase, FileText, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth-provider';

// ─── Field definitions grouped by section ────────────────────
interface FieldDef {
    key: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'date' | 'select' | 'image';
    placeholder?: string;
    options?: { value: string; label: string }[];
}

const FIELD_SECTIONS: { title: string; icon: React.ReactNode; fields: FieldDef[] }[] = [
    {
        title: 'Thông tin cá nhân',
        icon: <User className="w-3.5 h-3.5" />,
        fields: [
            { key: 'avatar_url', label: 'Hình ảnh đại diện', type: 'image' },
            { key: 'display_name', label: 'Họ tên đầy đủ', type: 'text', placeholder: 'VD: Hồ Văn An' },
            { key: 'nick_name', label: 'Tên thường gọi', type: 'text', placeholder: 'VD: Chú Hai, Bác Ba...' },
            { key: 'gender', label: 'Giới tính', type: 'select', options: [{ value: '1', label: 'Nam' }, { value: '2', label: 'Nữ' }] },
            { key: 'is_living', label: 'Tình trạng', type: 'select', options: [{ value: 'true', label: 'Còn sống' }, { value: 'false', label: 'Đã mất' }] },
            { key: 'birth_year', label: 'Năm sinh', type: 'number', placeholder: 'VD: 1950' },
            { key: 'birth_date', label: 'Ngày sinh (đầy đủ)', type: 'text', placeholder: 'VD: 15/03/1950' },
            { key: 'birth_place', label: 'Nơi sinh', type: 'text', placeholder: 'VD: Quảng Bình' },
            { key: 'death_year', label: 'Năm mất', type: 'number', placeholder: 'VD: 2020' },
            { key: 'death_date', label: 'Ngày mất (đầy đủ)', type: 'text', placeholder: 'VD: 05/10/2020' },
            { key: 'death_place', label: 'Nơi mất', type: 'text', placeholder: 'VD: TP. Hồ Chí Minh' },
        ],
    },
    {
        title: 'Liên hệ',
        icon: <Phone className="w-3.5 h-3.5" />,
        fields: [
            { key: 'phone', label: 'Số điện thoại', type: 'text', placeholder: 'VD: 0901234567' },
            { key: 'email', label: 'Email', type: 'text', placeholder: 'VD: email@gmail.com' },
            { key: 'zalo', label: 'Zalo', type: 'text', placeholder: 'Số Zalo hoặc link' },
            { key: 'facebook', label: 'Facebook', type: 'text', placeholder: 'Link facebook' },
        ],
    },
    {
        title: 'Địa chỉ',
        icon: <MapPin className="w-3.5 h-3.5" />,
        fields: [
            { key: 'hometown', label: 'Quê quán', type: 'text', placeholder: 'VD: Xã Phú Thuỷ, Lệ Thuỷ, Quảng Bình' },
            { key: 'current_address', label: 'Nơi ở hiện tại', type: 'text', placeholder: 'VD: Quận 1, TP. HCM' },
        ],
    },
    {
        title: 'Nghề nghiệp & Học vấn',
        icon: <Briefcase className="w-3.5 h-3.5" />,
        fields: [
            { key: 'occupation', label: 'Nghề nghiệp', type: 'text', placeholder: 'VD: Giáo viên, Kỹ sư...' },
            { key: 'company', label: 'Nơi công tác', type: 'text', placeholder: 'VD: Trường THPT Lệ Thuỷ' },
            { key: 'education', label: 'Học vấn', type: 'textarea', placeholder: 'VD: Đại học Sư phạm Hà Nội, tốt nghiệp 1985' },
        ],
    },
    {
        title: 'Tiểu sử & Ghi chú',
        icon: <FileText className="w-3.5 h-3.5" />,
        fields: [
            { key: 'biography', label: 'Tiểu sử', type: 'textarea', placeholder: 'Kể về cuộc đời, đóng góp, kỷ niệm...' },
            { key: 'notes', label: 'Ghi chú thêm', type: 'textarea', placeholder: 'Thông tin khác bạn muốn bổ sung...' },
        ],
    },
];

// All field keys for easy lookup
const ALL_FIELD_KEYS = FIELD_SECTIONS.flatMap(s => s.fields.map(f => f.key));

// ─── Types ───────────────────────────────────────────────────
interface ContributeDialogProps {
    personHandle: string;
    personName: string;
    onClose: () => void;
}

type FormValues = Record<string, string>;

// ─── Main Component ──────────────────────────────────────────
export function ContributeDialog({ personHandle, personName, onClose }: ContributeDialogProps) {
    const { user, profile, isLoggedIn } = useAuth();

    const [values, setValues] = useState<FormValues>({});
    const [originalValues, setOriginalValues] = useState<FormValues>({});
    const [loadingData, setLoadingData] = useState(true);
    const [note, setNote] = useState('');
    const [contributorContact, setContributorContact] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    // Fetch existing person data on mount
    useEffect(() => {
        const fetchPersonData = async () => {
            try {
                const res = await fetch(`/api/people/${personHandle}`);
                if (!res.ok) throw new Error('Không thể tải thông tin');
                const json = await res.json();
                const person = json.data;

                if (person) {
                    const initial: FormValues = {};
                    for (const key of ALL_FIELD_KEYS) {
                        const val = person[key];
                        if (val !== null && val !== undefined && val !== '') {
                            initial[key] = String(val);
                        }
                    }
                    setValues(initial);
                    setOriginalValues(initial);
                }
            } catch (err) {
                console.error('Failed to fetch person data:', err);
                // Not critical — just start with empty fields
            } finally {
                setLoadingData(false);
            }
        };

        fetchPersonData();
    }, [personHandle]);

    const setValue = (key: string, val: string) => {
        setValues(prev => ({ ...prev, [key]: val }));
    };

    // Count only fields that have been CHANGED from original
    const changedFields = Object.entries(values).filter(([key, val]) => {
        const original = originalValues[key] || '';
        return val.trim() !== original.trim();
    });
    const changedCount = changedFields.length;

    // Also track deleted fields (fields that had a value but now are empty)
    const deletedFields = Object.entries(originalValues).filter(([key]) => {
        const currentVal = values[key] || '';
        return originalValues[key].trim() !== '' && currentVal.trim() === '';
    });

    const totalChanges = changedCount + deletedFields.filter(([key]) => !changedFields.some(([k]) => k === key)).length;

    const handleImageUpload = async (key: string, file: File) => {
        if (!file) return;
        setUploadingImage(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/contributions/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Lỗi upload ảnh');
            setValue(key, data.publicUrl);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Không thể tải ảnh lên');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async () => {
        if (totalChanges === 0) { setError('Chưa có thay đổi nào'); return; }

        setSending(true);
        setError('');

        // Build contribution rows for changed/deleted fields
        const allChanges = new Map<string, { oldVal: string; newVal: string }>();

        // Changed fields (value updated or added)
        for (const [key, val] of changedFields) {
            allChanges.set(key, { oldVal: originalValues[key] || '', newVal: val.trim() });
        }

        // Deleted fields (value cleared)
        for (const [key] of deletedFields) {
            if (!allChanges.has(key)) {
                allChanges.set(key, { oldVal: originalValues[key], newVal: '' });
            }
        }

        const rows = Array.from(allChanges.entries()).map(([key, { oldVal, newVal }]) => {
            const field = FIELD_SECTIONS.flatMap(s => s.fields).find(f => f.key === key);
            return {
                author_id: user?.id || null,
                author_email: profile?.email || user?.email || contributorContact.trim() || 'anonymous',
                person_handle: personHandle,
                person_name: personName,
                field_name: key,
                field_label: field?.label || key,
                old_value: oldVal || null,
                new_value: newVal,
                note: note.trim() || null,
                status: 'pending',
            };
        });

        try {
            const res = await fetch('/api/contributions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rows })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to submit contributions');
            setSent(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setSending(false);
        }
    };

    // Check if a field value was changed from original
    const isFieldChanged = (key: string) => {
        const original = originalValues[key] || '';
        const current = values[key] || '';
        return current.trim() !== original.trim();
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 fade-in duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <MessageSquarePlus className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Đóng góp thông tin</h3>
                            <p className="text-xs text-muted-foreground">{personName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {sent ? (
                    /* ── Success ── */
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="font-semibold text-green-700 text-lg">Đã gửi thành công!</h4>
                            <p className="text-sm text-muted-foreground">
                                Đã gửi <span className="font-medium text-foreground">{totalChanges} thay đổi</span> về <span className="font-medium">{personName}</span>.<br />
                                Quản trị viên sẽ xem xét và phê duyệt sớm.
                            </p>
                            <Button variant="outline" onClick={onClose}>Đóng</Button>
                        </div>
                    </div>
                ) : loadingData ? (
                    /* ── Loading ── */
                    <div className="flex-1 flex items-center justify-center p-12">
                        <div className="text-center space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                            <p className="text-sm text-muted-foreground">Đang tải thông tin...</p>
                        </div>
                    </div>
                ) : (
                    /* ── Form ── */
                    <>
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                            {/* Login warning */}
                            {!isLoggedIn && (
                                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 p-3 text-sm text-amber-700 dark:text-amber-400">
                                    💡 Bạn đang đóng góp dưới chế độ <strong>Khách vãng lai</strong>. Nếu có thể, hãy nhập tên/liên hệ ở cuối form để Admin dễ xác minh.
                                </div>
                            )}

                            {error && (
                                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">{error}</div>
                            )}

                            <p className="text-xs text-muted-foreground">
                                Thông tin hiện có được hiển thị sẵn. Bạn có thể <strong>sửa hoặc bổ sung</strong> — Admin sẽ xem xét và áp dụng.
                                <span className="inline-block ml-1 text-blue-600">Trường đã thay đổi sẽ được đánh dấu 🔵</span>
                            </p>

                            {/* Tabs layout */}
                            <Tabs defaultValue={FIELD_SECTIONS[0].title} className="w-full">
                                <TabsList className="w-full flex justify-start overflow-x-auto overflow-y-hidden rounded-xl bg-slate-100/50 dark:bg-slate-800/50 p-1 mb-4 hide-scrollbar">
                                    {FIELD_SECTIONS.map((section, si) => {
                                        const changedInSection = section.fields.filter(f => isFieldChanged(f.key)).length;
                                        return (
                                            <TabsTrigger
                                                key={si}
                                                value={section.title}
                                                className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 transition-all dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-blue-400"
                                            >
                                                {section.icon}
                                                {section.title}
                                                {changedInSection > 0 && (
                                                    <span className="ml-1 text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 w-4 h-4 rounded-full flex items-center justify-center">
                                                        {changedInSection}
                                                    </span>
                                                )}
                                            </TabsTrigger>
                                        );
                                    })}
                                </TabsList>

                                {FIELD_SECTIONS.map((section, si) => (
                                    <TabsContent key={si} value={section.title} className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
                                            <h4 className="text-base font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                                {section.icon} {section.title}
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                                {section.fields.map(field => {
                                                    const changed = isFieldChanged(field.key);
                                                    const hasOriginal = !!(originalValues[field.key]?.trim());
                                                    return (
                                                        <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                                                            <label className={`block text-xs font-medium mb-1 flex items-center gap-1.5 ${changed ? 'text-blue-600' : 'text-muted-foreground'}`}>
                                                                {field.label}
                                                                {changed && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                                                {hasOriginal && !changed && <span className="text-[10px] font-normal text-emerald-500">(có sẵn)</span>}
                                                            </label>
                                                            {field.type === 'textarea' ? (
                                                                <textarea
                                                                    value={values[field.key] || ''}
                                                                    onChange={e => setValue(field.key, e.target.value)}
                                                                    placeholder={field.placeholder}
                                                                    rows={3}
                                                                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 transition ${changed ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
                                                                />
                                                            ) : field.type === 'select' ? (
                                                                <select
                                                                    value={values[field.key] || ''}
                                                                    onChange={e => setValue(field.key, e.target.value)}
                                                                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${changed ? 'border-blue-300 bg-blue-50/50' : ''}`}
                                                                >
                                                                    <option value="">-- Chọn --</option>
                                                                    {field.options?.map(o => (
                                                                        <option key={o.value} value={o.value}>{o.label}</option>
                                                                    ))}
                                                                </select>
                                                            ) : field.type === 'image' ? (
                                                                <div className="flex flex-col gap-2">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={e => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) handleImageUpload(field.key, file);
                                                                        }}
                                                                        className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                                                                        disabled={uploadingImage}
                                                                    />
                                                                    {values[field.key] && (
                                                                        <div className={`relative w-16 h-16 rounded-xl overflow-hidden border ${changed ? 'ring-2 ring-blue-400' : ''}`}>
                                                                            <img src={values[field.key]} alt="Preview" className="object-cover w-full h-full" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <Input
                                                                    type={field.type}
                                                                    value={values[field.key] || ''}
                                                                    onChange={e => setValue(field.key, e.target.value)}
                                                                    placeholder={field.placeholder}
                                                                    className={`text-sm ${changed ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </TabsContent>
                                ))}
                            </Tabs>

                            {/* Global note */}
                            <div className="space-y-4 pt-2">
                                {!isLoggedIn && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Họ tên / SĐT của bạn <span className="text-amber-600 font-normal">(Rất hữu ích để xác minh)</span>
                                        </label>
                                        <Input
                                            value={contributorContact}
                                            onChange={e => setContributorContact(e.target.value)}
                                            placeholder="VD: Nguyễn Văn A - 0901234567"
                                            className="text-sm bg-amber-50/50 dark:bg-amber-950/20 border-amber-200"
                                        />
                                    </div>
                                )}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Nguồn / Ghi chú chung <span className="font-normal">(tuỳ chọn)</span>
                                    </label>
                                    <Input
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                        placeholder="VD: Theo lời kể của bác Hai, theo gia phả tộc Hồ..."
                                        className="text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 border-t shrink-0 flex items-center justify-between gap-3">
                            <p className="text-[11px] text-muted-foreground">
                                {totalChanges > 0
                                    ? <span className="text-blue-600 font-medium">✓ {totalChanges} trường đã thay đổi</span>
                                    : 'Chưa có thay đổi nào'
                                }
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={onClose} size="sm">Huỷ</Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={sending || uploadingImage || totalChanges === 0}
                                    size="sm"
                                    className="gap-1.5"
                                >
                                    {sending
                                        ? 'Đang gửi...'
                                        : <><Send className="w-3.5 h-3.5" /> Gửi {totalChanges > 0 ? `(${totalChanges})` : ''}</>
                                    }
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
