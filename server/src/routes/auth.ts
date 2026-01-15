import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models';
import { auth, AuthRequest, authRateLimiter } from '../middleware';

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['student', 'counselor']),
  profile: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    gradeLevel: z.string().optional(),
    schoolType: z.string().optional(),
    geographicContext: z.string().optional(),
    resourceConstraints: z.string().optional()
  }).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Signup
router.post('/signup', authRateLimiter, async (req, res: Response): Promise<void> => {
  try {
    const data = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = new User({
      email: data.email,
      passwordHash,
      role: data.role,
      profile: data.role === 'student' ? {
        firstName: data.profile?.firstName || '',
        lastName: data.profile?.lastName || '',
        gradeLevel: data.profile?.gradeLevel || '12',
        schoolType: data.profile?.schoolType || 'public',
        geographicContext: data.profile?.geographicContext || 'urban',
        resourceConstraints: data.profile?.resourceConstraints
      } : undefined
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    throw error;
  }
});

// Login
router.post('/login', authRateLimiter, async (req, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    throw error;
  }
});

// Get current user
router.get('/me', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({
    user: {
      id: req.user!._id,
      email: req.user!.email,
      role: req.user!.role,
      profile: req.user!.profile
    }
  });
});

export default router;
