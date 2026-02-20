'use client';

import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ZoomIn, ZoomOut, Maximize2, TreePine, Eye, Users, GitBranch, User, ArrowDownToLine, ArrowUpFromLine, Crosshair, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MOCK_TREE_NODES, MOCK_FAMILIES } from '@/lib/mock-genealogy';
import {
    computeLayout, filterAncestors, filterDescendants,
    CARD_W, CARD_H,
    type TreeNode, type TreeFamily, type LayoutResult, type PositionedNode, type PositionedCouple, type Connection,
} from '@/lib/tree-layout';

type ViewMode = 'full' | 'ancestor' | 'descendant';

export default function TreeViewPage() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    const [treeData, setTreeData] = useState<{ people: TreeNode[]; families: TreeFamily[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('full');
    const [focusPerson, setFocusPerson] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [highlightHandles, setHighlightHandles] = useState<Set<string>>(new Set());
    const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ handle: string; x: number; y: number } | null>(null);

    // Transform state
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef({ startX: 0, startY: 0, startTx: 0, startTy: 0 });
    const pinchRef = useRef({ initialDist: 0, initialScale: 1 });

    // Fetch data
    useEffect(() => {
        const fetchTree = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                if (token && apiUrl) {
                    const res = await fetch(`${apiUrl}/genealogy/tree`, {
                        headers: { Authorization: `Bearer ${token}` },
                        signal: AbortSignal.timeout(3000),
                    });
                    if (res.ok) {
                        const json = await res.json();
                        setTreeData(json.data);
                        setLoading(false);
                        return;
                    }
                }
            } catch { /* fallback */ }
            setTreeData({ people: MOCK_TREE_NODES, families: MOCK_FAMILIES });
            setLoading(false);
        };
        fetchTree();
    }, []);

    // Filtered data for view mode
    const displayData = useMemo(() => {
        if (!treeData) return null;
        if (viewMode === 'full' || !focusPerson) return treeData;
        if (viewMode === 'ancestor') return filterAncestors(focusPerson, treeData.people, treeData.families);
        if (viewMode === 'descendant') return filterDescendants(focusPerson, treeData.people, treeData.families);
        return treeData;
    }, [treeData, viewMode, focusPerson]);

    // Compute layout
    const layout = useMemo<LayoutResult | null>(() => {
        if (!displayData) return null;
        const d = 'filteredPeople' in displayData
            ? { people: (displayData as any).filteredPeople, families: (displayData as any).filteredFamilies }
            : displayData;
        return computeLayout(d.people, d.families);
    }, [displayData]);

    // ═══ Viewport culling: only render visible nodes ═══
    const CULL_PAD = 300; // px padding around viewport

    const visibleNodes = useMemo(() => {
        if (!layout || !viewportRef.current) return layout?.nodes ?? [];
        const vw = viewportRef.current.clientWidth;
        const vh = viewportRef.current.clientHeight;
        const { x: tx, y: ty, scale } = transform;
        // Convert viewport rect to tree-space coordinates
        const left = (-tx / scale) - CULL_PAD;
        const top = (-ty / scale) - CULL_PAD;
        const right = ((vw - tx) / scale) + CULL_PAD;
        const bottom = ((vh - ty) / scale) + CULL_PAD;
        return layout.nodes.filter(n =>
            n.x + CARD_W >= left && n.x <= right &&
            n.y + CARD_H >= top && n.y <= bottom
        );
    }, [layout, transform]);

    const visibleHandles = useMemo(() => new Set(visibleNodes.map(n => n.node.handle)), [visibleNodes]);

    // Batched SVG paths for connections
    const { parentPaths, couplePaths, visibleCouples } = useMemo(() => {
        if (!layout) return { parentPaths: '', couplePaths: '', visibleCouples: [] as PositionedCouple[] };
        let pp = '';
        let cp = '';
        const vc: PositionedCouple[] = [];
        // Only render connections where at least one endpoint is visible
        for (const c of layout.connections) {
            // Check if any endpoint is near visible area
            const vw = viewportRef.current?.clientWidth ?? 1200;
            const vh = viewportRef.current?.clientHeight ?? 900;
            const { x: tx, y: ty, scale } = transform;
            const left = (-tx / scale) - CULL_PAD;
            const top = (-ty / scale) - CULL_PAD;
            const right = ((vw - tx) / scale) + CULL_PAD;
            const bottom = ((vh - ty) / scale) + CULL_PAD;
            const inView = (x: number, y: number) =>
                x >= left && x <= right && y >= top && y <= bottom;
            if (!inView(c.fromX, c.fromY) && !inView(c.toX, c.toY)) continue;

            if (c.type === 'couple') {
                cp += `M${c.fromX},${c.fromY}L${c.toX},${c.toY}`;
            } else {
                const midY = c.fromY + (c.toY - c.fromY) * 0.4;
                pp += `M${c.fromX},${c.fromY}L${c.fromX},${midY}L${c.toX},${midY}L${c.toX},${c.toY}`;
            }
        }
        // Visible couples for hearts
        for (const c of layout.couples) {
            if (visibleHandles.has(c.fatherPos?.node.handle ?? '') || visibleHandles.has(c.motherPos?.node.handle ?? '')) {
                vc.push(c);
            }
        }
        return { parentPaths: pp, couplePaths: cp, visibleCouples: vc };
    }, [layout, transform, visibleHandles]);

    // Stable callbacks for PersonCard
    const handleCardHover = useCallback((h: string | null) => setHoveredHandle(h), []);
    const handleCardClick = useCallback((handle: string, x: number, y: number) => {
        setContextMenu({ handle, x, y });
    }, []);
    const handleCardFocus = useCallback((handle: string) => {
        setFocusPerson(handle);
    }, []);

    // Search highlight
    useEffect(() => {
        if (!searchQuery || !treeData) { setHighlightHandles(new Set()); return; }
        const q = searchQuery.toLowerCase();
        setHighlightHandles(new Set(treeData.people.filter(p => p.displayName.toLowerCase().includes(q)).map(p => p.handle)));
    }, [searchQuery, treeData]);

    // Fit all
    const fitAll = useCallback(() => {
        if (!layout || !viewportRef.current) return;
        const vw = viewportRef.current.clientWidth;
        const vh = viewportRef.current.clientHeight;
        const pad = 40;
        const tw = layout.width + pad * 2;
        const th = layout.height + pad * 2;
        const scale = Math.min(vw / tw, vh / th, 1.2);
        setTransform({
            x: (vw - layout.width * scale) / 2,
            y: (vh - layout.height * scale) / 2,
            scale,
        });
    }, [layout]);

    // Auto-fit on first load
    useEffect(() => {
        if (layout && !loading) setTimeout(fitAll, 50);
    }, [layout, loading]); // eslint-disable-line

    // === Mouse handlers ===
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
        dragRef.current = { startX: e.clientX, startY: e.clientY, startTx: transform.x, startTy: transform.y };
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        setTransform(t => ({ ...t, x: dragRef.current.startTx + dx, y: dragRef.current.startTy + dy }));
    };
    const handleMouseUp = () => setIsDragging(false);

    // === Scroll-wheel zoom ===
    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const rect = el.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            setTransform(t => {
                const newScale = Math.min(Math.max(t.scale * delta, 0.15), 3);
                const ratio = newScale / t.scale;
                return { scale: newScale, x: mx - (mx - t.x) * ratio, y: my - (my - t.y) * ratio };
            });
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    // === Touch handlers ===
    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;

        let touching = false;
        let lastTouches: Touch[] = [];

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                touching = true;
                const t = e.touches[0];
                dragRef.current = { startX: t.clientX, startY: t.clientY, startTx: transform.x, startTy: transform.y };
            } else if (e.touches.length === 2) {
                const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                pinchRef.current = { initialDist: dist, initialScale: transform.scale };
            }
            lastTouches = Array.from(e.touches);
        };

        const onTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length === 1 && touching) {
                const t = e.touches[0];
                const dx = t.clientX - dragRef.current.startX;
                const dy = t.clientY - dragRef.current.startY;
                setTransform(prev => ({ ...prev, x: dragRef.current.startTx + dx, y: dragRef.current.startTy + dy }));
            } else if (e.touches.length === 2) {
                const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                const ratio = dist / pinchRef.current.initialDist;
                const newScale = Math.min(Math.max(pinchRef.current.initialScale * ratio, 0.15), 3);

                const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                const rect = el.getBoundingClientRect();
                const mx = midX - rect.left;
                const my = midY - rect.top;

                setTransform(prev => {
                    const r = newScale / prev.scale;
                    return { scale: newScale, x: mx - (mx - prev.x) * r, y: my - (my - prev.y) * r };
                });
            }
            lastTouches = Array.from(e.touches);
        };

        const onTouchEnd = () => { touching = false; };

        el.addEventListener('touchstart', onTouchStart, { passive: false });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd);
        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
        };
    }, [transform.x, transform.y, transform.scale]);

    // Pan to person
    const panToPerson = useCallback((handle: string) => {
        if (!layout || !viewportRef.current) return;
        const node = layout.nodes.find(n => n.node.handle === handle);
        if (!node) return;
        const vw = viewportRef.current.clientWidth;
        const vh = viewportRef.current.clientHeight;
        setTransform(t => ({
            ...t,
            x: vw / 2 - (node.x + CARD_W / 2) * t.scale,
            y: vh / 2 - (node.y + CARD_H / 2) * t.scale,
        }));
        setFocusPerson(handle);
    }, [layout]);

    // View mode
    const changeViewMode = (mode: ViewMode) => {
        if (mode !== 'full' && !focusPerson && treeData?.people[0]) setFocusPerson(treeData.people[0].handle);
        setViewMode(mode);
    };

    // Search results
    const searchResults = useMemo(() => {
        if (!searchQuery || !treeData) return [];
        const q = searchQuery.toLowerCase();
        return treeData.people.filter(p => p.displayName.toLowerCase().includes(q)).slice(0, 8);
    }, [searchQuery, treeData]);

    // connPath kept for compatibility but unused with batched rendering

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2 px-1 pb-2">
                <div>
                    <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <TreePine className="h-5 w-5" /> Cây gia phả
                    </h1>
                    <p className="text-muted-foreground text-xs">
                        {layout ? `${layout.nodes.length} thành viên` : 'Đang tải...'}
                        {viewMode !== 'full' && focusPerson && (
                            <span className="ml-1 text-blue-500">
                                • {viewMode === 'ancestor' ? 'Tổ tiên' : 'Hậu duệ'} của{' '}
                                {treeData?.people.find(p => p.handle === focusPerson)?.displayName}
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                    {/* View modes */}
                    <div className="flex rounded-lg border overflow-hidden text-xs">
                        {([['full', 'Toàn cảnh', Eye], ['ancestor', 'Tổ tiên', Users], ['descendant', 'Hậu duệ', GitBranch]] as const).map(([mode, label, Icon]) => (
                            <button key={mode} onClick={() => changeViewMode(mode)}
                                className={`px-2.5 py-1.5 font-medium flex items-center gap-1 transition-colors ${mode !== 'full' ? 'border-l' : ''} ${viewMode === mode ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                                <Icon className="h-3.5 w-3.5" /> {label}
                            </button>
                        ))}
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <div className="relative w-44">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input placeholder="Tìm kiếm..." value={searchQuery}
                                onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
                                onFocus={() => setShowSearch(true)} className="pl-8 h-8 text-xs" />
                        </div>
                        {showSearch && searchResults.length > 0 && (
                            <Card className="absolute z-50 w-56 right-0 top-10 shadow-lg">
                                <CardContent className="p-1 max-h-52 overflow-y-auto">
                                    {searchResults.map(p => (
                                        <button key={p.handle} onClick={() => { panToPerson(p.handle); setShowSearch(false); }}
                                            className="w-full text-left px-2.5 py-1.5 rounded text-xs hover:bg-accent transition-colors flex justify-between">
                                            <span className="font-medium">{p.displayName}</span>
                                            <span className="text-muted-foreground">{p.birthYear ?? ''}{p.isPrivacyFiltered ? ' 🔒' : ''}</span>
                                        </button>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    {/* Controls */}
                    <div className="flex gap-0.5">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setTransform(t => {
                            const vw = viewportRef.current?.clientWidth ?? 0; const vh = viewportRef.current?.clientHeight ?? 0;
                            // Zoom centered on the point that is in the middle of viewport
                            const cx = vw / 2; const cy = vh / 2;
                            const ns = Math.min(t.scale * 1.3, 3); const r = ns / t.scale;
                            return { scale: ns, x: cx - (cx - t.x) * r, y: cy - (cy - t.y) * r };
                        })}><ZoomIn className="h-3.5 w-3.5" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setTransform(t => {
                            const vw = viewportRef.current?.clientWidth ?? 0; const vh = viewportRef.current?.clientHeight ?? 0;
                            const cx = vw / 2; const cy = vh / 2;
                            const ns = Math.max(t.scale / 1.3, 0.15); const r = ns / t.scale;
                            return { scale: ns, x: cx - (cx - t.x) * r, y: cy - (cy - t.y) * r };
                        })}><ZoomOut className="h-3.5 w-3.5" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={fitAll}><Maximize2 className="h-3.5 w-3.5" /></Button>
                    </div>
                </div>
            </div>

            {/* Tree viewport */}
            <div ref={viewportRef}
                className="flex-1 relative overflow-hidden rounded-xl border-2 bg-gradient-to-br from-background to-muted/30 cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                onClick={() => { setShowSearch(false); setContextMenu(null); }}
            >
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                ) : layout && (
                    <div style={{
                        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                        transformOrigin: '0 0', width: layout.width, height: layout.height,
                        position: 'absolute', top: 0, left: 0,
                    }}>
                        {/* SVG connections — batched into 2 paths */}
                        <svg className="absolute inset-0 pointer-events-none" width={layout.width} height={layout.height}
                            style={{ overflow: 'visible' }}>
                            {parentPaths && <path d={parentPaths} stroke="#94a3b8" strokeWidth={1.5} fill="none" />}
                            {couplePaths && <path d={couplePaths} stroke="#cbd5e1" strokeWidth={1.5} fill="none" strokeDasharray="4,3" />}
                            {/* Couple hearts — only visible */}
                            {visibleCouples.map(c => (
                                <text key={c.familyHandle}
                                    x={c.midX} y={c.y + CARD_H / 2 + 4}
                                    textAnchor="middle" fontSize="10" fill="#e11d48">❤</text>
                            ))}
                        </svg>

                        {/* DOM nodes — only visible (culled) */}
                        {visibleNodes.map(item => (
                            <MemoPersonCard key={item.node.handle} item={item}
                                isHighlighted={highlightHandles.has(item.node.handle)}
                                isFocused={focusPerson === item.node.handle}
                                isHovered={hoveredHandle === item.node.handle}
                                onHover={handleCardHover}
                                onClick={handleCardClick}
                                onSetFocus={handleCardFocus}
                            />
                        ))}

                        {/* Context menu on card */}
                        {contextMenu && (() => {
                            const person = treeData?.people.find(p => p.handle === contextMenu.handle);
                            if (!person) return null;
                            return (
                                <CardContextMenu
                                    person={person}
                                    x={contextMenu.x}
                                    y={contextMenu.y}
                                    onViewDetail={() => { router.push(`/people/${person.handle}`); setContextMenu(null); }}
                                    onShowDescendants={() => { setFocusPerson(person.handle); setViewMode('descendant'); setContextMenu(null); }}
                                    onShowAncestors={() => { setFocusPerson(person.handle); setViewMode('ancestor'); setContextMenu(null); }}
                                    onSetFocus={() => { panToPerson(person.handle); setContextMenu(null); }}
                                    onShowFull={() => { setViewMode('full'); setContextMenu(null); }}
                                    onClose={() => setContextMenu(null)}
                                />
                            );
                        })()}
                    </div>
                )}

                {/* Zoom + culling indicator */}
                <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur border rounded px-1.5 py-0.5 text-[10px] text-muted-foreground flex gap-1.5">
                    <span>{Math.round(transform.scale * 100)}%</span>
                    {layout && <span className="opacity-60">·</span>}
                    {layout && <span>{visibleNodes.length}/{layout.nodes.length} nodes</span>}
                </div>

                {/* Focus person selector */}
                {viewMode !== 'full' && treeData && (
                    <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur border rounded-lg px-2 py-1.5 flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground">Gốc:</span>
                        <select value={focusPerson || ''} onChange={e => setFocusPerson(e.target.value)}
                            className="border rounded px-1.5 py-0.5 text-xs bg-background max-w-[140px]">
                            {treeData.people.map(p => (
                                <option key={p.handle} value={p.handle}>{p.displayName}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex gap-3 text-[10px] text-muted-foreground pt-1.5 px-1 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-400" /> Nam (chính tộc)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-pink-100 border border-pink-400" /> Nữ (chính tộc)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-dashed border-slate-300" /> Ngoại tộc</span>
                <span className="flex items-center gap-1"><span className="text-red-500">❤</span> Vợ chồng</span>
                <span className="flex items-center gap-1 opacity-60"><span className="w-2.5 h-2.5 rounded-sm bg-slate-200 border border-slate-400" /> Đã mất</span>
                <span className="ml-auto opacity-50">Cuộn để zoom • Kéo để di chuyển • Nhấn để xem</span>
            </div>
        </div>
    );
}

// === Card Context Menu ===
function CardContextMenu({ person, x, y, onViewDetail, onShowDescendants, onShowAncestors, onSetFocus, onShowFull, onClose }: {
    person: TreeNode;
    x: number;
    y: number;
    onViewDetail: () => void;
    onShowDescendants: () => void;
    onShowAncestors: () => void;
    onSetFocus: () => void;
    onShowFull: () => void;
    onClose: () => void;
}) {
    return (
        <div
            className="absolute z-50 animate-in fade-in zoom-in-95 duration-150"
            style={{ left: x + 8, top: y + 8 }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-white/95 backdrop-blur-lg border border-slate-200 rounded-xl shadow-xl
                py-1.5 min-w-[200px] overflow-hidden">
                {/* Header */}
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                            ${person.isPatrilineal
                                ? (person.gender === 1 ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700')
                                : 'bg-slate-100 text-slate-500'}`}>
                            {person.displayName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-sm font-semibold text-slate-800 truncate max-w-[130px]">{person.displayName}</span>
                    </div>
                    <button onClick={onClose} className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Actions */}
                <div className="py-1">
                    <MenuAction icon={<User className="w-4 h-4" />} label="Xem chi tiết" desc="Mở trang cá nhân" onClick={onViewDetail} />
                    <MenuAction icon={<ArrowDownToLine className="w-4 h-4" />} label="Hậu duệ từ đây" desc="Hiển thị cây con cháu" onClick={onShowDescendants} />
                    <MenuAction icon={<ArrowUpFromLine className="w-4 h-4" />} label="Tổ tiên" desc="Hiển thị dòng tổ tiên" onClick={onShowAncestors} />
                    <MenuAction icon={<Crosshair className="w-4 h-4" />} label="Căn giữa" desc="Di chuyển tới vị trí" onClick={onSetFocus} />
                    <div className="border-t border-slate-100 my-1" />
                    <MenuAction icon={<Eye className="w-4 h-4" />} label="Toàn cảnh" desc="Hiển thị toàn bộ cây" onClick={onShowFull} />
                </div>
            </div>
        </div>
    );
}

function MenuAction({ icon, label, desc, onClick }: { icon: React.ReactNode; label: string; desc: string; onClick: () => void }) {
    return (
        <button
            className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 active:bg-slate-100
                transition-colors text-left group"
            onClick={onClick}
        >
            <span className="text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900">{label}</p>
                <p className="text-[10px] text-slate-400">{desc}</p>
            </div>
        </button>
    );
}

// === Person Card Component (memoized) ===
const MemoPersonCard = memo(PersonCard, (prev, next) =>
    prev.item === next.item &&
    prev.isHighlighted === next.isHighlighted &&
    prev.isFocused === next.isFocused &&
    prev.isHovered === next.isHovered
);

function PersonCard({ item, isHighlighted, isFocused, isHovered, onHover, onClick, onSetFocus }: {
    item: PositionedNode;
    isHighlighted: boolean;
    isFocused: boolean;
    isHovered: boolean;
    onHover: (h: string | null) => void;
    onClick: (handle: string, x: number, y: number) => void;
    onSetFocus: (handle: string) => void;
}) {
    const { node, x, y } = item;
    const isMale = node.gender === 1;
    const isFemale = node.gender === 2;
    const isDead = !node.isLiving;
    const isPatri = node.isPatrilineal;

    // Extract initials
    const nameParts = node.displayName.split(' ');
    const initials = nameParts.length >= 2
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : node.displayName.slice(0, 2).toUpperCase();

    // ── Color system: rich pastels ──
    // Chính tộc Nam = indigo-violet, Nữ = rose-coral, Ngoại tộc = sage-stone
    const avatarBg = !isPatri
        ? 'bg-stone-300 text-stone-600'  // ngoại tộc: muted stone
        : isMale
            ? (isDead ? 'bg-indigo-300 text-indigo-800' : 'bg-indigo-400 text-white')
            : isFemale
                ? (isDead ? 'bg-rose-300 text-rose-800' : 'bg-rose-400 text-white')
                : 'bg-slate-300 text-slate-600';

    const bgClass = !isPatri
        ? 'from-stone-50 to-stone-100 border-stone-300/80 border-dashed'
        : isDead
            ? (isMale
                ? 'from-indigo-50/60 to-slate-50 border-indigo-300/60'
                : 'from-rose-50/60 to-slate-50 border-rose-300/60')
            : isMale
                ? 'from-indigo-50 to-violet-50 border-indigo-300'
                : isFemale
                    ? 'from-rose-50 to-pink-50 border-rose-300'
                    : 'from-slate-50 to-slate-100 border-slate-300';

    const glowClass = isHighlighted ? 'ring-2 ring-amber-400 ring-offset-2'
        : isFocused ? 'ring-2 ring-indigo-400 ring-offset-2'
            : isHovered ? 'ring-1 ring-indigo-200' : '';

    return (
        <div
            className={`absolute rounded-xl border-[1.5px] bg-gradient-to-br shadow-sm transition-all duration-200
                cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${bgClass} ${glowClass}
                ${isDead ? 'opacity-70' : ''} ${!isPatri ? 'opacity-80' : ''}`}
            style={{ left: x, top: y, width: CARD_W, height: CARD_H }}
            onMouseEnter={() => onHover(node.handle)}
            onMouseLeave={() => onHover(null)}
            onClick={(e) => { e.stopPropagation(); onClick(node.handle, x + CARD_W, y + CARD_H / 2); }}
            onContextMenu={(e) => { e.preventDefault(); onSetFocus(node.handle); }}
        >
            <div className="px-2.5 py-2 h-full flex items-center gap-2.5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center
                        font-bold text-sm shadow-sm ring-1 ring-black/5 ${avatarBg} ${isDead ? 'opacity-60' : ''}`}>
                        {initials}
                    </div>
                    {isPatri && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500
                            text-white text-[8px] flex items-center justify-center shadow-sm font-bold ring-1 ring-white">Lê</span>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[11px] leading-tight text-slate-800 truncate">
                        {node.displayName}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                        {node.birthYear
                            ? `${node.birthYear}${node.deathYear ? ` — ${node.deathYear}` : node.isLiving ? ' — nay' : ''}`
                            : '—'}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1">
                        {isDead ? (
                            <span className="text-[9px] text-slate-400">✝ Đã mất</span>
                        ) : (
                            <span className="text-[9px] text-emerald-600 font-medium">● Còn sống</span>
                        )}
                        {!isPatri && (
                            <span className="text-[9px] text-slate-400 ml-0.5">· Ngoại tộc</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
