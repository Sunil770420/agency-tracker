import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Layout from '../../components/common/Layout';
import Header from '../../components/common/Header';
import PageCard from '../../components/common/PageCard';
import EmptyState from '../../components/common/EmptyState';
import ProjectForm from '../../components/forms/ProjectForm';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const emptyForm = {
  projectName: '',
  clientName: '',
  startDate: '',
  endDate: '',
  status: 'pending',
  priority: 'medium',
  notes: '',
  assignedEmployees: []
};

const ProjectTrackerPage = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/projects');
      setProjects(data || []);
    } catch (error) {
      console.error('PROJECT FETCH ERROR:', error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      const devEmployees = (data || []).filter((emp) => emp.team === 'development');
      setEmployees(devEmployees);
    } catch (error) {
      console.error('EMPLOYEE FETCH ERROR:', error?.response?.data || error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const startEdit = (project) => {
    setEditId(project._id);

    setEditForm({
      projectName: project.name || project.projectName || '',
      clientName: project.clientName || '',
      startDate: project.startDate ? project.startDate.slice(0, 10) : '',
      endDate: project.endDate ? project.endDate.slice(0, 10) : '',
      status: project.status || 'pending',
      priority: project.priority || 'medium',
      notes: project.notes || '',
      assignedEmployees:
        project.assignedEmployees?.map((emp) =>
          typeof emp === 'string' ? emp : emp._id
        ) || []
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm(emptyForm);
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEmployeeChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    setEditForm((prev) => ({
      ...prev,
      assignedEmployees: selected
    }));
  };

  const validateEditForm = () => {
    if (!editForm.projectName.trim()) {
      toast.error('Project name is required');
      return false;
    }

    if (!editForm.clientName.trim()) {
      toast.error('Client name is required');
      return false;
    }

    if (!editForm.startDate) {
      toast.error('Start date is required');
      return false;
    }

    if (!editForm.status) {
      toast.error('Status is required');
      return false;
    }

    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (editLoading) return;
    if (!validateEditForm()) return;

    try {
      setEditLoading(true);

      await api.put(`/projects/${editId}`, {
        projectName: editForm.projectName.trim(),
        clientName: editForm.clientName.trim(),
        startDate: editForm.startDate,
        endDate: editForm.endDate || '',
        status: editForm.status,
        priority: editForm.priority,
        notes: editForm.notes.trim(),
        assignedEmployees: editForm.assignedEmployees
      });

      toast.success('Project updated successfully');
      cancelEdit();
      fetchProjects();
    } catch (error) {
      console.error('PROJECT UPDATE ERROR:', error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this project?');
    if (!ok) return;

    try {
      setDeleteId(id);
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('PROJECT DELETE ERROR:', error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteId(null);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      'in-progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      hold: 'bg-rose-50 text-rose-700 border-rose-200',
      'on-hold': 'bg-rose-50 text-rose-700 border-rose-200'
    };

    return map[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getPriorityBadge = (priority) => {
    const map = {
      low: 'bg-slate-50 text-slate-700 border-slate-200',
      medium: 'bg-sky-50 text-sky-700 border-sky-200',
      high: 'bg-rose-50 text-rose-700 border-rose-200'
    };

    return map[priority] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <Layout>
      <div className="space-y-6 no-page-x-scroll">
        <Header
          title="Development Projects"
          subtitle="Track development projects, assigned team members, timelines, status and priority."
        />

        {user?.role === 'admin' && <ProjectForm onSuccess={fetchProjects} />}

        {editId && (
          <PageCard>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Project
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update project details, timeline and assigned employees.
                </p>
              </div>

              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleUpdate} className="grid gap-4 md:grid-cols-2">
              <input
                name="projectName"
                value={editForm.projectName}
                onChange={handleEditChange}
                placeholder="Project name"
                className="form-input"
              />

              <input
                name="clientName"
                value={editForm.clientName}
                onChange={handleEditChange}
                placeholder="Client name"
                className="form-input"
              />

              <input
                name="startDate"
                type="date"
                value={editForm.startDate}
                onChange={handleEditChange}
                className="form-input"
              />

              <input
                name="endDate"
                type="date"
                value={editForm.endDate}
                onChange={handleEditChange}
                className="form-input"
              />

              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="form-input"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="hold">Hold</option>
              </select>

              <select
                name="priority"
                value={editForm.priority}
                onChange={handleEditChange}
                className="form-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              {user?.role === 'admin' && (
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Assign Development Employees
                  </label>

                  <select
                    multiple
                    value={editForm.assignedEmployees}
                    onChange={handleEmployeeChange}
                    className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} - {emp.designation || 'Developer'}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs text-slate-500">
                    Ctrl / Cmd press karke multiple employees select kar sakte ho.
                  </p>
                </div>
              )}

              <textarea
                name="notes"
                value={editForm.notes}
                onChange={handleEditChange}
                rows="4"
                placeholder="Notes"
                className="form-input md:col-span-2"
              />

              <button
                type="submit"
                disabled={editLoading}
                className="rounded-2xl bg-indigo-700 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-indigo-800 disabled:opacity-70 md:col-span-2"
              >
                {editLoading ? 'Updating...' : 'Update Project'}
              </button>
            </form>
          </PageCard>
        )}

        <PageCard>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Projects List
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                All development work and project progress.
              </p>
            </div>

            <button
              onClick={fetchProjects}
              className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-slate-50 p-6 text-slate-600">
              Loading project data...
            </div>
          ) : projects.length > 0 ? (
            <div className="responsive-table">
              <table className="sticky-table min-w-[1050px] text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600">
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Assigned</th>
                    <th className="px-4 py-3">Start</th>
                    <th className="px-4 py-3">End</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Actions</th>
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
                        {project.assignedEmployees?.length > 0
                          ? project.assignedEmployees
                              .map((emp) => emp.name || 'Employee')
                              .join(', ')
                          : '-'}
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

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusBadge(
                            project.status
                          )}`}
                        >
                          {project.status || 'pending'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getPriorityBadge(
                            project.priority
                          )}`}
                        >
                          {project.priority || 'medium'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {user?.role === 'admin' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(project)}
                              className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(project._id)}
                              disabled={deleteId === project._id}
                              className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-70"
                            >
                              {deleteId === project._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(project)}
                            className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                          >
                            Update Status
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No projects found"
              message="Admin project form se development project add karo."
            />
          )}
        </PageCard>
      </div>
    </Layout>
  );
};

export default ProjectTrackerPage;