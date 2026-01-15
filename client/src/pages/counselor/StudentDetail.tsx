import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, Button, Textarea, Select, Modal } from '../../components/ui';
import api from '../../services/api';
import { Activity, Evaluation, CounselorNote, UserProfile } from '../../types';

interface StudentDetail {
  student: {
    id: string;
    email: string;
    profile: UserProfile;
  };
  activities: Activity[];
  evaluations: Evaluation[];
  notes: CounselorNote[];
}

const categoryLabels: Record<string, string> = {
  general: 'General',
  strength: 'Strength',
  concern: 'Concern',
  recommendation: 'Recommendation'
};

export default function CounselorStudentDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'activities' | 'evaluations' | 'notes'>('activities');
  const [noteModal, setNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({ content: '', category: 'general' });
  const [saving, setSaving] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [exportData, setExportData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api.get(`/counselors/students/${id}`)
        .then(res => setData(res.data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post(`/counselors/students/${id}/notes`, noteForm);
      setData(prev => prev ? { ...prev, notes: [res.data.note, ...prev.notes] } : null);
      setNoteModal(false);
      setNoteForm({ content: '', category: 'general' });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (evaluationId: string) => {
    const res = await api.get(`/evaluations/${evaluationId}/export`);
    setExportData(res.data.export);
    setExportModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-8">Student not found</p>
      </Card>
    );
  }

  const { student, activities, evaluations, notes } = data;
  const latestEval = evaluations[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/counselor/students" className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {student.profile?.firstName} {student.profile?.lastName}
            </h1>
            <p className="text-gray-500">{student.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setNoteModal(true)}>Add Note</Button>
          {latestEval && (
            <Button onClick={() => handleExport(latestEval._id)}>Export Summary</Button>
          )}
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">ProfileIQ Score</p>
            <p className="text-3xl font-bold text-primary-600 mt-1">
              {latestEval?.scores.finalProfileiqScore ?? '--'}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Activities</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{activities.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Evaluations</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{evaluations.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{notes.length}</p>
          </div>
        </Card>
      </div>

      {/* Student Context */}
      <Card>
        <CardHeader title="Student Context" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Grade Level</p>
            <p className="font-medium">{student.profile?.gradeLevel || '--'}</p>
          </div>
          <div>
            <p className="text-gray-500">School Type</p>
            <p className="font-medium capitalize">{student.profile?.schoolType || '--'}</p>
          </div>
          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-medium capitalize">{student.profile?.geographicContext || '--'}</p>
          </div>
          <div>
            <p className="text-gray-500">Constraints</p>
            <p className="font-medium">{student.profile?.resourceConstraints || 'None specified'}</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {(['activities', 'evaluations', 'notes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          {activities.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-8">No activities yet</p>
            </Card>
          ) : (
            activities.map(activity => (
              <Card key={activity._id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <span>{activity.category}</span>
                      <span>{activity.leadershipRole}</span>
                      <span>{activity.hoursPerWeek} hrs/week</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activity.initiativeLevel === 'self-started'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {activity.initiativeLevel}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'evaluations' && (
        <div className="space-y-4">
          {evaluations.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-8">No evaluations yet</p>
            </Card>
          ) : (
            evaluations.map(evaluation => (
              <Card key={evaluation._id}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">
                      {evaluation.scores.finalProfileiqScore}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(evaluation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => handleExport(evaluation._id)}>
                    Export
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <p className="text-gray-500">Leadership</p>
                    <p className="font-semibold">{evaluation.scores.leadershipImpact}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Execution</p>
                    <p className="font-semibold">{evaluation.scores.executionDepth}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Growth</p>
                    <p className="font-semibold">{evaluation.scores.growthTrajectory}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Context</p>
                    <p className="font-semibold">{evaluation.scores.contextAdjustedImpact}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setNoteModal(true)}>Add Note</Button>
          </div>
          {notes.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-8">No notes yet</p>
            </Card>
          ) : (
            notes.map(note => (
              <Card key={note._id}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      note.category === 'strength' ? 'bg-green-100 text-green-700' :
                      note.category === 'concern' ? 'bg-red-100 text-red-700' :
                      note.category === 'recommendation' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {categoryLabels[note.category]}
                    </span>
                    <p className="mt-2 text-gray-700">{note.content}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Add Note Modal */}
      <Modal isOpen={noteModal} onClose={() => setNoteModal(false)} title="Add Note">
        <form onSubmit={handleAddNote} className="space-y-4">
          <Select
            label="Category"
            value={noteForm.category}
            onChange={e => setNoteForm(prev => ({ ...prev, category: e.target.value }))}
            options={[
              { value: 'general', label: 'General' },
              { value: 'strength', label: 'Strength' },
              { value: 'concern', label: 'Concern' },
              { value: 'recommendation', label: 'Recommendation' }
            ]}
          />
          <Textarea
            label="Note"
            value={noteForm.content}
            onChange={e => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
            rows={4}
            required
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setNoteModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Add Note</Button>
          </div>
        </form>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={exportModal} onClose={() => setExportModal(false)} title="Common App Export" size="lg">
        {exportData && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold">{exportData.studentName}</p>
              <p className="text-sm text-gray-500">ProfileIQ Score: {exportData.profileiqScore}</p>
              <p className="text-sm text-gray-500">
                Evaluated: {new Date(exportData.evaluationDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <div className="bg-white border rounded-lg p-4 space-y-2">
                {exportData.summary.map((s: string, i: number) => (
                  <p key={i} className="text-gray-700">{s}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Strengths</h4>
              <ul className="list-disc list-inside text-gray-700">
                {exportData.strengths.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => {
                navigator.clipboard.writeText(exportData.summary.join('\n\n'));
                alert('Summary copied to clipboard!');
              }}>
                Copy Summary
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
