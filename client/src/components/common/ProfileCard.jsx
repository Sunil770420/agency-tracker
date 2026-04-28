import { useAuth } from '../../context/AuthContext';

const ProfileCard = () => {
  const { user } = useAuth();

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || 'User'
  )}&background=6366f1&color=fff&bold=true`;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-4">
        <img
          src={user?.profilePic || avatarUrl}
          alt="Profile"
          className="h-16 w-16 rounded-full border border-slate-200 object-cover shadow-sm"
        />

        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-slate-900">
            {user?.name || 'User'}
          </h3>

          <p className="mt-1 text-sm capitalize text-slate-500">
            {user?.team || '-'} Team
          </p>

          <p className="text-sm text-slate-500">
            {user?.designation || user?.role || '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;