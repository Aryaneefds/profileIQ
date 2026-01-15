import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, Input, Button } from '../../components/ui';
import api from '../../services/api';
import { CounselorStudent } from '../../types';

export default function CounselorStudents() {
  const [students, setStudents] = useState<CounselorStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [assignEmail, setAssignEmail] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');

  useEffect(() => {
    api.get('/counselors/students')
      .then(res => setStudents(res.data.students))
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.profile?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    s.profile?.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssigning(true);
    setAssignError('');

    try {
      // First find user by email, then assign
      const userRes = await api.get(`/auth/me`); // This is just for demo - in production you'd need a search endpoint
      // For now, we'll just show the UI - actual assignment would need an admin endpoint
      setAssignEmail('');
      setAssignError('Student assignment requires admin access');
    } catch (err: any) {
      setAssignError(err.response?.data?.error || 'Failed to assign student');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage and review your assigned students</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search students by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Student List */}
      {filteredStudents.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No students found</h3>
            <p className="mt-2 text-gray-500">
              {search ? 'Try adjusting your search.' : 'No students have been assigned to you yet.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredStudents.map(student => (
            <Card key={student.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-lg">
                      {student.profile?.firstName?.[0]}{student.profile?.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {student.profile?.firstName} {student.profile?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-400">
                      <span>Grade {student.profile?.gradeLevel}</span>
                      <span>{student.profile?.schoolType}</span>
                      <span>{student.profile?.geographicContext}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {student.latestScore ?? '--'}
                    </p>
                    <p className="text-xs text-gray-500">ProfileIQ</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700">{student.activityCount}</p>
                    <p className="text-xs text-gray-500">Activities</p>
                  </div>
                  <Link to={`/counselor/students/${student.id}`}>
                    <Button variant="secondary" size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
