import { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import Header from '../../components/common/Header';
import StatCard from '../../components/common/StatCard';
import MetaAdsForm from '../../components/forms/MetaAdsForm';
import GoogleAdsForm from '../../components/forms/GoogleAdsForm';
import api from '../../api/axios';
import ProfileCard from '../../components/common/ProfileCard';
import ProfileImageUpload from '../../components/common/ProfileImageUpload';

const DigitalEmployeeDashboard = () => {
  const [stats, setStats] = useState({
    totalMetaSpend: 0,
    totalGoogleSpend: 0,
    totalConversions: 0,
    totalMetaResults: 0,
    avgCTR: 0,
    avgROAS: 0,
    avgROI: 0,
    avgCostPerConversion: 0,
    trends: {}
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/reports/dashboard?period=monthly');
      setStats((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error('DIGITAL DASHBOARD ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="rounded-3xl bg-white p-6 shadow-sm">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 no-page-x-scroll">
        <Header
          title="Digital Dashboard"
          subtitle="Your marketing work, spend efficiency and campaign performance overview."
        />
        <ProfileCard />
        <ProfileImageUpload />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Meta Spend"
            value={`₹ ${stats.totalMetaSpend || 0}`}
            subtitle="This month"
            trend={stats.trends?.metaSpend}
          />

          <StatCard
            title="Google Spend"
            value={`₹ ${stats.totalGoogleSpend || 0}`}
            subtitle="This month"
            trend={stats.trends?.googleSpend}
          />

          <StatCard
            title="Conversions"
            value={stats.totalConversions || 0}
            subtitle="This month"
            trend={stats.trends?.conversions}
          />

          <StatCard
            title="Meta Results"
            value={stats.totalMetaResults || 0}
            subtitle="This month"
            trend={stats.trends?.metaResults}
          />

          <StatCard
            title="Total Spend"
            value={`₹ ${
              Number(stats.totalMetaSpend || 0) +
              Number(stats.totalGoogleSpend || 0)
            }`}
            subtitle="Meta + Google"
            trend={stats.trends?.totalSpend}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Average CTR</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {stats.avgCTR || 0}%
            </h3>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Average ROAS</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {stats.avgROAS || 0}
            </h3>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Average ROI</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {stats.avgROI || 0}
            </h3>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Cost / Conversion
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              ₹ {stats.avgCostPerConversion || 0}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <MetaAdsForm onSuccess={fetchDashboard} />
          <GoogleAdsForm onSuccess={fetchDashboard} />
        </div>
      </div>
    </Layout>
  );
};

export default DigitalEmployeeDashboard;