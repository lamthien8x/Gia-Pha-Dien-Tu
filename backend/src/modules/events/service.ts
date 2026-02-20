import { PrismaClient, Prisma } from '@prisma/client';
import type { CreateEventInput, UpdateEventInput, ListEventsQuery, RsvpInput } from './dto';

const prisma = new PrismaClient();

const CREATOR_SELECT = {
    id: true,
    displayName: true,
    avatarUrl: true,
} satisfies Prisma.UserSelect;

const EVENT_INCLUDE = {
    creator: { select: CREATOR_SELECT },
    _count: { select: { rsvps: true } },
} satisfies Prisma.EventInclude;

export class EventsService {
    async listEvents(query: ListEventsQuery) {
        const { page, limit, type, from, to } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.EventWhereInput = {};

        if (type) where.type = type;
        if (from || to) {
            where.startAt = {};
            if (from) where.startAt.gte = new Date(from);
            if (to) where.startAt.lte = new Date(to);
        }

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                include: EVENT_INCLUDE,
                skip,
                take: limit,
                orderBy: { startAt: 'asc' },
            }),
            prisma.event.count({ where }),
        ]);

        return { events, total };
    }

    async getUpcoming(limit: number = 5) {
        return prisma.event.findMany({
            where: { startAt: { gte: new Date() } },
            include: EVENT_INCLUDE,
            take: limit,
            orderBy: { startAt: 'asc' },
        });
    }

    async getEvent(id: string) {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                ...EVENT_INCLUDE,
                rsvps: {
                    include: { user: { select: CREATOR_SELECT } },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!event) {
            const error = new Error('Event not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        return event;
    }

    async createEvent(createdBy: string, data: CreateEventInput) {
        return prisma.event.create({
            data: {
                ...data,
                startAt: new Date(data.startAt),
                endAt: data.endAt ? new Date(data.endAt) : undefined,
                createdBy,
            },
            include: EVENT_INCLUDE,
        });
    }

    async updateEvent(id: string, userId: string, userRole: string, data: UpdateEventInput) {
        const event = await prisma.event.findUnique({ where: { id } });
        if (!event) {
            const error = new Error('Event not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        if (event.createdBy !== userId && !['ADMIN', 'MODERATOR'].includes(userRole)) {
            const error = new Error('Forbidden') as Error & { statusCode: number };
            error.statusCode = 403;
            throw error;
        }

        return prisma.event.update({
            where: { id },
            data: {
                ...data,
                startAt: data.startAt ? new Date(data.startAt) : undefined,
                endAt: data.endAt ? new Date(data.endAt) : undefined,
            },
            include: EVENT_INCLUDE,
        });
    }

    async deleteEvent(id: string, userId: string, userRole: string) {
        const event = await prisma.event.findUnique({ where: { id } });
        if (!event) {
            const error = new Error('Event not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        if (event.createdBy !== userId && !['ADMIN', 'MODERATOR'].includes(userRole)) {
            const error = new Error('Forbidden') as Error & { statusCode: number };
            error.statusCode = 403;
            throw error;
        }

        return prisma.event.delete({ where: { id } });
    }

    // === RSVP ===

    async submitRsvp(eventId: string, userId: string, data: RsvpInput) {
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            const error = new Error('Event not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        return prisma.rSVP.upsert({
            where: { eventId_userId: { eventId, userId } },
            create: { eventId, userId, ...data },
            update: data,
            include: { user: { select: CREATOR_SELECT } },
        });
    }

    async listRsvps(eventId: string) {
        return prisma.rSVP.findMany({
            where: { eventId },
            include: { user: { select: CREATOR_SELECT } },
            orderBy: { createdAt: 'asc' },
        });
    }
}

export const eventsService = new EventsService();
