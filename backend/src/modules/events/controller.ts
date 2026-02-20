import type { Request, Response, NextFunction } from 'express';
import { eventsService } from './service';
import { createEventDto, updateEventDto, listEventsDto, rsvpDto } from './dto';
import { successResponse, paginatedResponse } from '../../shared/utils/response';

export class EventsController {
    async listEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const query = listEventsDto.parse(req.query);
            const { events, total } = await eventsService.listEvents(query);
            res.json(
                paginatedResponse(events, total, {
                    page: query.page,
                    limit: query.limit,
                    skip: (query.page - 1) * query.limit,
                }),
            );
        } catch (error) {
            next(error);
        }
    }

    async getUpcoming(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit as string) || 5;
            const events = await eventsService.getUpcoming(limit);
            res.json(successResponse(events));
        } catch (error) {
            next(error);
        }
    }

    async getEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const event = await eventsService.getEvent(req.params.id);
            res.json(successResponse(event));
        } catch (error) {
            next(error);
        }
    }

    async createEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const data = createEventDto.parse(req.body);
            const event = await eventsService.createEvent(req.user!.id, data);
            res.status(201).json(successResponse(event));
        } catch (error) {
            next(error);
        }
    }

    async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const data = updateEventDto.parse(req.body);
            const event = await eventsService.updateEvent(req.params.id, req.user!.id, req.user!.role, data);
            res.json(successResponse(event));
        } catch (error) {
            next(error);
        }
    }

    async deleteEvent(req: Request, res: Response, next: NextFunction) {
        try {
            await eventsService.deleteEvent(req.params.id, req.user!.id, req.user!.role);
            res.json(successResponse({ deleted: true }));
        } catch (error) {
            next(error);
        }
    }

    async submitRsvp(req: Request, res: Response, next: NextFunction) {
        try {
            const data = rsvpDto.parse(req.body);
            const rsvp = await eventsService.submitRsvp(req.params.id, req.user!.id, data);
            res.json(successResponse(rsvp));
        } catch (error) {
            next(error);
        }
    }

    async listRsvps(req: Request, res: Response, next: NextFunction) {
        try {
            const rsvps = await eventsService.listRsvps(req.params.id);
            res.json(successResponse(rsvps));
        } catch (error) {
            next(error);
        }
    }
}

export const eventsController = new EventsController();
