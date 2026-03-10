import api from './api';

const transactionService = {
    // CRUD Operations
    getAll: async (params) => {
        const response = await api.get('/transactions/', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/transactions/${id}/`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/transactions/', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/transactions/${id}/`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/transactions/${id}/`);
        return response.data;
    },

    // Additional Endpoints
    getStats: async (params) => {
        const response = await api.get('/transactions/stats/', { params });
        return response.data;
    },

    getRecent: async () => {
        const response = await api.get('/transactions/recent/');
        return response.data;
    },

    getTrends: async () => {
        const response = await api.get('/transactions/trends/');
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/transactions/categories/');
        return response.data;
    },

    bulkDelete: async (ids) => {
        const response = await api.delete('/transactions/bulk_delete/', { data: { ids } });
        return response.data;
    }
};

export default transactionService;
