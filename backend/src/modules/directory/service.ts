import { PrismaClient, Prisma } from '@prisma/client';
import type { SearchDirectoryQuery, UpdateDirectoryProfile } from './dto';

const prisma = new PrismaClient();

const MEMBER_SELECT = {
    id: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    location: true,
    branchName: true,
    role: true,
    createdAt: true,
} satisfies Prisma.UserSelect;

const PROFILE_SELECT = {
    ...MEMBER_SELECT,
    email: true,
    phone: true,
    grampsPersonId: true,
    personLink: {
        select: { personHandle: true },
    },
} satisfies Prisma.UserSelect;

export class DirectoryService {
    async searchMembers(query: SearchDirectoryQuery) {
        const { q, branch, location, page, limit } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.UserWhereInput = {
            status: 'ACTIVE',
        };

        // Text search on displayName
        if (q) {
            where.displayName = { contains: q, mode: 'insensitive' };
        }

        // Filter by branch
        if (branch) {
            where.branchName = { contains: branch, mode: 'insensitive' };
        }

        // Filter by location
        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }

        const [members, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: MEMBER_SELECT,
                skip,
                take: limit,
                orderBy: { displayName: 'asc' },
            }),
            prisma.user.count({ where }),
        ]);

        return { members, total };
    }

    async getMemberProfile(id: string) {
        const member = await prisma.user.findUnique({
            where: { id },
            select: PROFILE_SELECT,
        });

        if (!member) {
            const error = new Error('Member not found') as Error & { statusCode: number };
            error.statusCode = 404;
            throw error;
        }

        return member;
    }

    async updateProfile(userId: string, data: UpdateDirectoryProfile) {
        return prisma.user.update({
            where: { id: userId },
            data,
            select: PROFILE_SELECT,
        });
    }

    async getBranches() {
        const branches = await prisma.user.groupBy({
            by: ['branchName'],
            where: {
                branchName: { not: null },
                status: 'ACTIVE',
            },
            _count: { branchName: true },
            orderBy: { branchName: 'asc' },
        });

        return branches
            .filter((b) => b.branchName !== null)
            .map((b) => ({
                name: b.branchName!,
                count: b._count.branchName,
            }));
    }

    async getLocations() {
        const locations = await prisma.user.groupBy({
            by: ['location'],
            where: {
                location: { not: null },
                status: 'ACTIVE',
            },
            _count: { location: true },
            orderBy: { location: 'asc' },
        });

        return locations
            .filter((l) => l.location !== null)
            .map((l) => ({
                name: l.location!,
                count: l._count.location,
            }));
    }
}

export const directoryService = new DirectoryService();
