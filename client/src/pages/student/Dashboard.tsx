import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { StudentSummary, Activity } from '../../types';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<StudentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students/me/summary')
      .then(res => setSummary(res.data.summary))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.profile?.firstName || 'Student'}
        </h1>
        <p className="text-gray-600 mt-1">Track your activities and build your profile</p>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">ProfileIQ Score</p>
            <p className="text-4xl font-bold text-primary-600 mt-2">
              {summary?.latestScore ?? '--'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {summary?.evaluationCount || 0} evaluations
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Activities</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              {summary?.activityCount ?? 0}
            </p>
            <Link to="/student/activities" className="text-xs text-primary-600 hover:underline mt-1 inline-block">
              Manage activities
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Last Evaluation</p>
            <p className="text-lg font-medium text-gray-900 mt-2">
              {summary?.lastEvaluationDate
                ? new Date(summary.lastEvaluationDate).toLocaleDateString()
                : 'Not yet'}
            </p>
            <Link to="/student/evaluation" className="text-xs text-primary-600 hover:underline mt-1 inline-block">
              View evaluation
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader title="Quick Actions" />
        <div className="flex flex-wrap gap-3">
          <Link to="/student/activities">
            <Button>Add Activity</Button>
          </Link>
          <Link to="/student/evaluation">
            <Button variant="secondary">Evaluate Profile</Button>
          </Link>
          <Link to="/student/growth">
            <Button variant="secondary">View Growth</Button>
          </Link>
        </div>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader
          title="Recent Activities"
          action={
            <Link to="/student/activities" className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          }
        />
        {summary?.recentActivities?.length ? (
          <div className="space-y-3">
            {summary.recentActivities.map((activity: Activity) => (
              <div key={activity._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">
                    {activity.category} - {activity.hoursPerWeek} hrs/week
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activity.leadershipRole === 'founder' || activity.leadershipRole === 'president'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {activity.leadershipRole}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No activities yet. <Link to="/student/activities" className="text-primary-600 hover:underline">Add your first activity</Link>
          </p>
        )}
      </Card>
    </div>
  );
}
