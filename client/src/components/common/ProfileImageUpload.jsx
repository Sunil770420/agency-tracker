import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ProfileImageUpload = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || 'User'
  )}&background=6366f1&color=fff&bold=true`;

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files allowed');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);

      const { data } = await api.post('/upload/profile-image', formData);

      if (data?.user) {
        updateUser(data.user);
      } else if (data?.profilePic) {
        updateUser({ profilePic: data.profilePic });
      }

      toast.success('Profile photo updated');
    } catch (error) {
      console.error('PROFILE UPLOAD ERROR:', error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={user?.profilePic || avatarUrl}
            alt="Profile"
            className="h-16 w-16 rounded-full border border-slate-200 object-cover shadow-sm"
          />

          <div>
            <h3 className="font-bold text-slate-900">Profile Photo</h3>
            <p className="text-sm text-slate-500">
              JPG/PNG upload karo. Max 2MB.
            </p>
          </div>
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800">
          {loading ? 'Uploading...' : 'Upload Photo'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={loading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default ProfileImageUpload;