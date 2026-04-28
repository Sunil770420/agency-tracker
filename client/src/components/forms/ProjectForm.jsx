import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageCard from '../common/PageCard';
import api from '../../api/axios';

const initialForm = {
  projectName: '',
  clientName: '',
  startDate: '',
  endDate: '',
  status: 'pending',
  priority: 'medium',
  notes: '',
  assignedEmployees: []
};

const ProjectForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      const devEmployees = (data || []).filter((emp) => emp.team === 'development');
      setEmployees(devEmployees);
    } catch (error) {
      console.error('EMPLOYEE LOAD ERROR:', error?.response?.data || error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEmployeesChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map((option) => option.value);

    setForm((prev) => ({
      ...prev,
      assignedEmployees: values
    }));
  };

  const validateForm = () => {
    if (!form.projectName.trim()) {
      toast.error('Project name is required');
      return false;
    }

    if (!form.clientName.trim()) {
      toast.error('Client name is required');
      return false;
    }

    if (!form.startDate) {
      toast.error('Start date is required');
      return false;
    }

    if (!form.status) {
      toast.error('Status is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    if (!validateForm()) return;

    try {
      setLoading(true);

      await api.post('/projects', {
        projectName: form.projectName.trim(),
        clientName: form.clientName.trim(),
        startDate: form.startDate,
        endDate: form.endDate || '',
        status: form.status,
        priority: form.priority,
        notes: form.notes.trim(),
        assignedEmployees: form.assignedEmployees
      });

      toast.success('Project added successfully');
      setForm(initialForm);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('PROJECT CREATE ERROR:', error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageCard>
      <h2 className="text-xl font-bold text-slate-900">Add Development Project</h2>
      <p className="mt-1 text-sm text-slate-500">
        Development team ke projects, timeline, status aur assignee track karo.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <input name="projectName" value={form.projectName} onChange={handleChange} placeholder="Project name" className="form-input" />
        <input name="clientName" value={form.clientName} onChange={handleChange} placeholder="Client name" className="form-input" />

        <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="form-input" />
        <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="form-input" />

        <select name="status" value={form.status} onChange={handleChange} className="form-input">
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="hold">Hold</option>
        </select>

        <select name="priority" value={form.priority} onChange={handleChange} className="form-input">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Assign Development Employees
          </label>

          <select
            multiple
            value={form.assignedEmployees}
            onChange={handleEmployeesChange}
            className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white"
          >
            {employees.length > 0 ? (
              employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} - {emp.designation || 'Developer'}
                </option>
              ))
            ) : (
              <option disabled>No development employees found</option>
            )}
          </select>

          <p className="mt-2 text-xs text-slate-500">
            Ctrl / Cmd press karke multiple employees select kar sakte ho.
          </p>
        </div>

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows="4"
          placeholder="Project notes"
          className="form-input md:col-span-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-indigo-700 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-800 disabled:opacity-70 md:col-span-2"
        >
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </form>
    </PageCard>
  );
};

export default ProjectForm;