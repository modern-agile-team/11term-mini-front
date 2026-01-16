
import axios from 'axios';

const api = axios.create({
  baseURL: 'YOUR_API_URL',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;