'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TreePine, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

const registerSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    displayName: z.string().min(2, 'Tên tối thiểu 2 ký tự').max(100),
    password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
    confirmPassword: z.string(),
    inviteCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterContent() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        try {
            setError('');
            setLoading(true);

            // Validate invite code nếu có cung cấp
            let userRole = 'member';
            if (data.inviteCode && data.inviteCode.trim()) {
                const { data: invite, error: inviteErr } = await supabase
                    .from('invite_links')
                    .select('*')
                    .eq('code', data.inviteCode.trim())
                    .single();

                if (inviteErr || !invite) {
                    setError('Mã mời không hợp lệ hoặc đã hết hạn. Để trống mã mời để đăng ký với quyền member.');
                    return;
                }

                if (invite.max_uses && invite.used_count >= invite.max_uses) {
                    setError('Mã mời đã hết lượt sử dụng');
                    return;
                }

                userRole = invite.role || 'member';

                // Increment invite used_count
                await supabase
                    .from('invite_links')
                    .update({ used_count: (invite.used_count || 0) + 1 })
                    .eq('id', invite.id);
            }

            // Sign up via Supabase Auth
            const { data: authData, error: authErr } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        display_name: data.displayName,
                        invite_code: data.inviteCode,
                    },
                },
            });

            if (authErr) {
                setError(authErr.message);
                return;
            }

            // Create profile
            if (authData.user) {
                await supabase.from('profiles').upsert({
                    id: authData.user.id,
                    email: data.email,
                    display_name: data.displayName,
                    role: userRole,
                    status: 'active',
                });
            }

            router.push('/');
        } catch (err: unknown) {
            setError('Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center space-y-2">
                <div className="flex justify-center">
                    <div className="rounded-full bg-primary/10 p-3">
                        <TreePine className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Tham gia Gia phả họ Hồ</CardTitle>
                <CardDescription>Đăng ký tham gia nền tảng gia phả dòng họ</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="displayName">Tên hiển thị</label>
                        <Input id="displayName" placeholder="Hồ Văn A" {...register('displayName')} />
                        {errors.displayName && <p className="text-xs text-destructive">{errors.displayName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="inviteCode">Mã mời <span className="text-muted-foreground">(tùy chọn)</span></label>
                        <Input id="inviteCode" placeholder="FAMILY2026" {...register('inviteCode')} />
                        {errors.inviteCode && <p className="text-xs text-destructive">{errors.inviteCode.message}</p>}
                        <p className="text-xs text-muted-foreground">Để trống nếu không có mã mời. Mã mẫu: <code>FAMILY2026</code></p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="email">Email</label>
                        <Input id="email" type="email" placeholder="email@example.com" {...register('email')} />
                        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="password">Mật khẩu</label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Tối thiểu 8 ký tự"
                                {...register('password')}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function RegisterPage() {
    return <RegisterContent />;
}
