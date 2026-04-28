import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import Layout from '../../components/common/Layout';
import Header from '../../components/common/Header';
import PageCard from '../../components/common/PageCard';
import EmptyState from '../../components/common/EmptyState';
import StatCard from '../../components/common/StatCard';
import ReportBarChart from '../../components/charts/ReportBarChart';
import PieStatusChart from '../../components/charts/PieStatusChart';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ReportsPage = () => {
  const { user } = useAuth();

  const [period, setPeriod] = useState('daily');
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async (options = {}) => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        period: options.period || period
      });

      const selectedEmployee = options.employeeId ?? employeeId;
      const selectedStart = options.startDate ?? startDate;
      const selectedEnd = options.endDate ?? endDate;

      if (selectedEmployee) query.append('employeeId', selectedEmployee);

      if (selectedStart && selectedEnd) {
        query.append('startDate', selectedStart);
        query.append('endDate', selectedEnd);
      }

      const { data } = await api.get(`/reports/detailed?${query.toString()}`);
      setReport(data);
    } catch (error) {
      console.error('REPORT FETCH ERROR:', error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport({ period, employeeId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, employeeId]);

  const chartData = useMemo(() => {
    if (!report?.charts?.labels) return [];

    return report.charts.labels.map((label, index) => ({
      label,
      metaSpend: report.charts.metaSpend?.[index] || 0,
      googleSpend: report.charts.googleSpend?.[index] || 0,
      conversions: report.charts.conversions?.[index] || 0
    }));
  }, [report]);

  const pieData = useMemo(() => {
    const summary = report?.summary?.projectSummary;

    if (!summary) return [];

    return [
      { name: 'Pending', value: summary.pending || 0 },
      { name: 'In Progress', value: summary.inProgress || 0 },
      { name: 'Completed', value: summary.completed || 0 },
      { name: 'Hold', value: summary.hold || 0 }
    ];
  }, [report]);

  const applyCustomRange = () => {
    if (!startDate || !endDate) {
      toast.error('Start date and end date required');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date end date se bada nahi ho sakta');
      return;
    }

    fetchReport({ startDate, endDate });
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setEmployeeId('');
    setPeriod('daily');
    fetchReport({
      period: 'daily',
      employeeId: '',
      startDate: '',
      endDate: ''
    });
  };

  const summary = report?.summary || {};
  const insights = report?.insights || {};

  return (
    <Layout>
      <div className="space-y-6 no-page-x-scroll">
        <Header
          title="Reports Center"
          subtitle="Daily, weekly, monthly, quarterly and custom reports with employee-wise filters."
        />

        <PageCard>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Report Filters
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Period, employee and date range ke basis par reports filter karo.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {['daily', 'weekly', 'monthly', 'quarterly'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setPeriod(item)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold capitalize transition ${
                      period === item
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {user?.role === 'admin' && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Employee
                  </label>
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="form-input"
                  >
                    <option value="">All Employees</option>
                    {report?.employees?.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} - {emp.team}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={applyCustomRange}
                  className="w-full rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800"
                >
                  Apply
                </button>

                <button
                  onClick={resetFilters}
                  className="w-full rounded-2xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-300"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </PageCard>

        {loading ? (
          <PageCard>
            <div className="text-slate-600">Loading report...</div>
          </PageCard>
        ) : report ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Meta Spend"
                value={`₹ ${summary.totalMetaSpend || 0}`}
                subtitle={`${report.period} report`}
                trend={{ direction: 'neutral', percentage: 0 }}
              />
              <StatCard
                title="Google Spend"
                value={`₹ ${summary.totalGoogleSpend || 0}`}
                subtitle={`${report.period} report`}
                trend={{ direction: 'neutral', percentage: 0 }}
              />
              <StatCard
                title="Meta Results"
                value={summary.totalMetaResults || 0}
                subtitle="Total Meta results"
                trend={{ direction: 'neutral', percentage: 0 }}
              />
              <StatCard
                title="Conversions"
                value={summary.totalConversions || 0}
                subtitle="Google conversions"
                trend={{ direction: 'neutral', percentage: 0 }}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <PageCard>
                <p className="text-sm font-medium text-slate-500">Avg CTR</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {summary.avgCTR || 0}%
                </h3>
                <p className="mt-2 text-sm text-slate-500">Google Ads</p>
              </PageCard>

              <PageCard>
                <p className="text-sm font-medium text-slate-500">Avg ROAS</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {summary.avgROAS || 0}
                </h3>
                <p className="mt-2 text-sm text-slate-500">Meta Ads</p>
              </PageCard>

              <PageCard>
                <p className="text-sm font-medium text-slate-500">Avg CPL</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  ₹ {summary.avgCPL || 0}
                </h3>
                <p className="mt-2 text-sm text-slate-500">Meta Ads</p>
              </PageCard>

              <PageCard>
                <p className="text-sm font-medium text-slate-500">
                  Cost / Conversion
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  ₹ {summary.avgCostPerConversion || 0}
                </h3>
                <p className="mt-2 text-sm text-slate-500">Google Ads</p>
              </PageCard>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <PageCard className="xl:col-span-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Performance Overview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Spend and conversion chart for selected period.
                </p>

                <div className="mt-6 overflow-hidden">
                  {chartData.length > 0 ? (
                    <ReportBarChart data={chartData} />
                  ) : (
                    <EmptyState
                      title="No chart data"
                      message="Selected period me report data available nahi hai."
                    />
                  )}
                </div>
              </PageCard>

              <PageCard>
                <h2 className="text-xl font-bold text-slate-900">
                  Project Status
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Development project status distribution.
                </p>

                <div className="mt-6 overflow-hidden">
                  {pieData.some((item) => item.value > 0) ? (
                    <PieStatusChart data={pieData} />
                  ) : (
                    <EmptyState
                      title="No project data"
                      message="Project add karne ke baad chart show hoga."
                    />
                  )}
                </div>
              </PageCard>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <PageCard>
                <p className="text-sm font-medium text-slate-500">
                  Top Performer
                </p>
                <h3 className="mt-2 break-safe text-xl font-bold text-slate-900">
                  {insights.topPerformer?.name || 'N/A'}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Score: {insights.topPerformer?.score || 0}
                </p>
              </PageCard>

              <PageCard>
                <p className="text-sm font-medium text-slate-500">
                  Lowest Performer
                </p>
                <h3 className="mt-2 break-safe text-xl font-bold text-slate-900">
                  {insights.lowPerformer?.name || 'N/A'}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Score: {insights.lowPerformer?.score || 0}
                </p>
              </PageCard>

              <PageCard>
                <p className="text-sm font-medium text-slate-500">
                  Top Meta Campaign
                </p>
                <h3 className="mt-2 break-safe text-xl font-bold text-slate-900">
                  {insights.topMetaCampaign?.campaignName || 'N/A'}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Results: {insights.topMetaCampaign?.results || 0}
                </p>
              </PageCard>

              <PageCard>
                <p className="text-sm font-medium text-slate-500">
                  Top Google Campaign
                </p>
                <h3 className="mt-2 break-safe text-xl font-bold text-slate-900">
                  {insights.topGoogleCampaign?.campaignName || 'N/A'}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Conversions: {insights.topGoogleCampaign?.conversions || 0}
                </p>
              </PageCard>
            </div>

            <PageCard>
              <h2 className="text-xl font-bold text-slate-900">
                Employee Leaderboard
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Employee-wise score based on Meta results and Google conversions.
              </p>

              <div className="mt-6">
                {insights.leaderboard?.length > 0 ? (
                  <div className="responsive-table">
                    <table className="sticky-table min-w-[900px] text-left text-sm">
                      <thead>
                        <tr className="border-b bg-slate-50 text-slate-600">
                          <th className="px-4 py-3">Employee</th>
                          <th className="px-4 py-3">Team</th>
                          <th className="px-4 py-3">Meta Spend</th>
                          <th className="px-4 py-3">Meta Results</th>
                          <th className="px-4 py-3">Google Spend</th>
                          <th className="px-4 py-3">Conversions</th>
                          <th className="px-4 py-3">Score</th>
                        </tr>
                      </thead>

                      <tbody>
                        {insights.leaderboard.map((item) => (
                          <tr key={item.employeeId} className="border-b last:border-0">
                            <td className="px-4 py-3 font-semibold text-slate-900">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 capitalize text-slate-600">
                              {item.team}
                            </td>
                            <td className="px-4 py-3">₹ {item.metaSpend || 0}</td>
                            <td className="px-4 py-3">{item.metaResults || 0}</td>
                            <td className="px-4 py-3">₹ {item.googleSpend || 0}</td>
                            <td className="px-4 py-3">{item.conversions || 0}</td>
                            <td className="px-4 py-3 font-bold text-indigo-700">
                              {item.score || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState
                    title="No leaderboard data"
                    message="Employees ke ads data add karne ke baad leaderboard show hoga."
                  />
                )}
              </div>
            </PageCard>
          </>
        ) : (
          <EmptyState
            title="No report found"
            message="Report data available nahi hai."
          />
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;