import type { Request, Response, NextFunction } from 'express';
import { directoryService } from './service';
import { searchDirectoryDto, updateDirectoryProfileDto } from './dto';
import { successResponse, paginatedResponse } from '../../shared/utils/response';

export class DirectoryController {
    async searchMembers(req: Request, res: Response, next: NextFunction) {
        try {
            const query = searchDirectoryDto.parse(req.query);
            const { members, total } = await directoryService.searchMembers(query);
            res.json(
                paginatedResponse(members, total, {
                    page: query.page,
                    limit: query.limit,
                    skip: (query.page - 1) * query.limit,
                }),
            );
        } catch (error) {
            next(error);
        }
    }

    async getMemberProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const member = await directoryService.getMemberProfile(req.params.id);
            res.json(successResponse(member));
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const data = updateDirectoryProfileDto.parse(req.body);
            const profile = await directoryService.updateProfile(req.user!.id, data);
            res.json(successResponse(profile));
        } catch (error) {
            next(error);
        }
    }

    async getBranches(_req: Request, res: Response, next: NextFunction) {
        try {
            const branches = await directoryService.getBranches();
            res.json(successResponse(branches));
        } catch (error) {
            next(error);
        }
    }

    async getLocations(_req: Request, res: Response, next: NextFunction) {
        try {
            const locations = await directoryService.getLocations();
            res.json(successResponse(locations));
        } catch (error) {
            next(error);
        }
    }
}

export const directoryController = new DirectoryController();
