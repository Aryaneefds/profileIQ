import { useState, useEffect } from 'react';
import { Card, CardHeader, Button, Input, Select } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export default function StudentProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gradeLevel: '12',
    schoolType: 'public',
    schoolName: '',
    geographicContext: 'urban',
    resourceConstraints: ''
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setForm({
        firstName: user.profile.firstName || '',
        lastName: user.profile.lastName || '',
        gradeLevel: user.profile.gradeLevel || '12',
        schoolType: user.profile.schoolType || 'public',
        schoolName: user.profile.schoolName || '',
        geographicContext: user.profile.geographicContext || 'urban',
        resourceConstraints: user.profile.resourceConstraints || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/students/me', form);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Update your profile information for accurate evaluations</p>
      </div>

      <Card>
        <CardHeader title="Personal Information" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Email"
            value={user?.email || ''}
            disabled
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Grade Level"
              name="gradeLevel"
              value={form.gradeLevel}
              onChange={handleChange}
              options={[
                { value: '9', label: '9th Grade' },
                { value: '10', label: '10th Grade' },
                { value: '11', label: '11th Grade' },
                { value: '12', label: '12th Grade' },
                { value: 'gap_year', label: 'Gap Year' }
              ]}
            />
            <Select
              label="School Type"
              name="schoolType"
              value={form.schoolType}
              onChange={handleChange}
              options={[
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' },
                { value: 'charter', label: 'Charter' },
                { value: 'homeschool', label: 'Homeschool' }
              ]}
            />
          </div>

          <Input
            label="School Name (optional)"
            name="schoolName"
            value={form.schoolName}
            onChange={handleChange}
            placeholder="e.g., Lincoln High School"
          />

          <Select
            label="Geographic Context"
            name="geographicContext"
            value={form.geographicContext}
            onChange={handleChange}
            options={[
              { value: 'urban', label: 'Urban' },
              { value: 'suburban', label: 'Suburban' },
              { value: 'rural', label: 'Rural' }
            ]}
          />

          <Input
            label="Resource Constraints (optional)"
            name="resourceConstraints"
            value={form.resourceConstraints}
            onChange={handleChange}
            placeholder="e.g., Limited access to extracurricular funding, First-generation student"
          />

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" loading={saving}>Save Changes</Button>
            {saved && (
              <span className="text-green-600 text-sm">Changes saved successfully</span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
