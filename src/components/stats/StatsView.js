import React, { useEffect, useState } from 'react';
import { apiStats } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StatsView() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await apiStats.get();
        setStats(data || {});
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const progress = stats?.progress || { labels: [], data: [] };

  const chartData = {
    labels: progress.labels,
    datasets: [
      {
        label: 'Words Learned',
        data: progress.data,
        borderColor: 'rgba(59,130,246,1)',
        backgroundColor: 'rgba(59,130,246,0.15)',
        fill: true,
        tension: 0.25,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Statistics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded shadow p-4 border h-80">
          <h3 className="font-semibold mb-2">Progress Over Time</h3>
          {progress.labels.length ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="text-gray-500">No progress data.</div>
          )}
        </div>
        <div className="bg-white rounded shadow p-4 border space-y-3">
          <h3 className="font-semibold mb-2">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded bg-blue-50">
              <div className="text-sm text-gray-600">Total Lists</div>
              <div className="text-2xl font-bold">
                {stats?.totals?.lists ?? '-'}
              </div>
            </div>
            <div className="p-3 rounded bg-green-50">
              <div className="text-sm text-gray-600">Total Words</div>
              <div className="text-2xl font-bold">
                {stats?.totals?.words ?? '-'}
              </div>
            </div>
            <div className="p-3 rounded bg-yellow-50">
              <div className="text-sm text-gray-600">Due Today</div>
              <div className="text-2xl font-bold">
                {stats?.totals?.due_today ?? '-'}
              </div>
            </div>
            <div className="p-3 rounded bg-purple-50">
              <div className="text-sm text-gray-600">Reviews Done</div>
              <div className="text-2xl font-bold">
                {stats?.totals?.reviews ?? '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}