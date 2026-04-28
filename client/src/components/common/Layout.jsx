import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa6';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-slate-100">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl bg-slate-950 p-3 text-white"
        >
          <FaBars />
        </button>

        <h2 className="truncate text-lg font-bold text-slate-900">
          Agency Tracker
        </h2>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="w-full overflow-x-hidden lg:pl-72">
        <main className="min-w-0 max-w-full px-3 py-4 sm:px-4 md:px-6 lg:px-8 lg:py-8">
          <div className="w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;