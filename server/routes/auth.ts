import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, User, Session } from '../db/database.js';
import { verifyPassword } from '../utils/password.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const SESSION_DURATION_DAYS = 7;

/**
 * Email validation regex - RFC 5322 compliant basic pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }

    // Sanitize email input
    const sanitizedEmail = email.trim().toLowerCase();

    // Validate email format
    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Find user by email
    const user = db
      .prepare<[string], User>('SELECT * FROM users WHERE email = ?')
      .get(sanitizedEmail);

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Create session
    const sessionId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

    db.prepare(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
    ).run(sessionId, user.id, expiresAt.toISOString());

    // Set httpOnly cookie
    res.cookie('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Return user info (without password hash)
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: !!user.is_admin,
        hasSeenReveal: !!user.has_seen_reveal,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/logout
 * Logout and clear session
 */
router.post('/logout', async (req, res) => {
  try {
    const sessionId = req.cookies.session_id;

    if (sessionId) {
      // Delete session from database
      db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    }

    // Clear cookie
    res.clearCookie('session_id');

    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = req.user!;

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: !!user.is_admin,
        hasSeenReveal: !!user.has_seen_reveal,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
