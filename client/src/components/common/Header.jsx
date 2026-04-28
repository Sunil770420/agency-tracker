import LogoutButton from './LogoutButton';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title, subtitle }) => {
  const { user } = useAuth();

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || 'User'
  )}&background=6366f1&color=fff&bold=true`;

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-4 text-white shadow-lg sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h1 className="break-words text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-[160px] truncate text-sm font-semibold">
            {user?.name || 'User'}
          </p>
          <p className="text-xs capitalize text-slate-300">
            {user?.team || '-'} • {user?.designation || user?.role || '-'}
          </p>
        </div>

        <img
          src={user?.profilePic || avatarUrl}
          alt="Profile"
          className="h-12 w-12 rounded-full border-2 border-white/30 object-cover shadow-md"
        />

        <LogoutButton />
      </div>
    </div>
  );
};

export default Header;