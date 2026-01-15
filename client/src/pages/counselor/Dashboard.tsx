import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { CounselorStudent } from '../../types';

export default function CounselorDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<CounselorStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/counselors/students')
      .then(res => setStudents(res.data.students))
      .finally(() => setLoading(false));
  }, []);

  const averageScore = students.length > 0
    ? Math.round(students.filter(s => s.latestScore).reduce((sum, s) => sum + (s.latestScore || 0), 0) / students.filter(s => s.latestScore).length)
    : null;

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
        <h1 className="text-2xl font-bold text-gray-900">Counselor Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.profile?.firstName || 'Counselor'}</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <p className="text-4xl font-bold text-primary-600 mt-2">{students.length}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Evaluated</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              {students.filter(s => s.latestScore !== null).length}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Average Score</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {averageScore ?? '--'}
            </p>
          </div>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader
          title="Your Students"
          action={
            <Link to="/counselor/students" className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          }
        />
        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No students assigned yet. Students can be assigned from the admin panel.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Student</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Activities</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Score</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Last Eval</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map(student => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.profile?.firstName} {student.profile?.lastName}
                        </p>
                        <p className="text-gray-500 text-xs">{student.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">{student.activityCount}</td>
                    <td className="py-3 px-4 text-center">
                      {student.latestScore !== null ? (
                        <span className="font-semibold text-primary-600">{student.latestScore}</span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-500">
                      {student.lastEvaluationDate
                        ? new Date(student.lastEvaluationDate).toLocaleDateString()
                        : '--'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/counselor/students/${student.id}`}
                        className="text-primary-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
