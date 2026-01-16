import { loadingRef } from '@/lib/loadingStore';
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  loadingRef.startRequest();
  return config;
});

instance.interceptors.response.use(
  (res) => {
    loadingRef.endRequest();
    return res;
  },
  (err) => {
    loadingRef.endRequest(); // important even on error
    return Promise.reject(err);
  }
);

export default instance;
