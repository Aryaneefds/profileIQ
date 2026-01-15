import { Router, Response } from 'express';
import { Activity, Evaluation, CounselorNote, User } from '../models';
import { auth, requireRole, AuthRequest, evaluationRateLimiter } from '../middleware';
import { evaluate } from '../services/ai';

const router = Router();

// Trigger new evaluation
router.post('/', auth, requireRole('student'), evaluationRateLimiter, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user || !user.profile) {
      res.status(400).json({ error: 'Complete your profile before evaluation' });
      return;
    }

    const activities = await Activity.find({
      userId: user._id,
      isActive: true
    });

    if (activities.length === 0) {
      res.status(400).json({ error: 'Add at least one activity before evaluation' });
      return;
    }

    const counselorNotes = await CounselorNote.find({
      studentId: user._id
    }).sort({ createdAt: -1 });

    const result = await evaluate(user, activities, counselorNotes);

    const evaluation = new Evaluation({
      userId: user._id,
      ...result,
      counselorNoteIds: counselorNotes.map(n => n._id)
    });

    await evaluation.save();

    res.status(201).json({ evaluation });
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Evaluation failed' });
  }
});

// List all evaluations
router.get('/', auth, requireRole('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  const evaluations = await Evaluation.find({
    userId: req.user!._id
  })
    .sort({ createdAt: -1 })
    .select('scores createdAt');

  res.json({ evaluations });
});

// Get latest evaluation
router.get('/latest', auth, requireRole('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  const evaluation = await Evaluation.findOne({
    userId: req.user!._id
  }).sort({ createdAt: -1 });

  if (!evaluation) {
    res.status(404).json({ error: 'No evaluations found' });
    return;
  }

  res.json({ evaluation });
});

// Get specific evaluation
router.get('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  const evaluation = await Evaluation.findById(req.params.id);

  if (!evaluation) {
    res.status(404).json({ error: 'Evaluation not found' });
    return;
  }

  // Check access
  const isOwner = evaluation.userId.toString() === req.user!._id.toString();
  const isCounselor = req.user!.role === 'counselor' &&
    req.user!.assignedStudents?.some(id => id.toString() === evaluation.userId.toString());

  if (!isOwner && !isCounselor) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  res.json({ evaluation });
});

// Export evaluation for Common App
router.get('/:id/export', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  const evaluation = await Evaluation.findById(req.params.id);

  if (!evaluation) {
    res.status(404).json({ error: 'Evaluation not found' });
    return;
  }

  // Check access
  const isOwner = evaluation.userId.toString() === req.user!._id.toString();
  const isCounselor = req.user!.role === 'counselor' &&
    req.user!.assignedStudents?.some(id => id.toString() === evaluation.userId.toString());

  if (!isOwner && !isCounselor) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  const user = await User.findById(evaluation.userId);

  res.json({
    export: {
      studentName: user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Unknown',
      evaluationDate: evaluation.createdAt,
      profileiqScore: evaluation.scores.finalProfileiqScore,
      summary: evaluation.commonAppSummary,
      activities: evaluation.activitySnapshot,
      strengths: evaluation.strengths
    }
  });
});

export default router;
