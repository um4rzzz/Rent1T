import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from './db';

// Only initialize Google strategy if all required env vars are present
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
    try {
      const [rows]: any = await pool.query('SELECT * FROM users WHERE google_id = ?', [profile.id]);
      let user;
      if (rows.length > 0) {
        user = rows[0];
      } else {
        const user_name = profile.displayName;
        const email = profile.emails?.[0]?.value || null;
        const [result]: any = await pool.query(
          'INSERT INTO users (google_id, user_name, email, role) VALUES (?, ?, ?, ?)',
          [profile.id, user_name, email, 'tenant']
        );
        user = { id: result.insertId, google_id: profile.id, user_name, email };
      }
      return done(null, user);
    } catch (err) {
      console.error('Database error during Google OAuth:', err);
      return done(err, null);
    }
  }));
} else {
  console.warn('Google OAuth strategy not initialized. Missing environment variables.');
  console.warn('Required: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL');
}

export default passport;
