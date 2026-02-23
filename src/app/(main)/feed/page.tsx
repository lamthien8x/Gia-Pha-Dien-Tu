'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    Newspaper,
    MessageCircle,
    Pin,
    Trash2,
    Send,
    User,
    Calendar,
    MoreHorizontal,
    Image as ImageIcon,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/auth-provider';
import { postsApi } from '@/lib/api';
import { cn } from '@/lib/utils';

// === Types ===

interface Post {
    id: string;
    author_id: string;
    type: string;
    title: string | null;
    body: string;
    is_pinned: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    author?: { email: string; display_name: string | null; role: string };
    comment_count?: number;
}

interface Comment {
    id: string;
    author_id: string;
    body: string;
    parent_id: string | null;
    created_at: string;
    author?: { email: string; display_name: string | null };
}

// === Helpers ===

function getInitials(name?: string | null, email?: string) {
    if (name) return name.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return 'U';
}

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// === Components ===

function PostComposer({ onPostCreated }: { onPostCreated: () => void }) {
    const { user, isLoggedIn } = useAuth();
    const [body, setBody] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleSubmit = async () => {
        if (!body.trim() || !user) return;
        setSubmitting(true);
        const { error } = await postsApi.create({
            author_id: user.id,
            body: body.trim(),
        });
        if (!error) {
            setBody('');
            setExpanded(false);
            onPostCreated();
        }
        setSubmitting(false);
    };

    if (!isLoggedIn) return null;

    return (
        <Card className="border-border shadow-sm overflow-visible bg-card">
            <CardContent className="p-4 sm:p-5 flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(user?.user_metadata?.display_name, user?.email)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                    {!expanded ? (
                        <div
                            className="bg-muted/50 hover:bg-muted/80 transition-colors w-full rounded-2xl py-2.5 px-4 text-muted-foreground text-[15px] cursor-text flex items-center border border-transparent hover:border-border"
                            onClick={() => setExpanded(true)}
                        >
                            Bạn muốn chia sẻ điều gì với dòng họ?
                        </div>
                    ) : (
                        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200 origin-top">
                            <Textarea
                                placeholder="Bạn muốn chia sẻ điều gì với dòng họ?"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="min-h-[100px] text-[15px] resize-none focus-visible:ring-1 border-input bg-transparent"
                                autoFocus
                            />
                            <div className="flex items-center justify-between pt-1">
                                <Button variant="ghost" size="sm" className="text-muted-foreground rounded-full h-8 px-3 hover:bg-muted">
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Ảnh/Video
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setExpanded(false)} className="rounded-full hover:bg-muted">
                                        Hủy
                                    </Button>
                                    <Button size="sm" onClick={handleSubmit} disabled={!body.trim() || submitting} className="rounded-full px-5 shadow-none transition-transform active:scale-95">
                                        {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                        Đăng bài
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function CommentSection({ postId }: { postId: string }) {
    const { user, isLoggedIn } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = useCallback(async () => {
        setLoading(true);
        const { data } = await postsApi.getComments(postId);
        if (data) setComments(data);
        setLoading(false);
    }, [postId]);

    useEffect(() => { fetchComments(); }, [fetchComments]);

    const handleSubmit = async () => {
        if (!newComment.trim() || !user) return;
        setSubmitting(true);
        const { error } = await postsApi.addComment(postId, user.id, newComment.trim());
        if (!error) {
            setNewComment('');
            fetchComments();
        }
        setSubmitting(false);
    };

    return (
        <div className="border-t border-border/50 bg-muted/10 px-4 py-3 sm:px-5 sm:py-4 space-y-4 transition-all">
            {loading ? (
                <div className="flex justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-5">
                    {comments.map((c) => (
                        <div key={c.id} className="flex gap-3">
                            <Avatar className="h-8 w-8 shrink-0 mt-0.5 border border-border/50">
                                <AvatarFallback className="text-[10px] bg-secondary font-medium">
                                    {getInitials(c.author?.display_name, c.author?.email)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="bg-muted/40 rounded-2xl px-4 py-2.5 inline-block text-[14px]">
                                    <p className="font-semibold mb-0.5">{c.author?.display_name || c.author?.email?.split('@')[0]}</p>
                                    <p className="text-foreground/90 whitespace-pre-wrap break-words leading-snug">{c.body}</p>
                                </div>
                                <div className="px-3">
                                    <span className="text-[11px] text-muted-foreground">
                                        {formatRelativeTime(c.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-4 text-[14px] text-muted-foreground">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </div>
            )}

            {isLoggedIn && (
                <div className="flex gap-3 pt-2">
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                            {getInitials(user?.user_metadata?.display_name, user?.email)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 relative flex items-center">
                        <Input
                            placeholder="Viết bình luận..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            className="bg-transparent border-border rounded-full pr-11 text-[14px]"
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleSubmit}
                            disabled={!newComment.trim() || submitting}
                            className={cn(
                                "absolute right-1 w-8 h-8 rounded-full transition-colors",
                                newComment.trim() ? "text-primary hover:bg-primary/10" : "text-muted-foreground"
                            )}
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function PostCard({ post, onRefresh }: { post: Post; onRefresh: () => void }) {
    const { user, isAdmin } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const isAuthor = user?.id === post.author_id;

    const handleDelete = async () => {
        if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
        const { error } = await postsApi.delete(post.id);
        if (!error) onRefresh();
    };

    const handleTogglePin = async () => {
        const { error } = await postsApi.togglePin(post.id, !post.is_pinned);
        if (!error) onRefresh();
    };

    return (
        <Card className={cn(
            "transition-all duration-200 overflow-hidden border bg-card",
            post.is_pinned ? "ring-2 ring-primary/20 shadow-sm" : "shadow-sm hover:shadow-md"
        )}>
            {post.is_pinned && (
                <div className="bg-primary/5 px-4 py-2 border-b border-primary/10 flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                    <Pin className="h-3.5 w-3.5" />
                    Bài viết đã ghim
                </div>
            )}

            <CardHeader className="p-4 sm:p-5 pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 border border-border">
                            <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
                                {getInitials(post.author?.display_name, post.author?.email)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold text-[15px] leading-tight text-foreground hover:underline cursor-pointer tracking-tight">
                                {post.author?.display_name || post.author?.email?.split('@')[0] || 'Ẩn danh'}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1 text-[13px] text-muted-foreground">
                                <span>{formatRelativeTime(post.created_at)}</span>
                                {post.type === 'announcement' && (
                                    <>
                                        <span className="text-[10px] opacity-50">•</span>
                                        <Badge variant="secondary" className="px-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                            Thông báo
                                        </Badge>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {(isAdmin || isAuthor) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted focus-visible:ring-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 shadow-lg">
                                {isAdmin && (
                                    <DropdownMenuItem onClick={handleTogglePin} className="py-2.5">
                                        <Pin className="h-4 w-4 mr-2.5 text-muted-foreground" />
                                        <span>{post.is_pinned ? 'Bỏ ghim bài viết' : 'Ghim bài viết'}</span>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={handleDelete} className="py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2.5" />
                                    <span>Xóa bài viết</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 pt-2 space-y-3">
                {post.title && <h3 className="font-bold text-lg sm:text-xl leading-snug tracking-tight text-foreground">{post.title}</h3>}
                <div className="text-[15px] sm:text-[16px] leading-relaxed whitespace-pre-wrap break-words text-foreground/90">
                    {post.body}
                </div>
            </CardContent>

            <div className="px-3 py-1.5 sm:px-4 sm:py-2 border-t border-border flex items-center justify-start gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "rounded-lg px-3 h-9 flex items-center gap-2 font-medium transition-colors hover:bg-muted text-muted-foreground",
                        showComments && "bg-muted text-foreground"
                    )}
                    onClick={() => setShowComments(!showComments)}
                >
                    <MessageCircle className="h-4 w-4" />
                    <span>Bình luận {post.comment_count ? <span className="opacity-70 ml-1">({post.comment_count})</span> : ''}</span>
                </Button>
            </div>

            {showComments && (
                <div className="animate-in fade-in zoom-in-95 duration-200 origin-top">
                    <CommentSection postId={post.id} />
                </div>
            )}
        </Card>
    );
}

function FeedSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="shadow-sm">
                    <CardHeader className="p-4 sm:p-5 flex flex-row items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-1/5 bg-muted animate-pulse rounded" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-5 pt-0 space-y-2">
                        <div className="h-4 w-full bg-muted animate-pulse rounded" />
                        <div className="h-4 w-full bg-muted animate-pulse rounded" />
                        <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// === Main Feed Page ===

const POSTS_PER_PAGE = 10;

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = useCallback(async (isLoadMore = false, currentOffset = 0) => {
        if (!isLoadMore) setLoading(true);
        else setLoadingMore(true);

        const { data, meta } = await postsApi.list({ limit: POSTS_PER_PAGE, offset: currentOffset });

        if (data) {
            if (isLoadMore) {
                setPosts(prev => [...prev, ...data]);
            } else {
                setPosts(data);
            }

            // If less items returned than limit, we reached the end
            if (data.length < POSTS_PER_PAGE) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        }

        if (!isLoadMore) setLoading(false);
        else setLoadingMore(false);
    }, []);

    // Initial load
    useEffect(() => {
        setOffset(0);
        fetchPosts(false, 0);
    }, [fetchPosts]);

    const handleRefresh = () => {
        setOffset(0);
        fetchPosts(false, 0);
    };

    const handleLoadMore = () => {
        const newOffset = offset + POSTS_PER_PAGE;
        setOffset(newOffset);
        fetchPosts(true, newOffset);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            <div className="bg-card w-full p-6 rounded-2xl shadow-sm border flex items-center justify-between overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 text-foreground">
                        <Newspaper className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        Bảng tin Dòng họ
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Cập nhật tin tức, hoạt động và kết nối những người thân trong dòng họ
                    </p>
                </div>
            </div>

            <PostComposer onPostCreated={handleRefresh} />

            {loading ? (
                <FeedSkeleton />
            ) : posts.length === 0 ? (
                <Card className="border-dashed shadow-none bg-muted/30">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Newspaper className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">Chưa có bài viết nào</h3>
                        <p className="text-muted-foreground mt-1 max-w-sm">
                            Hãy là người đầu tiên đăng bài để chia sẻ thông tin với mọi người trong dòng họ.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-5">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} onRefresh={handleRefresh} />
                    ))}

                    {hasMore && (
                        <div className="pt-2 flex justify-center">
                            <Button
                                variant="outline"
                                className="rounded-full shadow-sm"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loadingMore ? 'Đang tải...' : 'Tải thêm bài viết'}
                            </Button>
                        </div>
                    )}

                    {!hasMore && posts.length > 0 && (
                        <p className="text-center text-sm text-muted-foreground pt-4 pb-8">
                            — Bạn đã xem hết tin tức —
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
