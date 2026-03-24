import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', res.data.data.accessToken);
          error.config.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
          return axios(error.config);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const providersApi = {
  getAll: (params) => api.get('/providers', { params }),
  getById: (id) => api.get(`/providers/${id}`),
  getSlots: (id, date) => api.get(`/providers/${id}/slots`, { params: { date } }),
  getReviews: (id) => api.get(`/providers/${id}/reviews`),
  getMyProfile: () => api.get('/providers/me/profile'),
  updateMyProfile: (data) => api.put('/providers/me/profile', data),
  getMyAppointments: () => api.get('/providers/me/appointments'),
  getMyStats: () => api.get('/providers/me/stats'),
  addSlot: (data) => api.post('/providers/me/slots', data),
  blockSlot: (slotId) => api.patch(`/providers/me/slots/${slotId}/block`),
  unblockSlot: (slotId) => api.patch(`/providers/me/slots/${slotId}/unblock`),
  deleteSlot: (slotId) => api.delete(`/providers/me/slots/${slotId}`),
};

export const appointmentsApi = {
  book: (data) => api.post('/appointments', data),
  getMy: () => api.get('/appointments/my'),
  getById: (id) => api.get(`/appointments/${id}`),
  cancel: (id) => api.patch(`/appointments/${id}/cancel`),
  reschedule: (id, data) => api.patch(`/appointments/${id}/reschedule`, data),
  confirm: (id) => api.patch(`/appointments/${id}/confirm`),
  reject: (id, data) => api.patch(`/appointments/${id}/reject`, data),
  complete: (id) => api.patch(`/appointments/${id}/complete`),
};

export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getNotifications: () => api.get('/users/notifications'),
  markNotificationRead: (id) => api.patch(`/users/notifications/${id}/read`),
  addReview: (data) => api.post('/users/reviews', data),
  getReviews: () => api.get('/users/reviews'),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  deactivateUser: (id) => api.patch(`/admin/users/${id}/deactivate`),
  activateUser: (id) => api.patch(`/admin/users/${id}/activate`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getProviders: () => api.get('/admin/providers'),
  getAppointments: () => api.get('/admin/appointments'),
};

export default api;
