import api from './api';

const budgetService = {
    // Get all budgets
    getAll: async () => {
        const response = await api.get('/budgets/');
        return response.data;
    },

    // Get a specific budget
    get: async (id) => {
        const response = await api.get(`/budgets/${id}/`);
        return response.data;
    },

    // Create a new budget
    create: async (budgetData) => {
        const response = await api.post('/budgets/', budgetData);
        return response.data;
    },

    // Update a budget
    update: async (id, budgetData) => {
        const response = await api.put(`/budgets/${id}/`, budgetData);
        return response.data;
    },

    // Delete a budget
    delete: async (id) => {
        const response = await api.delete(`/budgets/${id}/`);
        return response.data;
    },

    // Get budget summary
    getSummary: async () => {
        const response = await api.get('/budgets/summary/');
        return response.data;
    },
};

export default budgetService;

