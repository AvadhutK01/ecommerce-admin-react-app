import axios from 'axios';

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const FIRESTORE_BASE_URL = import.meta.env.VITE_FIREBASE_BASE_URL;
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

const firestoreApi = axios.create({
  baseURL: FIRESTORE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const setupInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token && !config.params?.key) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (instance === authApi || config.url.includes(':')) {
        config.params = { ...config.params, key: API_KEY };
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.error?.message || 'Something went wrong';
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      const customError = new Error(message);
      customError.response = error.response;
      return Promise.reject(customError);
    }
  );
};

setupInterceptors(firestoreApi);
setupInterceptors(authApi);

export { firestoreApi, authApi };
