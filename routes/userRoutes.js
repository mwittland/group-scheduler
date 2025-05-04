import express from 'express';
import { createUser, getUserById } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.post('/', createUser);
router.get('/:id', requireAuth, getUserById);
export default router;