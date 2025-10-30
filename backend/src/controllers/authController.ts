import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function register(req: Request, res: Response) {
  const { user_name, email, password } = req.body;
  if (!user_name || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)',
      [user_name, email, hashed]
    );
    return res.json({ message: 'User registered successfully' });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Username or email already exists' });
    return res.status(500).json({ error: 'Registration failed', details: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const { user_name, password } = req.body;
  if (!user_name || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE user_name = ?', [user_name]);
    const user = rows[0];
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch (err: any) {
    return res.status(500).json({ error: 'Login failed', details: err.message });
  }
}

export async function listUsers(_req: Request, res: Response) {
  try {
    const [rows]: any = await pool.query('SELECT id, user_name, email, role FROM users');
    return res.json(rows);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
}
