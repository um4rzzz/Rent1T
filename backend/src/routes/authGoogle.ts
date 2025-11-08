import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.all('/google', (req, res, next) => {
  if (req.method !== 'GET') {
    return res.status(405).json({
      message: 'Passport Google OAuth expects a GET request to /api/auth/google',
      receivedMethod: req.method,
      hint: 'Ensure the frontend uses window.location.href or a normal link to hit this URL.'
    });
  }
  return next();
});

router.get('/google', (req, res, next) => {
  // Check if Google OAuth is properly configured
  const hasClientId = !!process.env.GOOGLE_CLIENT_ID;
  const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  const hasCallbackUrl = !!process.env.GOOGLE_CALLBACK_URL;
  
  if (!hasClientId || !hasClientSecret || !hasCallbackUrl) {
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>OAuth Configuration Error</title></head>
        <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
          <h1 style="color: #d32f2f;">Google OAuth Configuration Error</h1>
          <p>Please set the following environment variables in your <code>backend/.env</code> file:</p>
          <ul style="text-align: left; display: inline-block;">
            <li><code>GOOGLE_CLIENT_ID</code></li>
            <li><code>GOOGLE_CLIENT_SECRET</code></li>
            <li><code>GOOGLE_CALLBACK_URL</code></li>
          </ul>
          <p style="margin-top: 30px; color: #666;">
            Example: <code>GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback</code>
          </p>
        </body>
      </html>
    `);
  }
  
  try {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  } catch (error: any) {
    console.error('Passport authentication error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>OAuth Error</title></head>
        <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
          <h1 style="color: #d32f2f;">OAuth Error</h1>
          <p>${error.message || 'An error occurred during Google OAuth setup'}</p>
        </body>
      </html>
    `);
  }
});

router.get(
  '/google/callback',
  (req, res, next) => {
    // Check if Google returned an error
    if (req.query.error) {
      const errorMsg = req.query.error_description || req.query.error;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login-error?error=${encodeURIComponent(errorMsg as string)}`);
    }
    
    passport.authenticate('google', { 
      session: false, 
      failureRedirect: '/api/auth/google/error'
    })(req, res, next);
  },
  (req: any, res) => {
    try {
      if (!req.user) {
        return res.status(401).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Authentication Failed</title></head>
            <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
              <h1 style="color: #d32f2f;">Authentication Failed</h1>
              <p>Unable to authenticate with Google. Please try again.</p>
            </body>
          </html>
        `);
      }
      
      const payload = { id: req.user.id, user_name: req.user.user_name, email: req.user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/login-success?token=${token}`;
      
      res.redirect(redirectUrl);
    } catch (error: any) {
      console.error('Error in callback handler:', error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Server Error</title></head>
          <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
            <h1 style="color: #d32f2f;">Server Error</h1>
            <p>An error occurred while processing your login. Please try again.</p>
          </body>
        </html>
      `);
    }
  }
);

// Error route for OAuth failures
router.get('/google/error', (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/login-error?error=Authentication failed`);
});

// Diagnostic endpoint to check OAuth configuration
router.get('/google/config', (req, res) => {
  const config = {
    hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasCallbackUrl: !!process.env.GOOGLE_CALLBACK_URL,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'not set',
    clientIdPreview: process.env.GOOGLE_CLIENT_ID 
      ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` 
      : 'not set'
  };
  
  res.json({
    configured: config.hasClientId && config.hasClientSecret && config.hasCallbackUrl,
    ...config,
    message: config.hasClientId && config.hasClientSecret && config.hasCallbackUrl
      ? 'OAuth appears to be configured. If you see 403 errors, check Google Cloud Console.'
      : 'OAuth is not fully configured. Please set all required environment variables.'
  });
});

export default router;
