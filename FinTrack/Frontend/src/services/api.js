import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
    (config) => {
        const publicEndpoints = ['/auth/register/', '/auth/login/', '/auth/refresh/'];
        const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

        if (!isPublicEndpoint) {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor — handle 401 (expired/invalid token)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            const isAuthEndpoint = ['/auth/login/', '/auth/refresh/', '/auth/register/']
                .some(endpoint => originalRequest.url?.includes(endpoint));

            if (refreshToken && !isAuthEndpoint) {
                try {
                    const response = await axios.post(
                        (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1') + '/auth/token/refresh/',
                        { refresh: refreshToken }
                    );

                    if (response.data.access) {
                        localStorage.setItem('access_token', response.data.access);
                        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                }
            }

            // If refresh fails or no token, logout
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            if (!isAuthEndpoint) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
