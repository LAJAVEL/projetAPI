import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Sera surchargé par l'URL Docker si besoin
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;