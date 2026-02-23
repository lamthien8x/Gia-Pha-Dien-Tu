'use client';

import { useEffect, useState, useRef } from 'react';
import { Database, Download, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth-provider';

export default function BackupPage() {
    const { isAdmin } = useAuth();
    const [creating, setCreating] = useState(false);
    const [restoring, setRestoring] = useState(false);
    const [lastBackup, setLastBackup] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const createBackup = async () => {
        setCreating(true);
        try {
            // Export all data from Supabase
            const { data: people } = await supabase.from('people').select('*');
            const { data: families } = await supabase.from('families').select('*');
            const { data: profiles } = await supabase.from('profiles').select('*');

            const backup = {
                exported_at: new Date().toISOString(),
                people: people || [],
                families: families || [],
                profiles: profiles || [],
            };

            // Download as JSON
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `giapha-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            setLastBackup(new Date().toISOString());
        } finally {
            setCreating(false);
        }
    };

    const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                setRestoring(true);
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                if (!data.people || !data.families) {
                    alert('Tệp sao lưu không hợp lệ!');
                    return;
                }

                if (!confirm(`CẢNH BÁO: Quá trình này sẽ KHÔI PHỤC HOẶC GHI ĐÈ ${data.people.length} người và ${data.families.length} gia đình từ bản sao lưu.\n\nCác thay đổi hiện tại trùng lặp ID (handle) có thể bị mất. Bạn có chắc chắn muốn tiến hành?`)) {
                    return;
                }

                const chunkSize = 500;

                // Upsert People
                if (data.people.length > 0) {
                    for (let i = 0; i < data.people.length; i += chunkSize) {
                        const chunk = data.people.slice(i, i + chunkSize);
                        const { error } = await supabase.from('people').upsert(chunk);
                        if (error) throw error;
                    }
                }

                // Upsert Families
                if (data.families.length > 0) {
                    for (let i = 0; i < data.families.length; i += chunkSize) {
                        const chunk = data.families.slice(i, i + chunkSize);
                        const { error } = await supabase.from('families').upsert(chunk);
                        if (error) throw error;
                    }
                }

                // Upsert Profiles (catch errors explicitly because of Auth foreign key constraints)
                if (data.profiles && data.profiles.length > 0) {
                    for (let i = 0; i < data.profiles.length; i += chunkSize) {
                        const chunk = data.profiles.slice(i, i + chunkSize);
                        const { error } = await supabase.from('profiles').upsert(chunk);
                        if (error) console.warn("Failed to restore some profiles (missing auth users?):", error);
                    }
                }

                alert('Khôi phục dữ liệu thành công!');
                window.location.reload(); // reload stats

            } catch (error: any) {
                console.error('Lỗi khôi phục:', error);
                alert('Có lỗi xảy ra khi khôi phục dữ liệu: ' + error.message);
            } finally {
                setRestoring(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.onerror = () => {
            alert('Không thể đọc tệp sao lưu.');
            setRestoring(false);
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Database className="h-6 w-6" />
                        Sao lưu & Khôi phục
                    </h1>
                    <p className="text-muted-foreground">Quản lý sao lưu cơ sở dữ liệu</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleRestore}
                        accept=".json"
                        className="hidden"
                    />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={restoring || creating}>
                        <Upload className="mr-2 h-4 w-4" />
                        {restoring ? 'Đang khôi phục...' : 'Nhập dữ liệu (Restore)'}
                    </Button>
                    <Button onClick={createBackup} disabled={creating || restoring}>
                        <Download className="mr-2 h-4 w-4" />
                        {creating ? 'Đang xuất...' : 'Xuất dữ liệu (Backup)'}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Thông tin database</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <DatabaseStats />
                    {lastBackup && (
                        <p className="text-sm text-muted-foreground">
                            Backup gần nhất: {new Date(lastBackup).toLocaleString('vi-VN')}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function DatabaseStats() {
    const [stats, setStats] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const tables = ['people', 'families', 'profiles', 'posts', 'comments', 'events', 'notifications'];
            const counts: Record<string, number> = {};
            for (const t of tables) {
                const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
                counts[t] = count || 0;
            }
            setStats(counts);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) return <div className="animate-pulse text-sm text-muted-foreground">Đang tải...</div>;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(stats).map(([table, count]) => (
                <div key={table} className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{table}</p>
                </div>
            ))}
        </div>
    );
}
