import { Router, Response } from 'express';
import { z } from 'zod';
import { Activity } from '../models';
import { auth, requireRole, AuthRequest } from '../middleware';

const router = Router();

const activitySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  category: z.enum(['club', 'volunteer', 'work', 'research', 'personal_project', 'arts', 'athletics', 'other']),
  startDate: z.string().transform(s => new Date(s)),
  endDate: z.string().transform(s => new Date(s)).optional(),
  hoursPerWeek: z.number().min(0).max(168),
  leadershipRole: z.enum(['founder', 'president', 'officer', 'member', 'none']),
  initiativeLevel: z.enum(['self-started', 'co-led', 'participant']),
  measurableOutcomes: z.string().max(1000).optional(),
  evidenceLinks: z.array(z.string().url()).max(5).optional()
});

// List activities
router.get('/', auth, requireRole('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  const activities = await Activity.find({
    userId: req.user!._id,
    isActive: true
  }).sort({ startDate: -1 });

  res.json({ activities });
});

// Get single activity
router.get('/:id', auth, requireRole('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  const activity = await Activity.findOne({
    _id: req.params.id,
    userId: req.user!._id,
    isActive: true
  });

  if (!activity) {
    res.status(404).json({ error: 'Activity not found' });
    return;
  }

  res.json({ activity });
});

// Create activity
router.post('/', auth, requireRole('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = activitySchema.parse(req.body);

    const activity = new Activity({
      ...data,
      userId: req.user!._id
    });

    await activity.save();
    res.status(201).json({ activity });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    throw error;
  }
});

// Update activity
router.put('/:id', auth, requireRole('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = activitySchema.parse(req.body);

    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id, isActive: true },
      { $set: data },
      { new: true }
    );

    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    res.json({ activity });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    throw error;
  }
});

// Delete activity (soft delete)
router.delete('/:id', auth, requireRole('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  const activity = await Activity.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!._id, isActive: true },
    { $set: { isActive: false } },
    { new: true }
  );

  if (!activity) {
    res.status(404).json({ error: 'Activity not found' });
    return;
  }

  res.json({ message: 'Activity deleted' });
});

export default router;
