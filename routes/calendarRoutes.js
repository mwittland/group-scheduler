import express from 'express';
import { createCalendar, getCalendarById } from '../controllers/calendarController.js';
const router = express.Router();
router.post('/', createCalendar);
router.get('/:id', getCalendarById);
export default router;