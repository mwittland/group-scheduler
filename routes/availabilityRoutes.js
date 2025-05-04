import express from 'express';
import { createAvailability, getAvailabilityByCalendarId } from '../controllers/availabilityController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.post('/', requireAuth, createAvailability);
router.get('/:id', requireAuth, getAvailabilityByCalendarId);
export default router;