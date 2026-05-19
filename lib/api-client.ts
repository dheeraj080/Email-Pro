import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ApiClient {
  get<T = any>(url: string, config?: any): Promise<{ data: T }>;
  post<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }>;
  put<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }>;
  delete<T = any>(url: string, config?: any): Promise<{ data: T }>;
}

export const apiClient = (axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) as unknown) as ApiClient;
