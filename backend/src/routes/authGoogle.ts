import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login-failed' }),
  (req: any, res) => {
    const payload = { id: req.user.id, user_name: req.user.user_name, email: req.user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.redirect(`https://rent1t.vercel.app/login-success?token=${token}`);
  }
);

export default router;
