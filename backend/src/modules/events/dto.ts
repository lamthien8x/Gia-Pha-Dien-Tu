import { z } from 'zod';

export const createEventDto = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(5000).optional(),
    startAt: z.string().datetime(),
    endAt: z.string().datetime().optional(),
    location: z.string().max(300).optional(),
    type: z.enum(['MEMORIAL', 'MEETING', 'FESTIVAL', 'BIRTHDAY', 'GENERAL']).default('MEMORIAL'),
    isRecurring: z.boolean().default(false),
    recurrence: z.any().optional(),
});

export type CreateEventInput = z.infer<typeof createEventDto>;

export const updateEventDto = createEventDto.partial();
export type UpdateEventInput = z.infer<typeof updateEventDto>;

export const listEventsDto = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    type: z.enum(['MEMORIAL', 'MEETING', 'FESTIVAL', 'BIRTHDAY', 'GENERAL']).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
});

export type ListEventsQuery = z.infer<typeof listEventsDto>;

export const rsvpDto = z.object({
    status: z.enum(['GOING', 'NOT_GOING', 'MAYBE']),
    guestsCount: z.number().int().min(0).max(50).default(0),
    note: z.string().max(500).optional(),
});

export type RsvpInput = z.infer<typeof rsvpDto>;
