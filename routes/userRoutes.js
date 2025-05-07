import express from 'express';
import { createUser, getUserById, getUserByEmail } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.post('/', createUser);
router.get('/:id', requireAuth, getUserById);
router.get('/', requireAuth, getUserByEmail);
export default router;