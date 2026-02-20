import { Router } from 'express';
import { postsController } from './controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';

const router = Router();

// All post routes require authentication
router.use(authMiddleware);

// Feed
router.get('/', postsController.listPosts);
router.get('/:id', postsController.getPost);

// Create — MODERATOR+ can post to main feed (MODERATOR=35, EDITOR=40, ADMIN=50)
router.post('/', requireRole('MODERATOR'), postsController.createPost);

// Update/Delete — author or admin (checked in service)
router.patch('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);

// Pin — admin/moderator only
router.patch('/:id/pin', requireRole('MODERATOR'), postsController.togglePin);

// Comments — all authenticated members
router.get('/:id/comments', postsController.listComments);
router.post('/:id/comments', postsController.createComment);
router.delete('/:id/comments/:commentId', postsController.deleteComment);

export const postsRoutes = router;
