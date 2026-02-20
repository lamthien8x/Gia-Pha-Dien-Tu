import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationsService {
    async listForUser(userId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [notifications, total, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.notification.count({ where: { userId } }),
            prisma.notification.count({ where: { userId, isRead: false } }),
        ]);

        return { notifications, total, unreadCount };
    }

    async getUnreadCount(userId: string) {
        return prisma.notification.count({ where: { userId, isRead: false } });
    }

    async markAsRead(id: string, userId: string) {
        return prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
    }

    async markAllAsRead(userId: string) {
        return prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }

    async create(userId: string, type: string, title: string, message: string, linkUrl?: string) {
        return prisma.notification.create({
            data: { userId, type, title, message, linkUrl },
        });
    }

    async createForAll(type: string, title: string, message: string, linkUrl?: string) {
        const users = await prisma.user.findMany({
            where: { status: 'ACTIVE' },
            select: { id: true },
        });

        return prisma.notification.createMany({
            data: users.map((u: { id: string }) => ({ userId: u.id, type, title, message, linkUrl })),
        });
    }
}

export const notificationsService = new NotificationsService();
