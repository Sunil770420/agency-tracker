import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Header from '../../components/common/Header';
import StatCard from '../../components/common/StatCard';
import api from '../../api/axios';

const EmployeeDetailsPage = () => {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [metaEntries, setMetaEntries] = useState([]);
  const [googleEntries, setGoogleEntries] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const [empRes, metaRes, googleRes, projectRes] = await Promise.all([
          api.get(`/employees/${id}`),
          api.get('/meta-ads'),
          api.get('/google-ads'),
          api.get('/projects')
        ]);

        setEmployee(empRes.data);

        const filteredMeta = metaRes.data.filter((item) => item.employee?._id === id);
        const filteredGoogle = googleRes.data.filter((item) => item.employee?._id === id);
        const filteredProjects = projectRes.data.filter((project) =>
          project.assignedEmployees?.some((emp) => emp._id === id)
        );

        setMetaEntries(filteredMeta);
        setGoogleEntries(filteredGoogle);
        setProjects(filteredProjects);
      } catch (error) {
        console.error('EMPLOYEE DETAILS ERROR:', error);
      }
    };

    fetchEmployeeData();
  }, [id]);

  const metaTotalSpend = useMemo(
    () => metaEntries.reduce((sum, item) => sum + Number(item.spend || 0), 0),
    [metaEntries]
  );

  const googleTotalSpend = useMemo(
    () => googleEntries.reduce((sum, item) => sum + Number(item.spend || 0), 0),
    [googleEntries]
  );

  const googleTotalConversions = useMemo(
    () => googleEntries.reduce((sum, item) => sum + Number(item.conversions || 0), 0),
    [googleEntries]
  );

  const metaTotalResults = useMemo(
    () => metaEntries.reduce((sum, item) => sum + Number(item.results || 0), 0),
    [metaEntries]
  );

  const completedProjects = useMemo(
    () => projects.filter((item) => item.status === 'completed').length,
    [projects]
  );

  if (!employee) {
    return <div className="p-6">Loading...</div>;
  }

  const isDigital = employee.team === 'digital';
  const isDevelopment = employee.team === 'development';

  return (
    <Layout>
      <div className="space-y-6 no-page-x-scroll">
        <Header
          title={`${employee.name} Dashboard`}
          subtitle={`Role: ${employee.role} • Team: ${employee.team} • Designation: ${employee.designation || '-'}`}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Employee Name"
            value={employee.name}
            subtitle={employee.email}
            trend={{ direction: 'neutral', percentage: 0 }}
          />
          <StatCard
            title="Team"
            value={employee.team}
            subtitle={`Role: ${employee.role}`}
            trend={{ direction: 'neutral', percentage: 0 }}
          />
          <StatCard
            title="Designation"
            value={employee.designation || '-'}
            subtitle="Current position"
            trend={{ direction: 'neutral', percentage: 0 }}
          />
          <StatCard
            title="Status"
            value={employee.isActive ? 'Active' : 'Inactive'}
            subtitle="Account activity"
            trend={{ direction: 'neutral', percentage: 0 }}
          />
        </div>

        {isDigital && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Meta Spend" value={`₹ ${metaTotalSpend}`} subtitle="Total Meta spend" trend={{ direction: 'neutral', percentage: 0 }} />
              <StatCard title="Meta Results" value={metaTotalResults} subtitle="Total Meta results" trend={{ direction: 'neutral', percentage: 0 }} />
              <StatCard title="Google Spend" value={`₹ ${googleTotalSpend}`} subtitle="Total Google spend" trend={{ direction: 'neutral', percentage: 0 }} />
              <StatCard title="Conversions" value={googleTotalConversions} subtitle="Total Google conversions" trend={{ direction: 'neutral', percentage: 0 }} />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">
                Meta Ads Work
              </h2>
              <div className="responsive-table">
                <table className="sticky-table min-w-[950px] text-left text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="px-4 py-3">Campaign</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Spend</th>
                      <th className="px-4 py-3">CPP</th>
                      <th className="px-4 py-3">CPL</th>
                      <th className="px-4 py-3">Results</th>
                      <th className="px-4 py-3">ROAS</th>
                      <th className="px-4 py-3">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metaEntries.length > 0 ? (
                      metaEntries.map((item) => (
                        <tr key={item._id} className="border-b">
                          <td className="px-4 py-3">{item.campaignName}</td>
                          <td className="px-4 py-3">
                            {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3">₹ {item.spend}</td>
                          <td className="px-4 py-3">{item.cpp}</td>
                          <td className="px-4 py-3">{item.cpl}</td>
                          <td className="px-4 py-3">{item.results}</td>
                          <td className="px-4 py-3">{item.roas}</td>
                          <td className="px-4 py-3">{item.roi}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-4 py-6 text-center text-slate-500">
                          No Meta Ads work found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">
                Google Ads Work
              </h2>
              <div className="responsive-table">
                <table className="sticky-table min-w-[950px] text-left text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="px-4 py-3">Campaign</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Spend</th>
                      <th className="px-4 py-3">Conversions</th>
                      <th className="px-4 py-3">CTR</th>
                      <th className="px-4 py-3">Cost/Conv</th>
                      <th className="px-4 py-3">Impressions</th>
                      <th className="px-4 py-3">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {googleEntries.length > 0 ? (
                      googleEntries.map((item) => (
                        <tr key={item._id} className="border-b">
                          <td className="px-4 py-3">{item.campaignName}</td>
                          <td className="px-4 py-3">
                            {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3">₹ {item.spend}</td>
                          <td className="px-4 py-3">{item.conversions}</td>
                          <td className="px-4 py-3">{item.ctr}</td>
                          <td className="px-4 py-3">{item.costPerConversion}</td>
                          <td className="px-4 py-3">{item.impressions}</td>
                          <td className="px-4 py-3">{item.clicks}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-4 py-6 text-center text-slate-500">
                          No Google Ads work found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {isDevelopment && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard title="Assigned Projects" value={projects.length} subtitle="Total assigned projects" trend={{ direction: 'neutral', percentage: 0 }} />
              <StatCard title="Completed Projects" value={completedProjects} subtitle="Finished work" trend={{ direction: 'neutral', percentage: 0 }} />
              <StatCard title="Pending / In Progress" value={projects.length - completedProjects} subtitle="Open development work" trend={{ direction: 'neutral', percentage: 0 }} />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">
                Development Work
              </h2>
              <div className="responsive-table">
                <table className="sticky-table min-w-[900px] text-left text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="px-4 py-3">Project</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Start</th>
                      <th className="px-4 py-3">End</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <tr key={project._id} className="border-b">
                          <td className="px-4 py-3">{project.name}</td>
                          <td className="px-4 py-3">{project.clientName || '-'}</td>
                          <td className="px-4 py-3">
                            {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3">
                            {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3">{project.status}</td>
                          <td className="px-4 py-3">{project.priority}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                          No development work found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeDetailsPage;