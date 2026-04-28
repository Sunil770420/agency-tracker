import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://agency-tracker-server.onrender.com/api'
});

api.interceptors.request.use((config) => {
  const saved = localStorage.getItem('userInfo');

  if (saved) {
    const parsed = JSON.parse(saved);

    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }

  return config;
});

export default api;