import { Router } from 'express';
import { directoryController } from './controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// All directory routes require authentication
router.use(authMiddleware);

// Search & browse members
router.get('/members', directoryController.searchMembers);
router.get('/members/:id', directoryController.getMemberProfile);

// Filter dropdown data
router.get('/branches', directoryController.getBranches);
router.get('/locations', directoryController.getLocations);

// Update own profile
router.patch('/profile', directoryController.updateProfile);

export const directoryRoutes = router;
