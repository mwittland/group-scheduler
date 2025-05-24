import { authenticateJWT } from './authMiddleware.js';

export const requireAuth = (req, res, next) => {
  authenticateJWT(req, res, next);
};
