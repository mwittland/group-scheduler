import express from 'express';
import { sendInvite, acceptInvite, declineInvite } from '../controllers/inviteController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.post('/send', requireAuth, sendInvite);
router.post('/accept', requireAuth, acceptInvite);
router.delete('/decline', requireAuth, declineInvite);
export default router;