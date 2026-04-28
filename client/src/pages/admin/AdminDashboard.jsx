import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Header from '../../components/common/Header';
import StatCard from '../../components/common/StatCard';
import PageCard from '../../components/common/PageCard';
import EmptyState from '../../components/common/EmptyState';
import api from '../../api/axios';

const defaultStats = {
  totalMetaSpend: 0,
  totalGoogleSpend: 0,
  totalConversions: 0,
  totalMetaResults: 0,
  totalProjects: 0,
  completedProjects: 0,
  avgCTR: 0,
  avgROAS: 0,
  avgROI: 0,
  avgCostPerConversion: 0,
  totalClicks: 0,
  totalImpressions: 0,
  avgCPL: 0,
  avgCPP: 0,
  period: 'monthly',
  trends: {
    metaSpend: { direction: 'neutral', percentage: 0 },
    googleSpend: { direction: 'neutral', percentage: 0 },
    conversions: { direction: 'neutral', percentage: 0 },
    metaResults: { direction: 'neutral', percentage: 0 },
    totalSpend: { direction: 'neutral', percentage: 0 }
  }
};

const InsightCard = ({ title, value, helper }) => {
  return (
    <PageCard>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-2 break-safe text-2xl font-bold text-slate-900">
        {value}
      </h3>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </PageCard>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(defaultStats);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setPageError('');

      const [statsRes, empRes] = await Promise.allSettled([
        api.get('/reports/dashboard?period=monthly'),
        api.get('/employees')
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats({ ...defaultStats, ...statsRes.value.data });
      }

      if (empRes.status === 'fulfilled') {
        setEmployees(empRes.value.data || []);
      }

      if (statsRes.status === 'rejected' && empRes.status === 'rejected') {
        setPageError('Dashboard data load nahi ho pa raha.');
      }
    } catch (error) {
      console.error('DASHBOARD ERROR:', error);
      setPageError('Something went wrong while loading dashboard.');
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
        <PageCard>Loading dashboard...</PageCard>
      </Layout>
    );
  }

  if (pageError) {
    return (
      <Layout>
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {pageError}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 no-page-x-scroll">
        <Header
          title="Agency Dashboard"
          subtitle="Overview of ads, projects, employees, spend, conversions and agency performance."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Meta Spend"
            value={`₹ ${stats.totalMetaSpend || 0}`}
            subtitle="Current month"
            trend={stats.trends?.metaSpend}
          />
          <StatCard
            title="Google Spend"
            value={`₹ ${stats.totalGoogleSpend || 0}`}
            subtitle="Current month"
            trend={stats.trends?.googleSpend}
          />
          <StatCard
            title="Conversions"
            value={stats.totalConversions || 0}
            subtitle="Google ads"
            trend={stats.trends?.conversions}
          />
          <StatCard
            title="Meta Results"
            value={stats.totalMetaResults || 0}
            subtitle="Meta campaigns"
            trend={stats.trends?.metaResults}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InsightCard
            title="Total Spend"
            value={`₹ ${Number(stats.totalMetaSpend || 0) + Number(stats.totalGoogleSpend || 0)}`}
            helper="Meta + Google combined"
          />
          <InsightCard
            title="Average CTR"
            value={`${stats.avgCTR || 0}%`}
            helper="Google click-through rate"
          />
          <InsightCard
            title="Average ROAS"
            value={stats.avgROAS || 0}
            helper="Meta return on ad spend"
          />
          <InsightCard
            title="Average ROI"
            value={stats.avgROI || 0}
            helper="Meta return on investment"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InsightCard
            title="Avg Cost / Conversion"
            value={`₹ ${stats.avgCostPerConversion || 0}`}
            helper="Google ads average"
          />
          <InsightCard
            title="Average CPL"
            value={`₹ ${stats.avgCPL || 0}`}
            helper="Meta lead cost"
          />
          <InsightCard
            title="Total Projects"
            value={stats.totalProjects || 0}
            helper="Development pipeline"
          />
          <InsightCard
            title="Completed Projects"
            value={stats.completedProjects || 0}
            helper="Finished project count"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <PageCard className="xl:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Employee Directory
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Admin can view individual employee dashboard and work details.
                </p>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Add Member
              </Link>
            </div>

            <div className="mt-6">
              {employees.length > 0 ? (
                <div className="responsive-table">
                  <table className="sticky-table min-w-[850px] text-left text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50 text-slate-600">
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Team</th>
                        <th className="px-4 py-3">Designation</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <tr key={emp._id} className="border-b last:border-0">
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {emp.name}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{emp.email}</td>
                          <td className="px-4 py-3 capitalize">{emp.role}</td>
                          <td className="px-4 py-3 capitalize">{emp.team}</td>
                          <td className="px-4 py-3">{emp.designation || '-'}</td>
                          <td className="px-4 py-3">
                            <Link
                              to={`/admin/employees/${emp._id}`}
                              className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                            >
                              View Dashboard
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  title="No employees found"
                  message="Add Member button se employee create karo."
                />
              )}
            </div>
          </PageCard>

          <PageCard>
            <h2 className="text-xl font-bold text-slate-900">
              Agency Summary
            </h2>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Report Period</p>
                <p className="mt-1 font-semibold capitalize text-slate-900">
                  {stats.period}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total Clicks</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {stats.totalClicks || 0}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total Impressions</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {stats.totalImpressions || 0}
                </p>
              </div>

              <div className="rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-800">
                Reports page me employee-wise filters, charts aur export use kar sakte ho.
              </div>
            </div>
          </PageCard>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;