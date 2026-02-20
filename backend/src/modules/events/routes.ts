import { Router } from 'express';
import { eventsController } from './controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';

const router = Router();

router.use(authMiddleware);

// List & upcoming
router.get('/', eventsController.listEvents);
router.get('/upcoming', eventsController.getUpcoming);
router.get('/:id', eventsController.getEvent);

// Create — MODERATOR+ (trưởng tộc, ban tổ chức)
router.post('/', requireRole('MODERATOR'), eventsController.createEvent);

// Update/Delete — creator or admin (checked in service)
router.patch('/:id', eventsController.updateEvent);
router.delete('/:id', eventsController.deleteEvent);

// RSVP — all members
router.post('/:id/rsvp', eventsController.submitRsvp);
router.get('/:id/rsvps', eventsController.listRsvps);

export const eventsRoutes = router;
