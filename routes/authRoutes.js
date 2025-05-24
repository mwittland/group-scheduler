/*
import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3001/');
  }
);

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send('Logout error');
    res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3001/');
  });
});

router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

export default router;
*/

import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Redirect to frontend with token in URL
    const redirectUrl = new URL(process.env.CLIENT_ORIGIN || 'http://localhost:3001');
    redirectUrl.searchParams.set('token', token);

    res.redirect(redirectUrl.toString());
  }
);

// JWT-based logout is handled client-side by deleting token

router.get('/status', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

export default router;
