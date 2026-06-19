import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stryper_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401, refresh token, etc
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Skip auto-logout for password change and login — wrong credentials return 401 intentionally
      const url = error.config?.url || '';
      if (url.includes('/auth/change-password') || url.includes('/auth/login')) {
        return Promise.reject(error);
      }
      // Token expired or invalid — logout user
      localStorage.removeItem('stryper_token');
      localStorage.removeItem('stryper_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  changePassword: (data) => api.put('/auth/change-password', data),
  deleteAccount: (data) => api.delete('/auth/delete-account', { data }),
};

// Candidate Profile endpoints
export const candidateProfile = {
  get: () => api.get('/candidate'),
  create: (data) => api.post('/candidate/create', data),
  update: (data) => api.put('/candidate', data),
  search: (params) => api.get('/candidate/search', { params }),
};

// Candidate Experience endpoints
export const candidateExperience = {
  add: (data) => api.post('/candidate/experience', data),
  getAll: () => api.get('/candidate/experience'),
  update: (id, data) => api.put(`/candidate/experience/${id}`, data),
  delete: (id) => api.delete(`/candidate/experience/${id}`),
};

// Candidate Education endpoints
export const candidateEducation = {
  add: (data) => api.post('/candidate/education', data),
  getAll: () => api.get('/candidate/education'),
  update: (id, data) => api.put(`/candidate/education/${id}`, data),
  delete: (id) => api.delete(`/candidate/education/${id}`),
};

// Company Profile endpoints
export const companyProfile = {
  create: (data) => api.post('/company/create', data),
  getMe: () => api.get('/company/me'),
  update: (data) => api.put('/company/update', data),
  getPartners: () => api.get('/company/partners'),
};

// Jobs endpoints
export const jobs = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  getMyJobs: () => api.get('/jobs/company/mine'),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  // Stryper internal jobs — public, no auth
  getStryperJobs: () => api.get('/jobs/stryper'),
  applyStryperJob: (data) => api.post('/jobs/stryper/apply', data),
};

// Job Applications endpoints
export const jobApplications = {
  apply: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/me'),
  getCompanyApplicants: () => api.get('/applications/company'),
  getJobApplicants: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
  withdraw: (id) => api.delete(`/applications/${id}`),
};

// Saved Jobs endpoints
export const savedJobs = {
  save: (data) => api.post('/saved-jobs', data),
  getAll: () => api.get('/saved-jobs'),
  remove: (jobId) => api.delete(`/saved-jobs/${jobId}`),
};

// Interviews endpoints
export const interviews = {
  schedule: (data) => api.post('/interviews', data),
  getCompanyInterviews: () => api.get('/interviews/company'),
  getCandidateInterviews: () => api.get('/interviews/candidate'),
  update: (id, data) => api.put(`/interviews/${id}`, data),
  cancel: (id) => api.delete(`/interviews/${id}`),
};

// Notifications endpoints
export const notifications = {
  getAll: () => api.get('/notifications'),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  markOneAsRead: (id) => api.patch(`/notifications/${id}/read`),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Dashboard endpoints
export const dashboard = {
  getCandidate: () => api.get('/dashboard/candidate'),
  getCompany: () => api.get('/dashboard/company'),
  getCompanyAnalytics: () => api.get('/dashboard/company/analytics'),
};

// Admin endpoints
export const admin = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get('/admin/users', { params: { limit: 1000 } }).then(res => {
    const found = res.data?.users?.find(u => u._id === id);
    if (!found) throw new Error('User not found');
    return { data: { success: true, user: found } };
  }),
  getAllJobs: (params) => api.get('/admin/jobs', { params }),
  getAllApplications: (params) => api.get('/admin/applications', { params }),
  updateUserStatus: (id, data) => api.patch(`/admin/users/${id}/status`, data),
  verifyCompany: (id) => api.patch(`/admin/companies/${id}/verify`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  // Partner management
  getPartners: (params) => api.get('/admin/partners', { params }),
  addPartner: (data) => api.post('/admin/partners', data),
  updatePartnerStatus: (id) => api.patch(`/admin/partners/${id}/status`),
  removePartner: (id) => api.delete(`/admin/partners/${id}`),
};

// Upload endpoints
export const upload = {
  uploadResume: (formData) => api.post('/upload/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadProfilePicture: (formData) => api.post('/upload/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Contact endpoint
export const contact = {
  send: (data) => api.post('/contact', data),
};

// Analytics endpoints
export const analytics = {
  logVisit: () => api.post('/analytics/visit'),
};

// Settings endpoints
export const settings = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  deactivate: () => api.post('/settings/deactivate'),
};

export default api;
