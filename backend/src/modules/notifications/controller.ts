import type { Request, Response, NextFunction } from 'express';
import { notificationsService } from './service';
import { successResponse, paginatedResponse } from '../../shared/utils/response';

export class NotificationsController {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const { notifications, total, unreadCount } = await notificationsService.listForUser(
                req.user!.id,
                page,
                limit,
            );
            res.json({
                ...paginatedResponse(notifications, total, {
                    page,
                    limit,
                    skip: (page - 1) * limit,
                }),
                unreadCount,
            });
        } catch (error) {
            next(error);
        }
    }

    async unreadCount(req: Request, res: Response, next: NextFunction) {
        try {
            const count = await notificationsService.getUnreadCount(req.user!.id);
            res.json(successResponse({ count }));
        } catch (error) {
            next(error);
        }
    }

    async markAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            await notificationsService.markAsRead(req.params.id, req.user!.id);
            res.json(successResponse({ read: true }));
        } catch (error) {
            next(error);
        }
    }

    async markAllAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            await notificationsService.markAllAsRead(req.user!.id);
            res.json(successResponse({ read: true }));
        } catch (error) {
            next(error);
        }
    }
}

export const notificationsController = new NotificationsController();
