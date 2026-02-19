import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreePine, Users, Image, Activity } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Trang chủ</h1>
                <p className="text-muted-foreground">
                    Chào mừng đến với ClanHub — Nền tảng gia phả dòng họ Lê Huy
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thành viên gia phả</CardTitle>
                        <TreePine className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">—</div>
                        <p className="text-xs text-muted-foreground">Từ Gramps Web</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tài khoản</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">—</div>
                        <p className="text-xs text-muted-foreground">Người dùng đang hoạt động</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tư liệu</CardTitle>
                        <Image className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">—</div>
                        <p className="text-xs text-muted-foreground">Ảnh & tài liệu</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hoạt động gần đây</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">—</div>
                        <p className="text-xs text-muted-foreground">Từ audit log</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick actions placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle>Bắt đầu nhanh</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <p>Backend API đang ở <code className="text-primary">http://localhost:4000/api/health</code></p>
                    <p className="mt-2">Các tính năng sẽ được mở khóa khi implement Epic 1 (Auth) và Epic 2 (Genealogy).</p>
                </CardContent>
            </Card>
        </div>
    );
}
