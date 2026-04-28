import { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import Header from '../../components/common/Header';
import StatCard from '../../components/common/StatCard';
import PageCard from '../../components/common/PageCard';
import EmptyState from '../../components/common/EmptyState';
import ProjectForm from '../../components/forms/ProjectForm';
import api from '../../api/axios';
import ProfileCard from '../../components/common/ProfileCard';
import ProfileImageUpload from '../../components/common/ProfileImageUpload';

const DevelopmentEmployeeDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/projects');
      setProjects(data || []);
    } catch (error) {
      console.error('DEVELOPMENT DASHBOARD ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (project) => project.status === 'completed'
  ).length;
  const inProgressProjects = projects.filter(
    (project) => project.status === 'in-progress'
  ).length;
  const pendingProjects = projects.filter(
    (project) => project.status === 'pending'
  ).length;

  return (
    <Layout>
      <div className="space-y-6 no-page-x-scroll">
        <Header
          title="Development Dashboard"
          subtitle="Your assigned projects, progress and development workflow."
        />
        <ProfileCard />
        <ProfileImageUpload />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Projects"
            value={totalProjects}
            subtitle="Assigned projects"
            trend={{ direction: 'neutral', percentage: 0 }}
          />

          <StatCard
            title="Completed"
            value={completedProjects}
            subtitle="Finished projects"
            trend={{ direction: 'neutral', percentage: 0 }}
          />

          <StatCard
            title="In Progress"
            value={inProgressProjects}
            subtitle="Active projects"
            trend={{ direction: 'neutral', percentage: 0 }}
          />

          <StatCard
            title="Pending"
            value={pendingProjects}
            subtitle="Pending projects"
            trend={{ direction: 'neutral', percentage: 0 }}
          />
        </div>

        <ProjectForm onSuccess={fetchProjects} />

        <PageCard>
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            My Projects
          </h2>

          {loading ? (
            <div className="rounded-3xl bg-slate-50 p-6 text-slate-600">
              Loading projects...
            </div>
          ) : projects.length > 0 ? (
            <div className="responsive-table">
              <table className="sticky-table min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600">
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Start</th>
                    <th className="px-4 py-3">End</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Priority</th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {project.name || project.projectName || '-'}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {project.clientName || '-'}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {project.startDate
                          ? new Date(project.startDate).toLocaleDateString()
                          : '-'}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {project.endDate
                          ? new Date(project.endDate).toLocaleDateString()
                          : '-'}
                      </td>

                      <td className="px-4 py-3 capitalize">
                        {project.status || 'pending'}
                      </td>

                      <td className="px-4 py-3 capitalize">
                        {project.priority || 'medium'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No projects found"
              message="Project form se project add karo."
            />
          )}
        </PageCard>
      </div>
    </Layout>
  );
};

export default DevelopmentEmployeeDashboard;