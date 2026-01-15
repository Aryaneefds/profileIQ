import { useState } from 'react';
import { Card, Button, Modal, Input, Select, Textarea } from '../../components/ui';
import { useActivities } from '../../hooks/useActivities';
import { Activity } from '../../types';

const categoryOptions = [
  { value: 'club', label: 'Club / Organization' },
  { value: 'volunteer', label: 'Volunteer / Community Service' },
  { value: 'work', label: 'Work / Internship' },
  { value: 'research', label: 'Research' },
  { value: 'personal_project', label: 'Personal Project' },
  { value: 'arts', label: 'Arts / Music' },
  { value: 'athletics', label: 'Athletics / Sports' },
  { value: 'other', label: 'Other' }
];

const leadershipOptions = [
  { value: 'founder', label: 'Founder' },
  { value: 'president', label: 'President / Lead' },
  { value: 'officer', label: 'Officer / Coordinator' },
  { value: 'member', label: 'Member' },
  { value: 'none', label: 'No formal role' }
];

const initiativeOptions = [
  { value: 'self-started', label: 'Self-started' },
  { value: 'co-led', label: 'Co-led / Co-founded' },
  { value: 'participant', label: 'Participant' }
];

const emptyForm = {
  title: '',
  description: '',
  category: 'club',
  startDate: '',
  endDate: '',
  hoursPerWeek: 5,
  leadershipRole: 'member',
  initiativeLevel: 'participant' as 'self-started' | 'co-led' | 'participant',
  measurableOutcomes: ''
};

export default function StudentActivities() {
  const { activities, loading, createActivity, updateActivity, deleteActivity } = useActivities();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'hoursPerWeek' ? Number(value) : value
    }));
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (activity: Activity) => {
    setForm({
      title: activity.title,
      description: activity.description,
      category: activity.category,
      startDate: activity.startDate.split('T')[0],
      endDate: activity.endDate ? activity.endDate.split('T')[0] : '',
      hoursPerWeek: activity.hoursPerWeek,
      leadershipRole: activity.leadershipRole,
      initiativeLevel: activity.initiativeLevel as 'self-started' | 'co-led' | 'participant',
      measurableOutcomes: activity.measurableOutcomes || ''
    });
    setEditingId(activity._id);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const data = {
        ...form,
        endDate: form.endDate || undefined
      };

      if (editingId) {
        await updateActivity(editingId, data);
      } else {
        await createActivity(data);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error?.[0]?.message || 'Failed to save activity');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      await deleteActivity(id);
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
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-1">Manage your extracurricular activities</p>
        </div>
        <Button onClick={openCreate}>Add Activity</Button>
      </div>

      {activities.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No activities yet</h3>
            <p className="mt-2 text-gray-500">Add your extracurricular activities to get your ProfileIQ score.</p>
            <Button onClick={openCreate} className="mt-4">Add Your First Activity</Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activities.map(activity => (
            <Card key={activity._id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                      {categoryOptions.find(c => c.value === activity.category)?.label || activity.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{activity.description}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                    <span>
                      <strong>Role:</strong> {leadershipOptions.find(l => l.value === activity.leadershipRole)?.label}
                    </span>
                    <span>
                      <strong>Initiative:</strong> {initiativeOptions.find(i => i.value === activity.initiativeLevel)?.label}
                    </span>
                    <span>
                      <strong>Hours:</strong> {activity.hoursPerWeek}/week
                    </span>
                    <span>
                      <strong>Duration:</strong> {new Date(activity.startDate).toLocaleDateString()} - {activity.endDate ? new Date(activity.endDate).toLocaleDateString() : 'Present'}
                    </span>
                  </div>
                  {activity.measurableOutcomes && (
                    <p className="text-sm text-gray-600 mt-3">
                      <strong>Outcomes:</strong> {activity.measurableOutcomes}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(activity)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(activity._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Activity' : 'Add Activity'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <Input label="Activity Title" name="title" value={form.title} onChange={handleChange} placeholder="e.g., Robotics Club President" required />

          <Textarea label="Description" name="description" value={form.description} onChange={handleChange} placeholder="What do you do? What have you achieved?" rows={3} required />

          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" name="category" value={form.category} onChange={handleChange} options={categoryOptions} />
            <Select label="Leadership Role" name="leadershipRole" value={form.leadershipRole} onChange={handleChange} options={leadershipOptions} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Initiative Level" name="initiativeLevel" value={form.initiativeLevel} onChange={handleChange} options={initiativeOptions} />
            <Input type="number" label="Hours per Week" name="hoursPerWeek" value={form.hoursPerWeek} onChange={handleChange} min={0} max={168} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input type="date" label="Start Date" name="startDate" value={form.startDate} onChange={handleChange} required />
            <Input type="date" label="End Date (optional)" name="endDate" value={form.endDate} onChange={handleChange} />
          </div>

          <Textarea label="Measurable Outcomes (optional)" name="measurableOutcomes" value={form.measurableOutcomes} onChange={handleChange} placeholder="e.g., Increased club membership by 50%, Won regional competition" rows={2} />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingId ? 'Save Changes' : 'Add Activity'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
