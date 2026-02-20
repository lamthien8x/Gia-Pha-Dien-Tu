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

// === Types ===

interface Author {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    role: string;
    branchName: string | null;
}

interface Post {
    id: string;
    author: Author;
    type: string;
    title: string | null;
    body: string;
    isPinned: boolean;
    status: string;
    mediaRefs: string[];
    createdAt: string;
    updatedAt: string;
    _count: { comments: number };
}

interface Comment {
    id: string;
    author: Author;
    body: string;
    parentId: string | null;
    createdAt: string;
    replies: Comment[];
}

// === Post Composer ===

function PostComposer({ onPostCreated }: { onPostCreated: () => void }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [type, setType] = useState('ANNOUNCEMENT');
    const [submitting, setSubmitting] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleSubmit = async () => {
        if (!body.trim()) return;
        setSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!token || !apiUrl) return;

            const res = await fetch(`${apiUrl}/posts`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: title || undefined, body, type }),
            });
            if (res.ok) {
                setTitle('');
                setBody('');
                setExpanded(false);
                onPostCreated();
            }
        } catch {
            // ignore
        } finally {
            setSubmitting(false);
        }
    };

    const typeLabels: Record<string, string> = {
        ANNOUNCEMENT: '📢 Thông báo',
        STORY: '📖 Câu chuyện',
        FUND: '💰 Quỹ họ',
    };

    if (!expanded) {
        return (
            <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpanded(true)}
            >
                <CardContent className="p-4 flex items-center gap-3 text-muted-foreground">
                    <PenSquare className="h-5 w-5" />
                    <span>Đăng thông báo hoặc chia sẻ cho dòng họ...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        {Object.entries(typeLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                <Input
                    placeholder="Tiêu đề (tuỳ chọn)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <Textarea
                    placeholder="Nội dung bài viết..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    className="resize-none"
                />

                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setExpanded(false)}>
                        Huỷ
                    </Button>
                    <Button size="sm" onClick={handleSubmit} disabled={!body.trim() || submitting}>
                        {submitting ? 'Đang đăng...' : 'Đăng bài'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// === Comment Section ===

function CommentSection({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!token || !apiUrl) return;

            const res = await fetch(`${apiUrl}/posts/${postId}/comments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const json = await res.json();
                setComments(json.data);
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!token || !apiUrl) return;

            const res = await fetch(`${apiUrl}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ body: newComment }),
            });
            if (res.ok) {
                setNewComment('');
                fetchComments();
            }
        } catch {
            // ignore
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-sm text-muted-foreground p-2">Đang tải bình luận...</div>;
    }

    return (
        <div className="space-y-3 pt-3 border-t">
            {/* Comment list */}
            {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <div className="bg-muted rounded-lg px-3 py-2">
                            <span className="font-medium text-sm">{comment.author.displayName}</span>
                            <p className="text-sm mt-0.5">{comment.body}</p>
                        </div>
                        <span className="text-xs text-muted-foreground ml-3">
                            {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                            })}
                        </span>
                        {/* Nested replies */}
                        {comment.replies?.length > 0 && (
                            <div className="ml-4 mt-2 space-y-2">
                                {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-2">
                                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                                            <User className="h-3 w-3 text-muted-foreground" />
                                        </div>
                                        <div className="bg-muted rounded-lg px-3 py-1.5">
                                            <span className="font-medium text-xs">{reply.author.displayName}</span>
                                            <p className="text-xs mt-0.5">{reply.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* New comment input */}
            <div className="flex gap-2 items-end">
                <Input
                    placeholder="Viết bình luận..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                    className="text-sm"
                />
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || submitting}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

// === Post Card ===

function PostCard({ post, onRefresh }: { post: Post; onRefresh: () => void }) {
    const [showComments, setShowComments] = useState(false);

    const typeLabels: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary' | 'outline' }> = {
        ANNOUNCEMENT: { label: '📢 Thông báo', variant: 'default' },
        STORY: { label: '📖 Câu chuyện', variant: 'secondary' },
        FUND: { label: '💰 Quỹ họ', variant: 'outline' },
    };

    const typeInfo = typeLabels[post.type] || { label: post.type, variant: 'secondary' as const };

    return (
        <Card className={post.isPinned ? 'border-primary/50 shadow-md' : ''}>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {/* Author avatar */}
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            {post.author.avatarUrl ? (
                                <img
                                    src={post.author.avatarUrl}
                                    alt={post.author.displayName}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-5 w-5 text-primary" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{post.author.displayName}</span>
                                <Badge variant={typeInfo.variant} className="text-xs">
                                    {typeInfo.label}
                                </Badge>
                                {post.isPinned && (
                                    <Pin className="h-3.5 w-3.5 text-primary" />
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Title */}
                {post.title && (
                    <h2 className="text-lg font-bold">{post.title}</h2>
                )}

                {/* Body */}
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {post.body}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post._count.comments} bình luận
                        <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showComments ? 'rotate-180' : ''}`} />
                    </Button>
                </div>

                {/* Comments */}
                {showComments && <CommentSection postId={post.id} />}
            </CardContent>
        </Card>
    );
}

// === Main Feed Page ===

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [typeFilter, setTypeFilter] = useState('');

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!token || !apiUrl) return;

            const params = new URLSearchParams({ page: String(page), limit: '10' });
            if (typeFilter) params.set('type', typeFilter);

            const res = await fetch(`${apiUrl}/posts?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const json = await res.json();
                setPosts(json.data);
                setTotalPages(json.meta.totalPages);
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, [page, typeFilter]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        setPage(1);
    }, [typeFilter]);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Newspaper className="h-6 w-6" />
                    Bảng tin Dòng họ
                </h1>
                <p className="text-muted-foreground">
                    Tin tức, thông báo và câu chuyện từ dòng họ
                </p>
            </div>

            {/* Type filter */}
            <div className="flex gap-2">
                <Button
                    variant={typeFilter === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTypeFilter('')}
                >
                    Tất cả
                </Button>
                <Button
                    variant={typeFilter === 'ANNOUNCEMENT' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTypeFilter('ANNOUNCEMENT')}
                >
                    📢 Thông báo
                </Button>
                <Button
                    variant={typeFilter === 'STORY' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTypeFilter('STORY')}
                >
                    📖 Câu chuyện
                </Button>
                <Button
                    variant={typeFilter === 'FUND' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTypeFilter('FUND')}
                >
                    💰 Quỹ họ
                </Button>
            </div>

            {/* Post Composer */}
            <PostComposer onPostCreated={fetchPosts} />

            {/* Post List */}
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Trang trước
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Trang {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Trang sau
                    </Button>
                </div>
            )}
        </div>
    );
}
