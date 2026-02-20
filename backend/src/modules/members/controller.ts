import type { Request, Response, NextFunction } from 'express';
import { membersService } from './service';
import { linkUserPersonSchema, submitEditSchema, reviewEditSchema } from './dto';
import { AppError } from '../../middleware/error-handler';

export const membersController = {
    // ── Link Management ──

    async linkUserPerson(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = linkUserPersonSchema.parse(req.body);
            const link = await membersService.linkUserPerson(dto, (req as any).user.id);
            res.status(201).json({ success: true, data: link });
        } catch (err) { next(err); }
    },

    async unlinkUserPerson(req: Request, res: Response, next: NextFunction) {
        try {
            await membersService.unlinkUserPerson(req.params.id);
            res.json({ success: true, data: { message: 'Đã gỡ liên kết' } });
        } catch (err) { next(err); }
    },

    async getMyLink(req: Request, res: Response, next: NextFunction) {
        try {
            const link = await membersService.getMyLink((req as any).user.id);
            res.json({ success: true, data: link });
        } catch (err) { next(err); }
    },

    async listLinks(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const result = await membersService.listLinks(page, limit);
            res.json({ success: true, data: result });
        } catch (err) { next(err); }
    },

    // ── Editable Scope ──

    async getEditableScope(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await membersService.getEditableScope(
                (req as any).user.id,
                (req as any).user.role,
            );
            res.json({ success: true, data: result });
        } catch (err) { next(err); }
    },

    // ── Edit Requests ──

    async submitEdit(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = submitEditSchema.parse(req.body);
            const edit = await membersService.submitEdit(
                (req as any).user.id,
                (req as any).user.role,
                dto,
            );
            res.status(201).json({ success: true, data: edit });
        } catch (err) { next(err); }
    },

    async listEdits(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const status = req.query.status as string | undefined;
            const result = await membersService.listEdits(page, limit, status);
            res.json({ success: true, data: result });
        } catch (err) { next(err); }
    },

    async getMyEdits(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const result = await membersService.getMyEdits((req as any).user.id, page, limit);
            res.json({ success: true, data: result });
        } catch (err) { next(err); }
    },

    async getEditById(req: Request, res: Response, next: NextFunction) {
        try {
            const edit = await membersService.getEditById(req.params.id);
            res.json({ success: true, data: edit });
        } catch (err) { next(err); }
    },

    async approveEdit(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = reviewEditSchema.parse(req.body);
            const edit = await membersService.approveEdit(req.params.id, (req as any).user.id, dto);
            res.json({ success: true, data: edit });
        } catch (err) { next(err); }
    },

    async rejectEdit(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = reviewEditSchema.parse(req.body);
            const edit = await membersService.rejectEdit(req.params.id, (req as any).user.id, dto);
            res.json({ success: true, data: edit });
        } catch (err) { next(err); }
    },
};
