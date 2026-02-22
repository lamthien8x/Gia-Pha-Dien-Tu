'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    Newspaper,
    MessageCircle,
    PenSquare,
    Pin,
    Trash2,
    ChevronDown,
    Send,
    User,
    Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/auth-provider';
import { postsApi } from '@/lib/api';

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

// === Post Composer ===

function PostComposer({ onPostCreated }: { onPostCreated: () => void }) {
    const { user, isLoggedIn } = useAuth();
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleSubmit = async () => {
        if (!body.trim() || !user) return;
        setSubmitting(true);
        const { error } = await postsApi.create({
            author_id: user.id,
            title: title.trim() || undefined,
            body: body.trim(),
        });
        if (!error) {
            setBody('');
            setTitle('');
            setExpanded(false);
            onPostCreated();
        }
        setSubmitting(false);
    };

    if (!isLoggedIn) return null;

    return (
        <Card>
            <CardContent className="pt-4 space-y-3">
                {expanded && (
                    <Input
                        placeholder="Tiêu đề (tùy chọn)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                )}
                <Textarea
                    placeholder="Chia sẻ điều gì đó với dòng họ..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    onFocus={() => setExpanded(true)}
                    rows={expanded ? 4 : 2}
                />
                {expanded && (
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setExpanded(false)}>
                            Hủy
                        </Button>
                        <Button size="sm" onClick={handleSubmit} disabled={!body.trim() || submitting}>
                            <PenSquare className="mr-2 h-4 w-4" />
                            {submitting ? 'Đang đăng...' : 'Đăng bài'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// === Comment Section ===

function CommentSection({ postId }: { postId: string }) {
    const { user, isLoggedIn } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        setLoading(true);
        const { data } = await postsApi.getComments(postId);
        if (data) setComments(data);
        setLoading(false);
    }, [postId]);

    useEffect(() => { fetchComments(); }, [fetchComments]);

    const handleSubmit = async () => {
        if (!newComment.trim() || !user) return;
        const { error } = await postsApi.addComment(postId, user.id, newComment.trim());
        if (!error) {
            setNewComment('');
            fetchComments();
        }
    };

    return (
        <div className="border-t pt-3 space-y-3">
            {loading ? (
                <p className="text-xs text-muted-foreground">Đang tải...</p>
            ) : (
                comments.map((c) => (
                    <div key={c.id} className="flex gap-2">
                        <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium">{c.author?.display_name || c.author?.email?.split('@')[0]}</p>
                            <p className="text-sm">{c.body}</p>
                            <span className="text-xs text-muted-foreground">
                                {new Date(c.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))
            )}
            {isLoggedIn && (
                <div className="flex gap-2">
                    <Input
                        placeholder="Viết bình luận..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        className="text-sm"
                    />
                    <Button size="icon" variant="ghost" onClick={handleSubmit} disabled={!newComment.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}

// === Post Card ===

function PostCard({ post, onRefresh }: { post: Post; onRefresh: () => void }) {
    const { user, isAdmin } = useAuth();
    const [showComments, setShowComments] = useState(false);

    const handleDelete = async () => {
        const { error } = await postsApi.delete(post.id);
        if (!error) onRefresh();
    };

    const handleTogglePin = async () => {
        const { error } = await postsApi.togglePin(post.id, !post.is_pinned);
        if (!error) onRefresh();
    };

    return (
        <Card className={post.is_pinned ? 'border-primary/30 bg-primary/5' : ''}>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">{post.author?.display_name || post.author?.email?.split('@')[0] || 'Ẩn danh'}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                    {(isAdmin || user?.id === post.author_id) && (
                        <div className="flex gap-1">
                            {isAdmin && (
                                <Button variant="ghost" size="icon" onClick={handleTogglePin} title={post.is_pinned ? 'Bỏ ghim' : 'Ghim'}>
                                    <Pin className={`h-4 w-4 ${post.is_pinned ? 'text-primary' : ''}`} />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {post.is_pinned && <Badge variant="secondary" className="text-xs">📌 Ghim</Badge>}
                {post.title && <h3 className="font-semibold">{post.title}</h3>}
                <p className="text-sm whitespace-pre-wrap">{post.body}</p>
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setShowComments(!showComments)}>
                    <MessageCircle className="mr-1 h-4 w-4" />
                    Bình luận {post.comment_count ? `(${post.comment_count})` : ''}
                    <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${showComments ? 'rotate-180' : ''}`} />
                </Button>
                {showComments && <CommentSection postId={post.id} />}
            </CardContent>
        </Card>
    );
}

// === Main Feed Page ===

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        const { data } = await postsApi.list();
        if (data) {
            setPosts(data);
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Newspaper className="h-6 w-6" />
                    Bảng tin
                </h1>
                <p className="text-muted-foreground">Tin tức và hoạt động dòng họ</p>
            </div>

            <PostComposer onPostCreated={fetchPosts} />

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : posts.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Chưa có bài viết nào</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} onRefresh={fetchPosts} />
                    ))}
                </div>
            )}
        </div>
    );
}
