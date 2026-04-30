import { apiClient } from './api-client';
import { 
  UserDTO, 
  EmailTemplate, 
  Contact, 
  ContactGroup, 
  EmailRequest, 
  AnalyticsStats,
  LoginRequest,
  TokenResponse
} from './types';

// Auth Service
export const authService = {
  login: (data: LoginRequest) => 
    apiClient.post<TokenResponse>('/api/v1/auth/login', data).then(r => r.data),
  
  register: (data: UserDTO) => 
    apiClient.post<UserDTO>('/api/v1/auth/register', data).then(r => r.data),
    
  logout: () => 
    apiClient.post('/api/v1/auth/logout'),
    
  forgotPassword: (email: string) => 
    apiClient.post('/api/v1/auth/forgot-password', { email }),
    
  resetPassword: (data: any) => 
    apiClient.post('/api/v1/auth/reset-password', data),
};

// Template Service
export const templateService = {
  list: () => 
    apiClient.get<EmailTemplate[]>('/api/v1/email/templates').then(r => r.data),
    
  get: (id: string) => 
    apiClient.get<EmailTemplate>(`/api/v1/email/templates/${id}`).then(r => r.data),
    
  create: (data: EmailTemplate) => 
    apiClient.post<EmailTemplate>('/api/v1/email/templates', data).then(r => r.data),
    
  update: (id: string, data: EmailTemplate) => 
    apiClient.put<EmailTemplate>(`/api/v1/email/templates/${id}`, data).then(r => r.data),
    
  delete: (id: string) => 
    apiClient.delete(`/api/v1/email/templates/${id}`),
};

// Contact Service
export const contactService = {
  list: (onlySelected = false) => 
    apiClient.get<Contact[]>('/api/v1/contacts', { params: { onlySelected } }).then(r => r.data),
    
  create: (data: Contact) => 
    apiClient.post<Contact>('/api/v1/contacts', data).then(r => r.data),
    
  update: (id: string, data: Contact) => 
    apiClient.put<Contact>(`/api/v1/contacts/${id}`, data).then(r => r.data),
    
  delete: (id: string) => 
    apiClient.delete(`/api/v1/contacts/${id}`),
    
  toggleSelection: (id: string, selected: boolean) => 
    apiClient.patch(`/api/v1/contacts/${id}/selection`, null, { params: { selected } }),
    
  bulkSelect: (contactIds: string[], selected: boolean) => 
    apiClient.post('/api/v1/contacts/bulk-selection', { contactIds, selected }),
};

// Email Service
export const emailService = {
  send: (data: EmailRequest) => 
    apiClient.post<string>('/api/v1/email/send', data).then(r => r.data),
    
  schedule: (data: EmailRequest, scheduleTime: string) => 
    apiClient.post<string>('/api/v1/email/schedule', data, { params: { scheduleTime } }).then(r => r.data),
    
  broadcast: (data: EmailRequest) => 
    apiClient.post<string>('/api/v1/contacts/broadcast', data).then(r => r.data),
};

// Analytics Service
export const analyticsService = {
  getStats: () => 
    apiClient.get<AnalyticsStats>('/api/analytics/stats').then(r => r.data),
};
