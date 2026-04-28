import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('userInfo');

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed?.token && parsed?.user) {
          setUser(parsed.user);
        } else {
          localStorage.removeItem('userInfo');
        }
      }
    } catch {
      localStorage.removeItem('userInfo');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data.user);
  };

  const updateUser = (updatedUser) => {
    const saved = localStorage.getItem('userInfo');
    const parsed = saved ? JSON.parse(saved) : null;

    if (!parsed?.token) return;

    const newData = {
      ...parsed,
      user: {
        ...parsed.user,
        ...updatedUser
      }
    };

    localStorage.setItem('userInfo', JSON.stringify(newData));
    setUser(newData.user);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, updateUser, login, logout, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);