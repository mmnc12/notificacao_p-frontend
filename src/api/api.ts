// ============================================
// src/api/api.ts
// ============================================

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros (sem redirecionamento automático)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ APENAS REJEITAR O ERRO, NÃO REDIRECIONAR
    return Promise.reject(error);
  }
);

export default api;