import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaChartLine,
  FaClipboardList,
  FaGoogle,
  FaHouse,
  FaMeta,
  FaPowerOff,
  FaUserPlus,
  FaUsers,
  FaXmark
} from 'react-icons/fa6';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: <FaHouse /> },
    { to: '/meta-ads', label: 'Meta Ads', icon: <FaMeta /> },
    { to: '/google-ads', label: 'Google Ads', icon: <FaGoogle /> },
    { to: '/projects', label: 'Projects', icon: <FaClipboardList /> },
    { to: '/reports', label: 'Reports', icon: <FaChartLine /> },
    { to: '/register', label: 'Add Employee', icon: <FaUserPlus /> },
    { to: '/admin', label: 'Employees', icon: <FaUsers /> }
  ];

  const digitalLinks = [
    { to: '/employee/digital', label: 'Dashboard', icon: <FaHouse /> },
    { to: '/meta-ads', label: 'Meta Ads', icon: <FaMeta /> },
    { to: '/google-ads', label: 'Google Ads', icon: <FaGoogle /> },
    { to: '/reports', label: 'Reports', icon: <FaChartLine /> }
  ];

  const developmentLinks = [
    { to: '/employee/development', label: 'Dashboard', icon: <FaHouse /> },
    { to: '/projects', label: 'Projects', icon: <FaClipboardList /> },
    { to: '/reports', label: 'Reports', icon: <FaChartLine /> }
  ];

  let links = digitalLinks;

  if (user?.role === 'admin') {
    links = adminLinks;
  } else if (user?.team === 'development') {
    links = developmentLinks;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = () => {
    if (onClose) onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-dvh w-[280px] max-w-[86vw] bg-slate-950 text-white shadow-2xl transition-transform duration-300 lg:w-72 lg:max-w-none lg:translate-x-0 lg:overflow-hidden lg:rounded-r-3xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h2 className="text-lg font-bold">Menu</h2>
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-800 p-2 text-white"
            >
              <FaXmark />
            </button>
          </div>

          <div className="shrink-0 px-4 pb-4 pt-4 lg:pt-6">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5">
              <h2 className="text-xl font-bold sm:text-2xl">Agency Tracker</h2>
              <p className="mt-2 text-xs text-indigo-100 sm:text-sm">
                Smart view for ads, projects, teams and reporting.
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4">
            <nav className="space-y-2 pb-4">
              {links.map((item, index) => (
                <NavLink
                  key={`${item.to}-${index}`}
                  to={item.to}
                  onClick={handleNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-white text-slate-900'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="shrink-0 border-t border-slate-800 p-4">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
                  Account
                </p>
                <p className="mt-2 truncate text-sm font-semibold sm:text-base">
                  {user?.name || 'User'}
                </p>
                <p className="truncate text-xs text-slate-400 sm:text-sm">
                  {user?.email || ''}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 sm:text-base"
              >
                <FaPowerOff />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;