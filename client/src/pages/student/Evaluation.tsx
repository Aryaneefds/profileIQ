import { useEffect, useState } from 'react';
import { Card, CardHeader, Button } from '../../components/ui';
import { useEvaluation } from '../../hooks/useEvaluation';
import { useActivities } from '../../hooks/useActivities';

function ScoreCard({ label, score, explanation }: { label: string; score: number; explanation: string }) {
  const getScoreColor = (s: number) => {
    if (s >= 70) return 'text-green-600';
    if (s >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <div className="text-center mb-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`text-3xl font-bold mt-1 ${getScoreColor(score)}`}>{score}</p>
      </div>
      <p className="text-sm text-gray-600">{explanation}</p>
    </Card>
  );
}

export default function StudentEvaluation() {
  const { evaluation, loading, error, fetchLatest, triggerEvaluation } = useEvaluation();
  const { activities } = useActivities();
  const [evaluating, setEvaluating] = useState(false);
  const [evalError, setEvalError] = useState('');

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  const handleEvaluate = async () => {
    setEvaluating(true);
    setEvalError('');
    try {
      await triggerEvaluation();
      await fetchLatest();
    } catch (err: any) {
      setEvalError(err.response?.data?.error || 'Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  if (loading && !evaluation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Evaluation</h1>
          <p className="text-gray-600 mt-1">AI-powered analysis of your non-academic profile</p>
        </div>
        <Button
          onClick={handleEvaluate}
          loading={evaluating}
          disabled={activities.length === 0}
        >
          {evaluation ? 'Re-evaluate' : 'Evaluate Profile'}
        </Button>
      </div>

      {evalError && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">{evalError}</div>
      )}

      {activities.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">Add at least one activity to get your ProfileIQ score.</p>
          </div>
        </Card>
      )}

      {evaluation && (
        <>
          {/* Main Score */}
          <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <div className="text-center py-4">
              <p className="text-primary-100 font-medium">ProfileIQ Score</p>
              <p className="text-6xl font-bold mt-2">{evaluation.scores.finalProfileiqScore}</p>
              <p className="text-primary-200 text-sm mt-2">
                Evaluated on {new Date(evaluation.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Card>

          {/* Dimension Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreCard
              label="Leadership Impact"
              score={evaluation.scores.leadershipImpact}
              explanation={evaluation.scoreExplanations.leadershipImpact}
            />
            <ScoreCard
              label="Execution Depth"
              score={evaluation.scores.executionDepth}
              explanation={evaluation.scoreExplanations.executionDepth}
            />
            <ScoreCard
              label="Growth Trajectory"
              score={evaluation.scores.growthTrajectory}
              explanation={evaluation.scoreExplanations.growthTrajectory}
            />
            <ScoreCard
              label="Context-Adjusted Impact"
              score={evaluation.scores.contextAdjustedImpact}
              explanation={evaluation.scoreExplanations.contextAdjustedImpact}
            />
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Strengths" />
              <ul className="space-y-2">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{s}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardHeader title="Areas for Improvement" />
              <ul className="space-y-2">
                {evaluation.improvementAreas.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{a}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Guidance Recommendations */}
          <Card>
            <CardHeader title="Personalized Recommendations" />
            <div className="space-y-4">
              {evaluation.guidanceRecommendations.map((rec, i) => (
                <div key={i} className="border-l-4 border-primary-500 pl-4 py-2">
                  <p className="font-medium text-gray-900">{rec.area}</p>
                  <p className="text-gray-600 mt-1">{rec.suggestion}</p>
                  <p className="text-sm text-primary-600 mt-2">
                    Expected impact: {rec.expectedScoreImpact}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Common App Summary */}
          <Card>
            <CardHeader title="Common App Summary" subtitle="Ready to use in your applications" />
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              {evaluation.commonAppSummary.map((s, i) => (
                <p key={i} className="text-gray-700">{s}</p>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
