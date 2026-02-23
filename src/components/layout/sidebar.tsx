'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    TreePine,
    Users,
    Image,
    Shield,
    FileText,
    Database,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    ClipboardCheck,
    Contact,
    Newspaper,
    CalendarDays,
    Menu,
    UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const navItems = [
    { href: '/', label: 'Cây gia phả', icon: TreePine },
    { href: '/home', label: 'Trang chủ', icon: Home },
    { href: '/feed', label: 'Bảng tin', icon: Newspaper },
    { href: '/directory', label: 'Danh bạ', icon: Contact },
    { href: '/events', label: 'Sự kiện', icon: CalendarDays },
    { href: '/book', label: 'Sách gia phả', icon: BookOpen },
    { href: '/people', label: 'Thành viên', icon: Users },
    { href: '/media', label: 'Thư viện', icon: Image },
];

const adminItems = [
    { href: '/admin/add-member', label: 'Thêm thành viên', icon: UserPlus },
    { href: '/admin/users', label: 'Quản lý Users', icon: Shield },
    { href: '/admin/edits', label: 'Kiểm duyệt', icon: ClipboardCheck },
    { href: '/admin/audit', label: 'Audit Log', icon: FileText },
    { href: '/admin/backup', label: 'Backup', icon: Database },
];

// Desktop sidebar content (shared between desktop and mobile sheet)
function SidebarContent({ collapsed, setCollapsed, onMobileLinkClick }: {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
    onMobileLinkClick?: () => void;
}) {
    const pathname = usePathname();
    const { isAdmin } = useAuth();

    return (
        <>
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-4 border-b">
                <div className="flex items-center gap-2">
                    <TreePine className="h-6 w-6 text-primary shrink-0" />
                    {!collapsed && <span className="font-bold text-lg">Gia phả họ Hồ</span>}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href} onClick={onMobileLinkClick}>
                            <span
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                )}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                {!collapsed && item.label}
                            </span>
                        </Link>
                    );
                })}

                {/* Admin section — only visible for admin users */}
                {isAdmin && (
                    <>
                        {!collapsed && (
                            <div className="pt-4 pb-2">
                                <span className="px-3 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                    Quản trị
                                </span>
                            </div>
                        )}
                        {collapsed && <div className="border-t my-2" />}
                        {adminItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link key={item.href} href={item.href} onClick={onMobileLinkClick}>
                                    <span
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                            isActive
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                        )}
                                    >
                                        <item.icon className="h-4 w-4 shrink-0" />
                                        {!collapsed && item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </>
                )}
            </nav>

            {/* Contact info */}
            {!collapsed && (
                <div className="border-t px-4 py-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Trang gia phả do <span className="font-semibold text-foreground">con/cháu</span> mới làm nên có thể còn nhiều sai sót. Các ông, bác, cô chú có góp ý gì xin vui lòng liên hệ cháu:
                        <br />
                        <span className="font-semibold text-foreground">📞 09792 35341 — Hồ Văn Công</span>
                        <br />
                        <span className="text-[10px] opacity-70">Cháu xin cảm ơn ạ! 🙏</span>
                    </p>
                </div>
            )}

            {/* Collapse toggle - desktop only */}
            <div className="border-t p-2 hidden md:block">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    {!collapsed && <span className="ml-2">Thu gọn</span>}
                </Button>
            </div>
        </>
    );
}

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleMobileLinkClick = () => {
        setMobileOpen(false);
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    'hidden md:flex flex-col border-r bg-card transition-all duration-300 h-screen sticky top-0',
                    collapsed ? 'w-16' : 'w-64',
                )}
            >
                <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden fixed top-3 left-3 z-50 h-9 w-9"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                    <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
                    <aside className="flex flex-col h-full">
                        <SidebarContent collapsed={false} setCollapsed={() => { }} onMobileLinkClick={handleMobileLinkClick} />
                    </aside>
                </SheetContent>
            </Sheet>
        </>
    );
}
