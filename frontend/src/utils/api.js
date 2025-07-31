import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production' 
    ? '' // Use relative URLs in production
    : 'http://localhost:5000'
);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  // Public endpoints
  getAll: (category) => api.get(`/api/products${category ? `?category=${category}` : ''}`),
  getById: (id) => api.get(`/api/products/${id}`),
  
  // Admin endpoints
  getAllForAdmin: () => api.get('/api/products/admin/all'),
  create: (formData) => api.post('/api/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/api/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  toggleStatus: (id) => api.patch(`/api/products/${id}/toggle-status`),
  delete: (id) => api.delete(`/api/products/${id}`)
};

// Inquiries API
export const inquiriesAPI = {
  // Public endpoints
  submit: (inquiryData) => api.post('/api/inquiries', inquiryData),
  
  // Admin endpoints
  getAll: (params) => api.get('/api/inquiries', { params }),
  getById: (id) => api.get(`/api/inquiries/${id}`),
  updateStatus: (id, status) => api.patch(`/api/inquiries/${id}/status`, { status }),
  getStats: () => api.get('/api/inquiries/stats/overview'),
  delete: (id) => api.delete(`/api/inquiries/${id}`)
};

// Admin API
export const adminAPI = {
  login: (credentials) => api.post('/api/admin/login', credentials),
  register: (adminData) => api.post('/api/admin/register', adminData),
  verify: () => api.get('/api/admin/verify'),
  updateProfile: (profileData) => api.put('/api/admin/profile', profileData),
  changePassword: (passwordData) => api.put('/api/admin/change-password', passwordData)
};

// Utility functions
export const getImageUrl = (filename) => {
  if (!filename) return '/placeholder-image.jpg';
  if (filename.startsWith('http')) return filename;
  return `${API_BASE_URL}/uploads/${filename}`;
};

export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

export default api;
