import api from './api';

const categoryService = {
    // Get all categories
    getAll: async () => {
        const response = await api.get('/categories/');
        // Handle paginated responses from DRF
        if (response.data && response.data.results) {
            return response.data.results;
        }
        return response.data;
    },

    // Get a specific category
    get: async (id) => {
        const response = await api.get(`/categories/${id}/`);
        return response.data;
    },

    // Create a new category
    create: async (categoryData) => {
        const response = await api.post('/categories/', categoryData);
        return response.data;
    },

    // Update a category
    update: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}/`, categoryData);
        return response.data;
    },

    // Delete a category
    delete: async (id) => {
        const response = await api.delete(`/categories/${id}/`);
        return response.data;
    },
};

export default categoryService;

