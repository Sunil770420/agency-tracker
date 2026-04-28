import { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import Header from '../../components/common/Header';
import StatCard from '../../components/common/StatCard';
import api from '../../api/axios';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/reports/dashboard');
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Header title="My Dashboard" subtitle="Your personal view of campaign performance and assigned work." />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="My Meta Spend" value={`₹ ${stats.totalMetaSpend}`} subtitle="Your Meta campaigns" trend={stats.trend} />
          <StatCard title="My Google Spend" value={`₹ ${stats.totalGoogleSpend}`} subtitle="Your Google campaigns" trend={stats.trend} />
          <StatCard title="My Conversions" value={stats.totalConversions} subtitle="Your tracked conversions" trend={stats.trend} />
          <StatCard title="My Projects" value={stats.totalProjects} subtitle="Assigned projects" trend={stats.trend} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Work Summary</h3>
          <p className="mt-3 text-sm text-slate-500">
            Use the sidebar to add your marketing data and view reports. Your dashboard is limited to your own records only.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;