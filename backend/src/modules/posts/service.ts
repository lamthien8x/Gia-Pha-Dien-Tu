import { PrismaClient, Prisma } from '@prisma/client';
import type { CreatePostInput, UpdatePostInput, ListPostsQuery, CreateCommentInput } from './dto';

const prisma = new PrismaClient();

const AUTHOR_SELECT = {
    id: true,
    displayName: true,
    avatarUrl: true,
    role: true,
    branchName: true,
} satisfies Prisma.UserSelect;

const POST_INCLUDE = {
    author: { select: AUTHOR_SELECT },
    _count: { select: { comments: true } },
} satisfies Prisma.PostInclude;

const COMMENT_INCLUDE = {
    author: { select: AUTHOR_SELECT },
    replies: {
        include: {
            author: { select: AUTHOR_SELECT },
        },
        orderBy: { createdAt: 'asc' as const },
    },
} satisfies Prisma.CommentInclude;

export class PostsService {
    async listPosts(query: ListPostsQuery) {
        const { page, limit, type } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.PostWhereInput = {
            status: 'PUBLISHED',
        };

        if (type) {
            where.type = type;
        }

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                include: POST_INCLUDE,
                skip,
                take: limit,
                orderBy: [
                    { isPinned: 'desc' },
                    { createdAt: 'desc' },
                ],
            }),
            prisma.post.count({ where }),
        ]);

        return { posts, total };
    }

    async getPost(id: string) {
        const post = await prisma.post.findUnique({
            where: { id },
            include: POST_INCLUDE,
        });

        if (!post || post.status === 'DELETED') {
            const error = new Error('Post not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        return post;
    }

    async createPost(authorId: string, data: CreatePostInput) {
        return prisma.post.create({
            data: {
                authorId,
                type: data.type,
                title: data.title,
                body: data.body,
                mediaRefs: data.mediaRefs,
            },
            include: POST_INCLUDE,
        });
    }

    async updatePost(id: string, userId: string, userRole: string, data: UpdatePostInput) {
        const post = await prisma.post.findUnique({ where: { id } });

        if (!post || post.status === 'DELETED') {
            const error = new Error('Post not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        // Only author or admin can edit
        if (post.authorId !== userId && userRole !== 'ADMIN') {
            const error = new Error('Forbidden') as Error & { statusCode: number };
            error.statusCode = 403;
            throw error;
        }

        return prisma.post.update({
            where: { id },
            data,
            include: POST_INCLUDE,
        });
    }

    async deletePost(id: string, userId: string, userRole: string) {
        const post = await prisma.post.findUnique({ where: { id } });

        if (!post) {
            const error = new Error('Post not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        if (post.authorId !== userId && !['ADMIN', 'MODERATOR'].includes(userRole)) {
            const error = new Error('Forbidden') as Error & { statusCode: number };
            error.statusCode = 403;
            throw error;
        }

        return prisma.post.update({
            where: { id },
            data: { status: 'DELETED' },
        });
    }

    async togglePin(id: string) {
        const post = await prisma.post.findUnique({ where: { id } });

        if (!post) {
            const error = new Error('Post not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        return prisma.post.update({
            where: { id },
            data: { isPinned: !post.isPinned },
            include: POST_INCLUDE,
        });
    }

    // === Comments ===

    async listComments(postId: string) {
        return prisma.comment.findMany({
            where: { postId, parentId: null },
            include: COMMENT_INCLUDE,
            orderBy: { createdAt: 'asc' },
        });
    }

    async createComment(postId: string, authorId: string, data: CreateCommentInput) {
        // Verify post exists
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post || post.status === 'DELETED') {
            const error = new Error('Post not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        return prisma.comment.create({
            data: {
                postId,
                authorId,
                body: data.body,
                parentId: data.parentId,
            },
            include: {
                author: { select: AUTHOR_SELECT },
            },
        });
    }

    async deleteComment(commentId: string, userId: string, userRole: string) {
        const comment = await prisma.comment.findUnique({ where: { id: commentId } });

        if (!comment) {
            const error = new Error('Comment not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        if (comment.authorId !== userId && !['ADMIN', 'MODERATOR'].includes(userRole)) {
            const error = new Error('Forbidden') as Error & { statusCode: number };
            error.statusCode = 403;
            throw error;
        }

        return prisma.comment.delete({ where: { id: commentId } });
    }
}

export const postsService = new PostsService();
