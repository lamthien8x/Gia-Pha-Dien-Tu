import { z } from 'zod';

export const createPostDto = z.object({
    type: z.enum(['ANNOUNCEMENT', 'STORY', 'FUND']).default('ANNOUNCEMENT'),
    title: z.string().max(200).optional(),
    body: z.string().min(1).max(10000),
    mediaRefs: z.array(z.string()).max(10).default([]),
});

export type CreatePostInput = z.infer<typeof createPostDto>;

export const updatePostDto = z.object({
    title: z.string().max(200).optional(),
    body: z.string().min(1).max(10000).optional(),
    type: z.enum(['ANNOUNCEMENT', 'STORY', 'FUND']).optional(),
    mediaRefs: z.array(z.string()).max(10).optional(),
});

export type UpdatePostInput = z.infer<typeof updatePostDto>;

export const listPostsDto = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    type: z.enum(['ANNOUNCEMENT', 'STORY', 'FUND']).optional(),
});

export type ListPostsQuery = z.infer<typeof listPostsDto>;

export const createCommentDto = z.object({
    body: z.string().min(1).max(2000),
    parentId: z.string().optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentDto>;
