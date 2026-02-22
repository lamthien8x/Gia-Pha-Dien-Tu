'use client';

import { useState } from 'react';
import { X, Send, MessageSquarePlus, ChevronDown, ChevronUp, User, Phone, MapPin, Briefcase, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth-provider';

// ─── Field definitions grouped by section ────────────────────
interface FieldDef {
    key: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'date' | 'select';
    placeholder?: string;
    options?: { value: string; label: string }[];
}

const FIELD_SECTIONS: { title: string; icon: React.ReactNode; fields: FieldDef[] }[] = [
    {
        title: 'Thông tin cá nhân',
        icon: <User className="w-3.5 h-3.5" />,
        fields: [
            { key: 'display_name', label: 'Họ tên đầy đủ', type: 'text', placeholder: 'VD: Hồ Văn An' },
            { key: 'surname', label: 'Họ', type: 'text', placeholder: 'VD: Hồ' },
            { key: 'first_name', label: 'Tên', type: 'text', placeholder: 'VD: Văn An' },
            { key: 'nick_name', label: 'Tên thường gọi', type: 'text', placeholder: 'VD: Chú Hai, Bác Ba...' },
            { key: 'gender', label: 'Giới tính', type: 'select', options: [{ value: '1', label: 'Nam' }, { value: '2', label: 'Nữ' }] },
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
    const [note, setNote] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

    const toggleSection = (i: number) => {
        setOpenSections(prev => {
            const next = new Set(prev);
            next.has(i) ? next.delete(i) : next.add(i);
            return next;
        });
    };

    const setValue = (key: string, val: string) => {
        setValues(prev => ({ ...prev, [key]: val }));
    };

    const filledCount = Object.values(values).filter(v => v.trim()).length;

    const handleSubmit = async () => {
        if (filledCount === 0) { setError('Vui lòng điền ít nhất một trường thông tin'); return; }
        if (!isLoggedIn || !user) { setError('Bạn cần đăng nhập để đóng góp'); return; }

        setSending(true);
        setError('');

        // Build one contribution row per filled field
        const rows = Object.entries(values)
            .filter(([, v]) => v.trim())
            .map(([key, val]) => {
                const field = FIELD_SECTIONS.flatMap(s => s.fields).find(f => f.key === key);
                return {
                    author_id: user.id,
                    author_email: profile?.email || user.email || '',
                    person_handle: personHandle,
                    person_name: personName,
                    field_name: key,
                    field_label: field?.label || key,
                    old_value: null,
                    new_value: val.trim(),
                    note: note.trim() || null,
                    status: 'pending',
                };
            });

        const { error: insertError } = await supabase.from('contributions').insert(rows);
        setSending(false);

        if (insertError) {
            setError(insertError.message);
        } else {
            setSent(true);
        }
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
                                Đã gửi <span className="font-medium text-foreground">{filledCount} trường thông tin</span> về <span className="font-medium">{personName}</span>.<br />
                                Quản trị viên sẽ xem xét và phê duyệt sớm.
                            </p>
                            <Button variant="outline" onClick={onClose}>Đóng</Button>
                        </div>
                    </div>
                ) : (
                    /* ── Form ── */
                    <>
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                            {/* Login warning */}
                            {!isLoggedIn && (
                                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 p-3 text-sm text-amber-700 dark:text-amber-400">
                                    ⚠️ Bạn cần <a href="/login" className="underline font-medium">đăng nhập</a> để gửi đóng góp. Thông tin bạn điền sẽ được lưu lại.
                                </div>
                            )}

                            {error && (
                                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">{error}</div>
                            )}

                            <p className="text-xs text-muted-foreground">
                                Điền vào các trường bạn biết. Bạn <strong>không cần điền hết</strong> — mỗi thông tin đều có giá trị. Admin sẽ xem xét và áp dụng.
                            </p>

                            {/* Sections */}
                            {FIELD_SECTIONS.map((section, si) => {
                                const isOpen = openSections.has(si);
                                const filledInSection = section.fields.filter(f => values[f.key]?.trim()).length;
                                return (
                                    <div key={si} className="border rounded-xl overflow-hidden">
                                        {/* Section header */}
                                        <button
                                            type="button"
                                            onClick={() => toggleSection(si)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 transition-colors text-left"
                                        >
                                            <span className="flex items-center gap-2 font-medium text-sm">
                                                <span className="text-muted-foreground">{section.icon}</span>
                                                {section.title}
                                                {filledInSection > 0 && (
                                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                                        {filledInSection}
                                                    </span>
                                                )}
                                            </span>
                                            {isOpen
                                                ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                                : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                            }
                                        </button>

                                        {/* Section fields */}
                                        {isOpen && (
                                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {section.fields.map(field => (
                                                    <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                                                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                                                            {field.label}
                                                        </label>
                                                        {field.type === 'textarea' ? (
                                                            <textarea
                                                                value={values[field.key] || ''}
                                                                onChange={e => setValue(field.key, e.target.value)}
                                                                placeholder={field.placeholder}
                                                                rows={3}
                                                                className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                                            />
                                                        ) : field.type === 'select' ? (
                                                            <select
                                                                value={values[field.key] || ''}
                                                                onChange={e => setValue(field.key, e.target.value)}
                                                                className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                            >
                                                                <option value="">-- Chọn --</option>
                                                                {field.options?.map(o => (
                                                                    <option key={o.value} value={o.value}>{o.label}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <Input
                                                                type={field.type}
                                                                value={values[field.key] || ''}
                                                                onChange={e => setValue(field.key, e.target.value)}
                                                                placeholder={field.placeholder}
                                                                className="text-sm"
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Global note */}
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

                        {/* Footer */}
                        <div className="px-5 py-4 border-t shrink-0 flex items-center justify-between gap-3">
                            <p className="text-[11px] text-muted-foreground">
                                {filledCount > 0
                                    ? <span className="text-blue-600 font-medium">✓ {filledCount} trường đã điền</span>
                                    : 'Chưa điền thông tin nào'
                                }
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={onClose} size="sm">Huỷ</Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={sending || !isLoggedIn || filledCount === 0}
                                    size="sm"
                                    className="gap-1.5"
                                >
                                    {sending
                                        ? 'Đang gửi...'
                                        : <><Send className="w-3.5 h-3.5" /> Gửi {filledCount > 0 ? `(${filledCount})` : ''}</>
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
