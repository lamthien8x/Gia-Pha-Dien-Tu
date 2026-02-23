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
        <Card className="border shadow-sm overflow-hidden">
            <CardContent className="p-4 sm:p-5 flex gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user?.user_metadata?.display_name, user?.email)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                    {!expanded ? (
                        <div
                            className="bg-muted hover:bg-muted/80 transition-colors w-full rounded-full py-2.5 px-4 text-muted-foreground text-sm cursor-text flex items-center"
                            onClick={() => setExpanded(true)}
                        >
                            Bạn muốn chia sẻ điều gì với dòng họ?
                        </div>
                    ) : (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <Textarea
                                placeholder="Bạn muốn chia sẻ điều gì với dòng họ?"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="min-h-[100px] text-base resize-none focus-visible:ring-1 border-muted"
                                autoFocus
                            />
                            <div className="flex items-center justify-between pt-2">
                                <Button variant="ghost" size="sm" className="text-muted-foreground rounded-full h-8 px-3">
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Ảnh/Video
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setExpanded(false)} className="rounded-full">
                                        Hủy
                                    </Button>
                                    <Button size="sm" onClick={handleSubmit} disabled={!body.trim() || submitting} className="rounded-full px-5 shadow-sm">
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
        <div className="border-t bg-muted/20 px-4 py-3 sm:px-5 sm:py-4 space-y-4">
            {loading ? (
                <div className="flex justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((c) => (
                        <div key={c.id} className="flex gap-2.5">
                            <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                                <AvatarFallback className="text-xs bg-secondary">
                                    {getInitials(c.author?.display_name, c.author?.email)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="bg-muted/50 rounded-2xl px-3.5 py-2 inline-block">
                                    <p className="text-sm font-semibold">{c.author?.display_name || c.author?.email?.split('@')[0]}</p>
                                    <p className="text-sm">{c.body}</p>
                                </div>
                                <div className="px-3">
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {formatRelativeTime(c.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-2 text-sm text-muted-foreground pb-2">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </div>
            )}

            {isLoggedIn && (
                <div className="flex gap-2.5 pt-1">
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {getInitials(user?.user_metadata?.display_name, user?.email)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 relative">
                        <Input
                            placeholder="Viết bình luận..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            className="bg-background rounded-full pr-10 hover:bg-background/90 transition-colors"
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleSubmit}
                            disabled={!newComment.trim() || submitting}
                            className="absolute right-1 top-1 h-7 w-7 rounded-full text-primary hover:bg-primary/10"
                        >
                            {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
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
            "transition-all duration-200 overflow-hidden",
            post.is_pinned ? "border-primary/40 shadow-sm ring-1 ring-primary/10" : "shadow-sm hover:shadow-md"
        )}>
            {post.is_pinned && (
                <div className="bg-primary/5 px-4 py-1.5 border-b border-primary/10 flex items-center gap-1.5 text-xs font-medium text-primary">
                    <Pin className="h-3.5 w-3.5" />
                    Bài viết đã ghim
                </div>
            )}

            <CardHeader className="p-4 sm:p-5 pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-muted">
                            <AvatarFallback className="bg-secondary text-secondary-foreground">
                                {getInitials(post.author?.display_name, post.author?.email)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm leading-tight text-foreground hover:underline cursor-pointer">
                                {post.author?.display_name || post.author?.email?.split('@')[0] || 'Ẩn danh'}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground font-medium">
                                <span>{formatRelativeTime(post.created_at)}</span>
                                {post.type === 'announcement' && (
                                    <>
                                        <span>•</span>
                                        <Badge variant="outline" className="h-4 px-1.5 text-[10px] uppercase font-semibold border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
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
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {isAdmin && (
                                    <DropdownMenuItem onClick={handleTogglePin}>
                                        <Pin className="h-4 w-4 mr-2" />
                                        {post.is_pinned ? 'Bỏ ghim bài viết' : 'Ghim bài viết'}
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa bài viết
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 pt-0 space-y-4">
                {post.title && <h3 className="font-bold text-lg leading-tight">{post.title}</h3>}
                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {post.body}
                </div>
            </CardContent>

            <div className="px-4 py-3 sm:px-5 border-t border-muted/50 flex items-center gap-4 text-muted-foreground">
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "rounded-full px-4 h-9 flex-1 sm:flex-none justify-center gap-2 hover:bg-muted font-medium transition-colors",
                        showComments && "bg-muted text-foreground"
                    )}
                    onClick={() => setShowComments(!showComments)}
                >
                    <MessageCircle className="h-4 w-4" />
                    Bình luận {post.comment_count ? `(${post.comment_count})` : ''}
                </Button>
            </div>

            {showComments && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
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
