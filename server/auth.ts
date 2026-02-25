import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db';

const JWT_SECRET = process.env.SESSION_SECRET || (() => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET environment variable is required in production');
  }
  return 'petreunite-dev-secret';
})();
const TOKEN_EXPIRY = '30d';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  phone: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
      req.user = decoded;
    } catch {
    }
  }
  next();
}

function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export async function registerUser(req: Request, res: Response) {
  const { email, password, displayName, phone, consentPrivacy, consentTerms, consentAi, consentDataStorage } = req.body;

  if (!email || !password || !displayName) {
    return res.status(400).json({ message: 'Email, password, and display name are required' });
  }

  if (!consentPrivacy || !consentTerms || !consentAi || !consentDataStorage) {
    return res.status(400).json({ message: 'All consent checkboxes must be accepted' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, phone, consent_privacy, consent_terms, consent_ai, consent_data_storage, consent_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING id, email, display_name, phone`,
      [email.toLowerCase(), passwordHash, displayName, phone || '', consentPrivacy, consentTerms, consentAi, consentDataStorage]
    );

    const user: AuthUser = {
      id: result.rows[0].id,
      email: result.rows[0].email,
      displayName: result.rows[0].display_name,
      phone: result.rows[0].phone,
    };

    const token = generateToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Failed to create account' });
  }
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, password_hash, display_name, phone FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const row = result.rows[0];
    const validPassword = await bcrypt.compare(password, row.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user: AuthUser = {
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      phone: row.phone,
    };

    const token = generateToken(user);
    return res.json({ user, token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Failed to login' });
  }
}

export async function getMe(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, display_name, phone FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const row = result.rows[0];
    return res.json({
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      phone: row.phone,
    });
  } catch (err) {
    console.error('Get me error:', err);
    return res.status(500).json({ message: 'Failed to get user' });
  }
}
