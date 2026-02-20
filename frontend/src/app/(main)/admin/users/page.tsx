'use client';

import { useState, useCallback } from 'react';
import { Shield, Plus, MoreHorizontal, Copy, Check, Link2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const ROLE_COLORS: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    EDITOR: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    ARCHIVIST: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    MEMBER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    GUEST: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

interface InviteLink {
    id: string;
    code: string;
    role: string;
    maxUses: number;
    usedCount: number;
    url: string;
    createdAt: string;
}

function generateCode() {
    const chars = 'abcdef0123456789';
    let code = '';
    for (let i = 0; i < 32; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

export default function AdminUsersPage() {
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteRole, setInviteRole] = useState('MEMBER');
    const [inviteMaxUses, setInviteMaxUses] = useState(1);
    const [generatedLink, setGeneratedLink] = useState<InviteLink | null>(null);
    const [copied, setCopied] = useState(false);
    const [invites, setInvites] = useState<InviteLink[]>([]);

    const users = [
        { id: '1', displayName: 'Lehuy', email: 'admin@clanhub.vn', role: 'ADMIN', status: 'ACTIVE', createdAt: '2026-02-19' },
    ];

    const handleCreateInvite = useCallback(() => {
        const code = generateCode();
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const newInvite: InviteLink = {
            id: `inv_${Date.now()}`,
            code,
            role: inviteRole,
            maxUses: inviteMaxUses,
            usedCount: 0,
            url: `${baseUrl}/register?code=${code}`,
            createdAt: new Date().toISOString().split('T')[0],
        };
        setGeneratedLink(newInvite);
        setInvites(prev => [newInvite, ...prev]);
    }, [inviteRole, inviteMaxUses]);

    const handleCopy = useCallback(async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, []);

    const handleDeleteInvite = useCallback((id: string) => {
        setInvites(prev => prev.filter(inv => inv.id !== id));
    }, []);

    const handleCloseDialog = () => {
        setInviteDialogOpen(false);
        setGeneratedLink(null);
        setCopied(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Shield className="h-6 w-6" />
                        Quản lý thành viên
                    </h1>
                    <p className="text-muted-foreground">Quản lý tài khoản và quyền truy cập</p>
                </div>

                <Dialog open={inviteDialogOpen} onOpenChange={(open) => { if (!open) handleCloseDialog(); else setInviteDialogOpen(true); }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo link mời
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo link mời thành viên</DialogTitle>
                            <DialogDescription>Chọn quyền và tạo link mời cho thành viên mới</DialogDescription>
                        </DialogHeader>

                        {!generatedLink ? (
                            <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Quyền</label>
                                    <select
                                        className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                                        value={inviteRole}
                                        onChange={e => setInviteRole(e.target.value)}
                                    >
                                        <option value="MEMBER">Member — Xem và đề xuất chỉnh sửa</option>
                                        <option value="EDITOR">Editor — Chỉnh sửa trực tiếp</option>
                                        <option value="ARCHIVIST">Archivist — Quản lý tư liệu</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Số lần dùng tối đa</label>
                                    <Input
                                        type="number"
                                        value={inviteMaxUses}
                                        onChange={e => setInviteMaxUses(Math.max(1, parseInt(e.target.value) || 1))}
                                        min={1}
                                        max={100}
                                    />
                                </div>
                                <Button className="w-full" onClick={handleCreateInvite}>
                                    <Link2 className="mr-2 h-4 w-4" />
                                    Tạo link mời
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 mt-4">
                                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-600" />
                                        <span className="font-medium text-green-700">Link đã tạo thành công!</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            readOnly
                                            value={generatedLink.url}
                                            className="text-xs font-mono bg-background"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleCopy(generatedLink.url)}
                                            className="shrink-0"
                                        >
                                            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <div className="flex gap-4 text-xs text-muted-foreground">
                                        <span>Quyền: <Badge variant="secondary" className={`${ROLE_COLORS[generatedLink.role]} text-xs`}>{generatedLink.role}</Badge></span>
                                        <span>Dùng tối đa: {generatedLink.maxUses} lần</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1" onClick={handleCloseDialog}>
                                        Đóng
                                    </Button>
                                    <Button className="flex-1" onClick={() => setGeneratedLink(null)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tạo thêm
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách thành viên</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Quyền</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tham gia</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.displayName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={ROLE_COLORS[user.role]}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'ACTIVE' ? 'default' : 'destructive'}>
                                            {user.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm ngưng'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.createdAt}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Đổi quyền</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Tạm ngưng</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Invite Links Section */}
            {invites.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Link2 className="h-4 w-4" />
                            Link mời đã tạo
                        </CardTitle>
                        <CardDescription>{invites.length} link</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Link</TableHead>
                                    <TableHead>Quyền</TableHead>
                                    <TableHead>Đã dùng / Tối đa</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead className="w-20"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invites.map(inv => (
                                    <TableRow key={inv.id}>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                                ...?code={inv.code.slice(0, 8)}...
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={ROLE_COLORS[inv.role]}>
                                                {inv.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{inv.usedCount} / {inv.maxUses}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{inv.createdAt}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleCopy(inv.url)}
                                                    title="Sao chép link"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteInvite(inv.id)}
                                                    title="Xóa link"
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
