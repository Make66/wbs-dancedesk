import axios from 'axios';
import { env } from '@/config/env';

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  config.headers['Content-Type'] = 'application/json';
  return config;
});
