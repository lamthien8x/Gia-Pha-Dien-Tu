import { z } from 'zod';

// === Link user ↔ person card ===
export const linkUserPersonSchema = z.object({
    userId: z.string().min(1, 'userId is required'),
    personHandle: z.string().min(1, 'personHandle is required'),
});
export type LinkUserPersonDto = z.infer<typeof linkUserPersonSchema>;

// === Submit edit request ===
export const submitEditSchema = z.object({
    targetHandle: z.string().min(1),
    targetName: z.string().min(1),
    editType: z.enum(['UPDATE_PERSON', 'CREATE_PERSON', 'DELETE_PERSON', 'ADD_SPOUSE']),
    fieldChanges: z.record(z.any()),
    reason: z.string().optional(),
});
export type SubmitEditDto = z.infer<typeof submitEditSchema>;

// === Review edit request ===
export const reviewEditSchema = z.object({
    reviewNote: z.string().optional(),
});
export type ReviewEditDto = z.infer<typeof reviewEditSchema>;
