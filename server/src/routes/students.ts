import { Router, Response } from 'express';
import { z } from 'zod';
import { User, Activity, Evaluation } from '../models';
import { auth, requireRole, AuthRequest } from '../middleware';

const router = Router();

const profileUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  gradeLevel: z.string().optional(),
  schoolType: z.string().optional(),
  schoolName: z.string().optional(),
  geographicContext: z.string().optional(),
  resourceConstraints: z.string().optional()
});

// Get own profile
router.get('/me', auth, requireRole('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({
    profile: req.user!.profile
  });
});

// Update own profile
router.put('/me', auth, requireRole('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = profileUpdateSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      {
        $set: {
          'profile.firstName': data.firstName ?? req.user!.profile?.firstName,
          'profile.lastName': data.lastName ?? req.user!.profile?.lastName,
          'profile.gradeLevel': data.gradeLevel ?? req.user!.profile?.gradeLevel,
          'profile.schoolType': data.schoolType ?? req.user!.profile?.schoolType,
          'profile.schoolName': data.schoolName ?? req.user!.profile?.schoolName,
          'profile.geographicContext': data.geographicContext ?? req.user!.profile?.geographicContext,
          'profile.resourceConstraints': data.resourceConstraints ?? req.user!.profile?.resourceConstraints
        }
      },
      { new: true }
    );

    res.json({ profile: user?.profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    throw error;
  }
});

// Get dashboard summary
router.get('/me/summary', auth, requireRole('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  const [activities, latestEvaluation, evaluationCount] = await Promise.all([
    Activity.find({ userId: req.user!._id, isActive: true }).sort({ startDate: -1 }).limit(5),
    Evaluation.findOne({ userId: req.user!._id }).sort({ createdAt: -1 }),
    Evaluation.countDocuments({ userId: req.user!._id })
  ]);

  res.json({
    summary: {
      profile: req.user!.profile,
      activityCount: await Activity.countDocuments({ userId: req.user!._id, isActive: true }),
      recentActivities: activities,
      latestScore: latestEvaluation?.scores.finalProfileiqScore ?? null,
      evaluationCount,
      lastEvaluationDate: latestEvaluation?.createdAt ?? null
    }
  });
});

export default router;
