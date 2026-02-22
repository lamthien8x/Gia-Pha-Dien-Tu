import { Suspense } from 'react';
import TreeViewPage from './tree/tree-client';

export const dynamic = 'force-dynamic';

export default function HomePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="text-muted-foreground">Đang tải gia phả...</div>
            </div>
        }>
            <TreeViewPage />
        </Suspense>
    );
}
