import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export default {
  Query: {
    users: async () => {
      const [rows]: any = await pool.query('SELECT * FROM users');
      return rows;
    },
    user: async (_: any, { id }: { id: number }) => {
      const [rows]: any = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0] || null;
    },
  },
  Mutation: {
    register: async (_: any, { user_name, email, password }: any) => {
      if (!user_name || !password) throw new Error('Username and password required');
      try {
        const hashed = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)', [user_name, email, hashed]);
        return 'User registered successfully';
      } catch (err: any) {
        if (err.code === 'ER_DUP_ENTRY') throw new Error('Username or email already exists');
        throw err;
      }
    },
    login: async (_: any, { user_name, password }: any) => {
      if (!user_name || !password) throw new Error('Username and password required');
      const [rows]: any = await pool.query('SELECT * FROM users WHERE user_name = ?', [user_name]);
      const user = rows[0];
      if (!user) throw new Error('Invalid credentials');
      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error('Invalid credentials');
      return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    }
  }
};
