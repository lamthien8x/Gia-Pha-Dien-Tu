import prisma from '../../config/database';
import { AppError } from '../../middleware/error-handler';
import type { LinkUserPersonDto, SubmitEditDto, ReviewEditDto } from './dto';
import type { Role } from '@prisma/client';
import { MOCK_PEOPLE, MOCK_FAMILIES } from './mock-data';

// Roles that bypass approval
const BYPASS_ROLES: Role[] = ['ADMIN', 'EDITOR', 'ARCHIVIST'];

export class MembersService {
    // ──────────────────────────────────────────────
    // LINK USER ↔ PERSON CARD
    // ──────────────────────────────────────────────

    async linkUserPerson(dto: LinkUserPersonDto, linkedBy: string) {
        // Check user exists
        const user = await prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'Không tìm thấy user');

        // Check no existing links for either side
        const existingUserLink = await prisma.userPersonLink.findUnique({ where: { userId: dto.userId } });
        if (existingUserLink) throw new AppError(409, 'USER_ALREADY_LINKED', 'User đã được gán card');

        const existingPersonLink = await prisma.userPersonLink.findUnique({ where: { personHandle: dto.personHandle } });
        if (existingPersonLink) throw new AppError(409, 'PERSON_ALREADY_LINKED', 'Card đã được gán cho user khác');

        return prisma.userPersonLink.create({
            data: {
                userId: dto.userId,
                personHandle: dto.personHandle,
                linkedBy,
            },
            include: { user: { select: { id: true, displayName: true, email: true } } },
        });
    }

    async unlinkUserPerson(linkId: string) {
        const link = await prisma.userPersonLink.findUnique({ where: { id: linkId } });
        if (!link) throw new AppError(404, 'LINK_NOT_FOUND', 'Không tìm thấy link');

        return prisma.userPersonLink.delete({ where: { id: linkId } });
    }

    async getMyLink(userId: string) {
        return prisma.userPersonLink.findUnique({ where: { userId } });
    }

    async listLinks(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [links, total] = await Promise.all([
            prisma.userPersonLink.findMany({
                skip,
                take: limit,
                include: { user: { select: { id: true, displayName: true, email: true, role: true } } },
                orderBy: { linkedAt: 'desc' },
            }),
            prisma.userPersonLink.count(),
        ]);
        return { links, total };
    }

    // ──────────────────────────────────────────────
    // EDITABLE SCOPE — 2 generations up + 2 down
    // ──────────────────────────────────────────────

    async getEditableScope(userId: string, userRole: Role) {
        // Admin/Editor/Archivist can edit everything
        if (BYPASS_ROLES.includes(userRole)) {
            return { scope: 'ALL', handles: MOCK_PEOPLE.map(p => p.handle) };
        }

        // Member: check link
        const link = await prisma.userPersonLink.findUnique({ where: { userId } });
        if (!link) {
            return { scope: 'NONE', handles: [] };
        }

        const handles = this.computeScope(link.personHandle, 2, 2);
        return { scope: 'LIMITED', linkedHandle: link.personHandle, handles };
    }

    /**
     * BFS-based scope computation:
     * From the linked person, traverse up `upGens` generations and down `downGens` generations.
     * Include siblings (same parent family) and spouses.
     */
    private computeScope(rootHandle: string, upGens: number, downGens: number): string[] {
        const scope = new Set<string>();
        scope.add(rootHandle);

        // Find root person
        const rootPerson = MOCK_PEOPLE.find(p => p.handle === rootHandle);
        if (!rootPerson) return [rootHandle];

        // Get root's generation
        const rootGen = this.getGeneration(rootHandle);

        // Traverse UP: parents, grandparents (and their spouses/siblings)
        const upQueue: { handle: string; depth: number }[] = [{ handle: rootHandle, depth: 0 }];
        const visitedUp = new Set<string>();
        while (upQueue.length > 0) {
            const { handle, depth } = upQueue.shift()!;
            if (visitedUp.has(handle)) continue;
            visitedUp.add(handle);
            scope.add(handle);

            if (depth < upGens) {
                // Find parent families of this person
                const person = MOCK_PEOPLE.find(p => p.handle === handle);
                if (person?.parentFamilies) {
                    for (const famHandle of person.parentFamilies) {
                        const fam = MOCK_FAMILIES.find(f => f.handle === famHandle);
                        if (fam) {
                            if (fam.fatherHandle) { scope.add(fam.fatherHandle); upQueue.push({ handle: fam.fatherHandle, depth: depth + 1 }); }
                            if (fam.motherHandle) { scope.add(fam.motherHandle); upQueue.push({ handle: fam.motherHandle, depth: depth + 1 }); }
                            // Add siblings (children of same family)
                            for (const ch of fam.children) { scope.add(ch); }
                        }
                    }
                }
            }
        }

        // Traverse DOWN: children, grandchildren
        const downQueue: { handle: string; depth: number }[] = [{ handle: rootHandle, depth: 0 }];
        const visitedDown = new Set<string>();
        while (downQueue.length > 0) {
            const { handle, depth } = downQueue.shift()!;
            if (visitedDown.has(handle)) continue;
            visitedDown.add(handle);
            scope.add(handle);

            if (depth < downGens) {
                // Find families where this person is father or mother
                const person = MOCK_PEOPLE.find(p => p.handle === handle);
                if (person?.families) {
                    for (const famHandle of person.families) {
                        const fam = MOCK_FAMILIES.find(f => f.handle === famHandle);
                        if (fam) {
                            // Add spouse
                            if (fam.fatherHandle && fam.fatherHandle !== handle) scope.add(fam.fatherHandle);
                            if (fam.motherHandle && fam.motherHandle !== handle) scope.add(fam.motherHandle);
                            // Add children and recurse
                            for (const ch of fam.children) {
                                scope.add(ch);
                                downQueue.push({ handle: ch, depth: depth + 1 });
                            }
                        }
                    }
                }
            }
        }

        return Array.from(scope);
    }

    private getGeneration(handle: string): number {
        const person = MOCK_PEOPLE.find(p => p.handle === handle);
        if (!person) return 0;
        // Use generation from the person's position in tree
        // Count parents up to root
        let gen = 1;
        let current = person;
        while (current.parentFamilies && current.parentFamilies.length > 0) {
            const fam = MOCK_FAMILIES.find(f => f.handle === current.parentFamilies![0]);
            if (fam?.fatherHandle) {
                const father = MOCK_PEOPLE.find(p => p.handle === fam.fatherHandle);
                if (father) { current = father; gen++; continue; }
            }
            if (fam?.motherHandle) {
                const mother = MOCK_PEOPLE.find(p => p.handle === fam.motherHandle);
                if (mother) { current = mother; gen++; continue; }
            }
            break;
        }
        return gen;
    }

    // ──────────────────────────────────────────────
    // EDIT REQUESTS
    // ──────────────────────────────────────────────

    async submitEdit(userId: string, userRole: Role, dto: SubmitEditDto) {
        // Check scope
        const scopeResult = await this.getEditableScope(userId, userRole);
        if (scopeResult.scope === 'NONE') {
            throw new AppError(403, 'NOT_LINKED', 'Bạn chưa được gán với thành viên nào');
        }
        if (scopeResult.scope === 'LIMITED' && !scopeResult.handles.includes(dto.targetHandle)) {
            throw new AppError(403, 'OUT_OF_SCOPE', 'Bạn không có quyền chỉnh sửa thành viên này');
        }

        // Auto-approve for Editor/Archivist/Admin
        const autoApprove = BYPASS_ROLES.includes(userRole);
        const status = autoApprove ? 'APPROVED' : 'PENDING';

        const editRequest = await prisma.personEditRequest.create({
            data: {
                requesterId: userId,
                targetHandle: dto.targetHandle,
                targetName: dto.targetName,
                editType: dto.editType,
                fieldChanges: dto.fieldChanges,
                reason: dto.reason,
                status,
                ...(autoApprove ? {
                    reviewerId: userId,
                    reviewNote: 'Auto-approved (bypass role)',
                    reviewedAt: new Date(),
                } : {}),
            },
            include: {
                requester: { select: { id: true, displayName: true, email: true } },
            },
        });

        return editRequest;
    }

    async listEdits(page: number, limit: number, status?: string) {
        const skip = (page - 1) * limit;
        const where = status ? { status: status as any } : {};
        const [edits, total] = await Promise.all([
            prisma.personEditRequest.findMany({
                where,
                skip,
                take: limit,
                include: {
                    requester: { select: { id: true, displayName: true, email: true, role: true } },
                    reviewer: { select: { id: true, displayName: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.personEditRequest.count({ where }),
        ]);
        return { edits, total };
    }

    async getMyEdits(userId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const where = { requesterId: userId };
        const [edits, total] = await Promise.all([
            prisma.personEditRequest.findMany({
                where,
                skip,
                take: limit,
                include: {
                    reviewer: { select: { id: true, displayName: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.personEditRequest.count({ where }),
        ]);
        return { edits, total };
    }

    async approveEdit(editId: string, reviewerId: string, dto: ReviewEditDto) {
        const edit = await prisma.personEditRequest.findUnique({ where: { id: editId } });
        if (!edit) throw new AppError(404, 'EDIT_NOT_FOUND', 'Không tìm thấy yêu cầu');
        if (edit.status !== 'PENDING') throw new AppError(400, 'NOT_PENDING', 'Yêu cầu không ở trạng thái chờ duyệt');

        // TODO: Apply changes to actual data source (Gramps API or mock data)

        return prisma.personEditRequest.update({
            where: { id: editId },
            data: {
                status: 'APPROVED',
                reviewerId,
                reviewNote: dto.reviewNote,
                reviewedAt: new Date(),
            },
            include: {
                requester: { select: { id: true, displayName: true } },
                reviewer: { select: { id: true, displayName: true } },
            },
        });
    }

    async rejectEdit(editId: string, reviewerId: string, dto: ReviewEditDto) {
        const edit = await prisma.personEditRequest.findUnique({ where: { id: editId } });
        if (!edit) throw new AppError(404, 'EDIT_NOT_FOUND', 'Không tìm thấy yêu cầu');
        if (edit.status !== 'PENDING') throw new AppError(400, 'NOT_PENDING', 'Yêu cầu không ở trạng thái chờ duyệt');

        return prisma.personEditRequest.update({
            where: { id: editId },
            data: {
                status: 'REJECTED',
                reviewerId,
                reviewNote: dto.reviewNote,
                reviewedAt: new Date(),
            },
            include: {
                requester: { select: { id: true, displayName: true } },
                reviewer: { select: { id: true, displayName: true } },
            },
        });
    }

    async getEditById(editId: string) {
        const edit = await prisma.personEditRequest.findUnique({
            where: { id: editId },
            include: {
                requester: { select: { id: true, displayName: true, email: true, role: true } },
                reviewer: { select: { id: true, displayName: true } },
            },
        });
        if (!edit) throw new AppError(404, 'EDIT_NOT_FOUND', 'Không tìm thấy yêu cầu');
        return edit;
    }
}

export const membersService = new MembersService();
