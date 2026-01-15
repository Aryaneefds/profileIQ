import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Select, Card } from '../../components/ui';
import { Navbar } from '../../components/layout';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'counselor',
    firstName: '',
    lastName: '',
    gradeLevel: '12',
    schoolType: 'public',
    geographicContext: 'urban'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profile: formData.role === 'student' ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gradeLevel: formData.gradeLevel,
          schoolType: formData.schoolType,
          geographicContext: formData.geographicContext
        } : {
          firstName: formData.firstName,
          lastName: formData.lastName
        }
      });
      navigate(formData.role === 'counselor' ? '/counselor' : '/student');
    } catch (err: any) {
      const errorData = err.response?.data?.error;
      if (Array.isArray(errorData)) {
        setError(errorData.map((e: any) => e.message).join(', '));
      } else if (typeof errorData === 'string') {
        setError(errorData);
      } else {
        setError('Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-600 mt-2">Start quantifying your non-academic profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Select
              label="I am a..."
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'counselor', label: 'Counselor' }
              ]}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <Input
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />

            {formData.role === 'student' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Grade Level"
                    name="gradeLevel"
                    value={formData.gradeLevel}
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
                    value={formData.schoolType}
                    onChange={handleChange}
                    options={[
                      { value: 'public', label: 'Public' },
                      { value: 'private', label: 'Private' },
                      { value: 'charter', label: 'Charter' },
                      { value: 'homeschool', label: 'Homeschool' }
                    ]}
                  />
                </div>

                <Select
                  label="Geographic Context"
                  name="geographicContext"
                  value={formData.geographicContext}
                  onChange={handleChange}
                  options={[
                    { value: 'urban', label: 'Urban' },
                    { value: 'suburban', label: 'Suburban' },
                    { value: 'rural', label: 'Rural' }
                  ]}
                />
              </>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
