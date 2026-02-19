'use client';

import { useState } from 'react';
import { Shield, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const ROLE_COLORS: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    EDITOR: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    ARCHIVIST: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    MEMBER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    GUEST: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export default function AdminUsersPage() {
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    // Placeholder data — will be replaced with API calls in Epic 1 implementation
    const users = [
        { id: '1', displayName: 'Lehuy', email: 'admin@clanhub.vn', role: 'ADMIN', status: 'ACTIVE', createdAt: '2026-02-19' },
    ];

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

                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo link mời
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo link mời thành viên</DialogTitle>
                            <DialogDescription>Chọn quyền và tạo link mời</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Quyền</label>
                                <select className="w-full rounded-md border px-3 py-2 text-sm">
                                    <option value="MEMBER">Member</option>
                                    <option value="EDITOR">Editor</option>
                                    <option value="ARCHIVIST">Archivist</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Số lần dùng tối đa</label>
                                <Input type="number" defaultValue={1} min={1} max={100} />
                            </div>
                            <Button className="w-full" onClick={() => setInviteDialogOpen(false)}>
                                Tạo link
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

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
        </div>
    );
}
