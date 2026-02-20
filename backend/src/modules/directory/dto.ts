import { z } from 'zod';

export const searchDirectoryDto = z.object({
    q: z.string().optional(),
    branch: z.string().optional(),
    location: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type SearchDirectoryQuery = z.infer<typeof searchDirectoryDto>;

export const updateDirectoryProfileDto = z.object({
    bio: z.string().max(500).optional(),
    location: z.string().max(200).optional(),
    branchName: z.string().max(200).optional(),
});

export type UpdateDirectoryProfile = z.infer<typeof updateDirectoryProfileDto>;
