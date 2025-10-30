import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from './db';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!
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
    return done(err, null);
  }
}));

export default passport;
