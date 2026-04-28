import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
    >
      Logout
    </button>
  );
};

export default LogoutButton;