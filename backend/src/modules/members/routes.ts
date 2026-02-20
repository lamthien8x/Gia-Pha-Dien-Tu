import { Router } from 'express';
import { membersController } from './controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';

const router = Router();
router.use(authMiddleware);

// ── Member Links ──
router.get('/link', membersController.getMyLink);                                      // Get my link
router.get('/links', requireRole('ADMIN'), membersController.listLinks);               // List all links (admin)
router.post('/link', requireRole('ADMIN'), membersController.linkUserPerson);           // Create link (admin)
router.delete('/link/:id', requireRole('ADMIN'), membersController.unlinkUserPerson);   // Delete link (admin)

// ── Editable Scope ──
router.get('/scope', membersController.getEditableScope);                              // My editable scope

// ── Edit Requests ──
router.post('/edits', membersController.submitEdit);                                   // Submit edit
router.get('/edits', requireRole('ADMIN'), membersController.listEdits);               // List all edits (admin)
router.get('/edits/my', membersController.getMyEdits);                                 // My edit history
router.get('/edits/:id', membersController.getEditById);                               // Get edit detail
router.patch('/edits/:id/approve', requireRole('ADMIN'), membersController.approveEdit);
router.patch('/edits/:id/reject', requireRole('ADMIN'), membersController.rejectEdit);

export const membersRoutes = router;
