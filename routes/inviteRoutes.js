import express from 'express';
import { sendInvite, acceptInvite, declineInvite, viewInvites } from '../controllers/inviteController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.get('/view/:id', requireAuth, viewInvites);
router.post('/send', requireAuth, sendInvite);
router.delete('/accept', requireAuth, acceptInvite);
router.delete('/decline', requireAuth, declineInvite);
export default router;