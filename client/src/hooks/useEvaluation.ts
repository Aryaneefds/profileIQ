import { useState, useCallback } from 'react';
import api from '../services/api';
import { Evaluation } from '../types';

export function useEvaluation() {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLatest = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/evaluations/latest');
      setEvaluation(res.data.evaluation);
      setError(null);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.error || 'Failed to load evaluation');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/evaluations');
      setEvaluations(res.data.evaluations);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load evaluations');
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerEvaluation = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/evaluations');
      setEvaluation(res.data.evaluation);
      return res.data.evaluation;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Evaluation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchById = async (id: string) => {
    const res = await api.get(`/evaluations/${id}`);
    return res.data.evaluation;
  };

  const exportEvaluation = async (id: string) => {
    const res = await api.get(`/evaluations/${id}/export`);
    return res.data.export;
  };

  return {
    evaluation,
    evaluations,
    loading,
    error,
    fetchLatest,
    fetchAll,
    fetchById,
    triggerEvaluation,
    exportEvaluation
  };
}
