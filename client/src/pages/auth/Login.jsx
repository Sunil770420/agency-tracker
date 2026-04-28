import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!form.password.trim()) {
      toast.error('Password is required');
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post('/auth/login', {
        email: form.email.trim().toLowerCase(),
        password: form.password
      });

      login(data);
      toast.success('Login successful');

      if (data?.user?.role === 'admin') {
        navigate('/admin');
      } else if (data?.user?.team === 'development') {
        navigate('/employee/development');
      } else {
        navigate('/employee/digital');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
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
                Track ads,
                <br />
                projects &
                <br />
                team growth.
              </h1>

              <p className="mt-6 max-w-md text-base leading-8 text-slate-300">
                Manage Meta Ads, Google Ads, development projects, employees and reports
                from one clean professional dashboard.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-bold">ROI</p>
                <p className="mt-1 text-xs text-slate-300">Performance</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-bold">Ads</p>
                <p className="mt-1 text-xs text-slate-300">Tracking</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-bold">Dev</p>
                <p className="mt-1 text-xs text-slate-300">Projects</p>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-white p-5 sm:p-8 md:p-10 xl:p-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 lg:hidden">
                <div className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-indigo-700">
                  Agency Tracker
                </div>
              </div>

              <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Login to continue managing your agency workflow.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@gmail.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-700 px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-800 hover:to-violet-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
              </form>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Demo tip</p>
                <p className="mt-1">
                  Use the account you created from the register/add member flow.
                </p>
              </div>

              <p className="mt-6 text-center text-sm text-slate-500">
                Need an account?{' '}
                <Link
                  to="/register"
                  className="font-bold text-indigo-700 hover:text-indigo-600"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;