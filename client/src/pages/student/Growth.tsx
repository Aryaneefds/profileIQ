import { useEffect } from 'react';
import { Card, CardHeader } from '../../components/ui';
import { useEvaluation } from '../../hooks/useEvaluation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function StudentGrowth() {
  const { evaluations, loading, fetchAll } = useEvaluation();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const chartData = [...evaluations]
    .reverse()
    .map((e: any) => ({
      date: new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      overall: e.scores.finalProfileiqScore,
      leadership: e.scores.leadershipImpact,
      execution: e.scores.executionDepth,
      growth: e.scores.growthTrajectory,
      context: e.scores.contextAdjustedImpact
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Growth Timeline</h1>
        <p className="text-gray-600 mt-1">Track your ProfileIQ score over time</p>
      </div>

      {evaluations.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No evaluations yet</h3>
            <p className="mt-2 text-gray-500">Complete your first evaluation to start tracking growth.</p>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader title="Overall Score Trend" />
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="overall"
                    name="ProfileIQ Score"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Score Breakdown by Dimension" />
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="leadership" name="Leadership" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                  <Line type="monotone" dataKey="execution" name="Execution" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                  <Line type="monotone" dataKey="growth" name="Growth" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                  <Line type="monotone" dataKey="context" name="Context Impact" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Evaluation History" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Overall</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Leadership</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Execution</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Growth</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Context</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluations.map((e: any) => (
                    <tr key={e._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(e.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-center font-semibold text-primary-600">{e.scores.finalProfileiqScore}</td>
                      <td className="py-3 px-4 text-center">{e.scores.leadershipImpact}</td>
                      <td className="py-3 px-4 text-center">{e.scores.executionDepth}</td>
                      <td className="py-3 px-4 text-center">{e.scores.growthTrajectory}</td>
                      <td className="py-3 px-4 text-center">{e.scores.contextAdjustedImpact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
