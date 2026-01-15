import { IActivity, IUserProfile, ICounselorNote } from '../../models';

interface AIPayload {
  student_context: {
    grade_level: string;
    school_type: string;
    geographic_context: string;
    resource_constraints: string;
  };
  activities: {
    title: string;
    description: string;
    duration_months: number;
    hours_per_week: number;
    leadership_role: string;
    initiative_level: string;
    measurable_outcomes: string;
    evidence_links: string[];
  }[];
  counselor_notes: string | null;
}

function calculateDurationMonths(startDate: Date, endDate?: Date): number {
  const end = endDate || new Date();
  const diffMs = end.getTime() - startDate.getTime();
  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24 * 30)));
}

export function buildPayload(
  profile: IUserProfile,
  activities: IActivity[],
  counselorNotes: ICounselorNote[]
): AIPayload {
  return {
    student_context: {
      grade_level: profile.gradeLevel,
      school_type: profile.schoolType,
      geographic_context: profile.geographicContext,
      resource_constraints: profile.resourceConstraints || 'None specified'
    },
    activities: activities.map(a => ({
      title: a.title,
      description: a.description,
      duration_months: calculateDurationMonths(a.startDate, a.endDate),
      hours_per_week: a.hoursPerWeek,
      leadership_role: a.leadershipRole,
      initiative_level: a.initiativeLevel,
      measurable_outcomes: a.measurableOutcomes || 'Not specified',
      evidence_links: a.evidenceLinks || []
    })),
    counselor_notes: counselorNotes.length > 0
      ? counselorNotes.map(n => `[${n.category}] ${n.content}`).join('\n')
      : null
  };
}
