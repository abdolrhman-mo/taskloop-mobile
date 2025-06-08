import { API_URL } from '@/config/api';
import { auth } from '@/utils/auth';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useCallback } from 'react';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for adding auth token if exists
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await auth.getToken();
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Custom hook for making API requests
export function useApi() {
  const get = useCallback(async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.get(url, config);
    return response.data;
  }, []);

  const post = useCallback(async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.post(url, data, config);
    return response.data;
  }, []);

  const put = useCallback(async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.put(url, data, config);
    return response.data;
  }, []);

  const del = useCallback(async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.delete(url, config);
    return response.data;
  }, []);

  return {
    get,
    post,
    put,
    delete: del,
  };
} 