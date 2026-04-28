import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    team: 'digital',
    designation: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return toast.error('Full name is required');
    if (!form.email.trim()) return toast.error('Email is required');
    if (!/\S+@\S+\.\S+/.test(form.email)) return toast.error('Enter valid email');
    if (!form.password.trim()) return toast.error('Password is required');
    if (form.password.length < 6) return toast.error('Password must be 6 characters');
    if (!form.designation.trim()) return toast.error('Designation is required');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    if (validateForm() !== true) return;

    try {
      setLoading(true);

      await api.post('/auth/register', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        team: form.team,
        designation: form.designation.trim()
      });

      toast.success('Member added successfully');

      setForm({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        team: 'digital',
        designation: ''
      });

      navigate(user?.role === 'admin' ? '/admin' : '/login');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-5 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div>
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-indigo-200">
                Agency Tracker
              </div>

              <h1 className="mt-10 text-5xl font-black leading-tight xl:text-6xl">
                Add team,
                <br />
                assign roles &
                <br />
                manage work.
              </h1>

              <p className="mt-6 max-w-md text-base leading-8 text-slate-300">
                Create admin, digital and development employee accounts with a clean
                responsive workflow.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-bold">Role</p>
                <p className="mt-1 text-xs text-slate-300">Access</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-bold">Team</p>
                <p className="mt-1 text-xs text-slate-300">Workflow</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-bold">User</p>
                <p className="mt-1 text-xs text-slate-300">Account</p>
              </div>
            </div>
          </div>

          <div className="max-h-[calc(100vh-2.5rem)] overflow-y-auto bg-white p-5 sm:p-8 md:p-10 xl:p-14">
            <div className="mx-auto w-full max-w-xl">
              <div className="mb-8 lg:hidden">
                <div className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-indigo-700">
                  Agency Tracker
                </div>
              </div>

              <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
                Add Member
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Create a new admin or employee account for your agency.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Sunil Kumar"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="employee@gmail.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Team
                  </label>
                  <select
                    name="team"
                    value={form.team}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="digital">Digital</option>
                    <option value="development">Development</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    placeholder="Manager / Executive / Developer"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="sm:col-span-2 w-full rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-700 px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-800 hover:to-violet-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Adding member...' : 'Add Member'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Back to{' '}
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/login'}
                  className="font-bold text-indigo-700 hover:text-indigo-600"
                >
                  dashboard
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;