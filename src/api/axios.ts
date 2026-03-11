import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.samgakmarket.shop',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    if (response.data === undefined || response.data === null) {
      response.data = [];
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('인증이 만료되었습니다. 다시 로그인해주세요.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  },
);

export default api;
