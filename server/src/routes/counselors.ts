import { Router, Response } from 'express';
import { z } from 'zod';
import { User, Activity, Evaluation, CounselorNote } from '../models';
import { auth, requireRole, AuthRequest } from '../middleware';

const router = Router();

const noteSchema = z.object({
  content: z.string().min(1).max(2000),
  category: z.enum(['general', 'strength', 'concern', 'recommendation'])
});

// List assigned students
router.get('/students', auth, requireRole('counselor'), async (req: AuthRequest, res: Response): Promise<void> => {
  const counselor = await User.findById(req.user!._id).populate({
    path: 'assignedStudents',
    select: 'email profile createdAt'
  });

  if (!counselor) {
    res.status(404).json({ error: 'Counselor not found' });
    return;
  }

  // Get latest evaluation for each student
  const studentsWithScores = await Promise.all(
    (counselor.assignedStudents || []).map(async (student: any) => {
      const latestEval = await Evaluation.findOne({ userId: student._id })
        .sort({ createdAt: -1 })
        .select('scores.finalProfileiqScore createdAt');

      const activityCount = await Activity.countDocuments({
        userId: student._id,
        isActive: true
      });

      return {
        id: student._id,
        email: student.email,
        profile: student.profile,
        activityCount,
        latestScore: latestEval?.scores.finalProfileiqScore ?? null,
        lastEvaluationDate: latestEval?.createdAt ?? null
      };
    })
  );

  res.json({ students: studentsWithScores });
});

// Get student detail
router.get('/students/:id', auth, requireRole('counselor'), async (req: AuthRequest, res: Response): Promise<void> => {
  // Verify counselor has access to this student
  const counselor = await User.findById(req.user!._id);
  if (!counselor?.assignedStudents?.some(id => id.toString() === req.params.id)) {
    res.status(403).json({ error: 'Not assigned to this student' });
    return;
  }

  const student = await User.findById(req.params.id).select('-passwordHash');
  if (!student) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  const [activities, evaluations, notes] = await Promise.all([
    Activity.find({ userId: student._id, isActive: true }).sort({ startDate: -1 }),
    Evaluation.find({ userId: student._id }).sort({ createdAt: -1 }),
    CounselorNote.find({ studentId: student._id }).sort({ createdAt: -1 })
  ]);

  res.json({
    student: {
      id: student._id,
      email: student.email,
      profile: student.profile
    },
    activities,
    evaluations,
    notes
  });
});

// Add counselor note
router.post('/students/:id/notes', auth, requireRole('counselor'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verify counselor has access to this student
    const counselor = await User.findById(req.user!._id);
    if (!counselor?.assignedStudents?.some(id => id.toString() === req.params.id)) {
      res.status(403).json({ error: 'Not assigned to this student' });
      return;
    }

    const data = noteSchema.parse(req.body);

    const note = new CounselorNote({
      counselorId: req.user!._id,
      studentId: req.params.id,
      ...data
    });

    await note.save();
    res.status(201).json({ note });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    throw error;
  }
});

// Update counselor note
router.put('/notes/:noteId', auth, requireRole('counselor'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = noteSchema.parse(req.body);

    const note = await CounselorNote.findOneAndUpdate(
      { _id: req.params.noteId, counselorId: req.user!._id },
      { $set: data },
      { new: true }
    );

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.json({ note });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    throw error;
  }
});

// Delete counselor note
router.delete('/notes/:noteId', auth, requireRole('counselor'), async (req: AuthRequest, res: Response): Promise<void> => {
  const note = await CounselorNote.findOneAndDelete({
    _id: req.params.noteId,
    counselorId: req.user!._id
  });

  if (!note) {
    res.status(404).json({ error: 'Note not found' });
    return;
  }

  res.json({ message: 'Note deleted' });
});

// Assign student to counselor (admin functionality)
router.post('/students/:id/assign', auth, requireRole('counselor'), async (req: AuthRequest, res: Response): Promise<void> => {
  const student = await User.findOne({ _id: req.params.id, role: 'student' });
  if (!student) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  // Add student to counselor's list
  await User.findByIdAndUpdate(req.user!._id, {
    $addToSet: { assignedStudents: student._id }
  });

  // Set counselor on student
  await User.findByIdAndUpdate(student._id, {
    $set: { assignedCounselor: req.user!._id }
  });

  res.json({ message: 'Student assigned' });
});

export default router;
