import api from './api';

const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login/', { email, password });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register/', userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('access_token');
        return !!token;
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile/');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.patch('/auth/profile/', userData);
        return response.data;
    },

    // Admin methods
    getAllUsers: async () => {
        const response = await api.get('/auth/admin/users/');
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await api.delete(`/auth/admin/users/${userId}/`);
        return response.data;
    },

    updateUser: async (userId, data) => {
        const response = await api.patch(`/auth/admin/users/${userId}/`, data);
        return response.data;
    },

    // Admin create user (uses same endpoint but separate method for clarity)
    createUser: async (userData) => {
        const response = await api.post('/auth/register/', userData);
        return response.data;
    },

    adminChangePassword: async (userId, newPassword) => {
        const response = await api.put(`/auth/admin/users/${userId}/password/`, { new_password: newPassword });
        return response.data;
    }
};

export default authService;
