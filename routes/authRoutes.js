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
