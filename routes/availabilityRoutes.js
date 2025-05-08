import express from 'express';
import { createAvailability, getAvailabilityByCalendarId, toggleAvailability } from '../controllers/availabilityController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.post('/', requireAuth, createAvailability);
router.get('/:id', requireAuth, getAvailabilityByCalendarId);
router.post('/toggle', requireAuth, toggleAvailability);
export default router;