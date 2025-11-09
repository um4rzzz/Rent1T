import express, { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router: Router = express.Router();

// STEP 1: Redirect user to Google for consent
// ✅ REQUIRED: scope parameter must be included
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email']   // ✅ REQUIRED - this fixes the "Missing required parameter: scope" error
  })
);

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
