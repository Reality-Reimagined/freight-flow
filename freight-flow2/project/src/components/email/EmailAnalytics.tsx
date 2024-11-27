import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { getEmailAnalytics } from '../../lib/email';

interface EmailAnalyticsProps {
  loadId?: string;
}

const EmailAnalytics: React.FC<EmailAnalyticsProps> = ({ loadId }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getEmailAnalytics(loadId);
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [loadId]);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Sent</div>
          <div className="text-2xl font-bold">{analytics.sent}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Delivered</div>
          <div className="text-2xl font-bold">{analytics.delivered}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Opened</div>
          <div className="text-2xl font-bold">{analytics.opened}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Clicked</div>
          <div className="text-2xl font-bold">{analytics.clicked}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Failed</div>
          <div className="text-2xl font-bold">{analytics.failed}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Email Events Over Time</h3>
          <Line data={getChartData(analytics.events)} options={chartOptions} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Event Distribution</h3>
          <Bar data={getBarData(analytics)} options={chartOptions} />
        </div>
      </div>

      {/* Detailed Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table implementation */}
        </table>
      </div>
    </div>
  );
};

export default EmailAnalytics; 