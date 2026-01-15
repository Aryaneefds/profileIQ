import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Activity } from '../types';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/activities');
      setActivities(res.data.activities);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const createActivity = async (data: Partial<Activity>) => {
    const res = await api.post('/activities', data);
    setActivities(prev => [res.data.activity, ...prev]);
    return res.data.activity;
  };

  const updateActivity = async (id: string, data: Partial<Activity>) => {
    const res = await api.put(`/activities/${id}`, data);
    setActivities(prev => prev.map(a => a._id === id ? res.data.activity : a));
    return res.data.activity;
  };

  const deleteActivity = async (id: string) => {
    await api.delete(`/activities/${id}`);
    setActivities(prev => prev.filter(a => a._id !== id));
  };

  return {
    activities,
    loading,
    error,
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity
  };
}
