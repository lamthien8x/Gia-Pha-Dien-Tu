import type { Request, Response, NextFunction } from 'express';
import { postsService } from './service';
import { createPostDto, updatePostDto, listPostsDto, createCommentDto } from './dto';
import { successResponse, paginatedResponse } from '../../shared/utils/response';

export class PostsController {
    async listPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const query = listPostsDto.parse(req.query);
            const { posts, total } = await postsService.listPosts(query);
            res.json(
                paginatedResponse(posts, total, {
                    page: query.page,
                    limit: query.limit,
                    skip: (query.page - 1) * query.limit,
                }),
            );
        } catch (error) {
            next(error);
        }
    }

    async getPost(req: Request, res: Response, next: NextFunction) {
        try {
            const post = await postsService.getPost(req.params.id);
            res.json(successResponse(post));
        } catch (error) {
            next(error);
        }
    }

    async createPost(req: Request, res: Response, next: NextFunction) {
        try {
            const data = createPostDto.parse(req.body);
            const post = await postsService.createPost(req.user!.id, data);
            res.status(201).json(successResponse(post));
        } catch (error) {
            next(error);
        }
    }

    async updatePost(req: Request, res: Response, next: NextFunction) {
        try {
            const data = updatePostDto.parse(req.body);
            const post = await postsService.updatePost(req.params.id, req.user!.id, req.user!.role, data);
            res.json(successResponse(post));
        } catch (error) {
            next(error);
        }
    }

    async deletePost(req: Request, res: Response, next: NextFunction) {
        try {
            await postsService.deletePost(req.params.id, req.user!.id, req.user!.role);
            res.json(successResponse({ deleted: true }));
        } catch (error) {
            next(error);
        }
    }

    async togglePin(req: Request, res: Response, next: NextFunction) {
        try {
            const post = await postsService.togglePin(req.params.id);
            res.json(successResponse(post));
        } catch (error) {
            next(error);
        }
    }

    // === Comments ===

    async listComments(req: Request, res: Response, next: NextFunction) {
        try {
            const comments = await postsService.listComments(req.params.id);
            res.json(successResponse(comments));
        } catch (error) {
            next(error);
        }
    }

    async createComment(req: Request, res: Response, next: NextFunction) {
        try {
            const data = createCommentDto.parse(req.body);
            const comment = await postsService.createComment(req.params.id, req.user!.id, data);
            res.status(201).json(successResponse(comment));
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            await postsService.deleteComment(req.params.commentId, req.user!.id, req.user!.role);
            res.json(successResponse({ deleted: true }));
        } catch (error) {
            next(error);
        }
    }
}

export const postsController = new PostsController();
