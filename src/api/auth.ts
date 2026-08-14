// ============================================
// src/api/auth.ts
// ============================================

import api from './api';

interface LoginResponse {
  usuario: {
    id: number;
    nome: string;
    email: string;
    tipo: string;
    status: string;
  };
  token: string;
}

interface LoginData {
  email: string;
  senha: string;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  tipo?: 'ADMIN' | 'AGENTE' | 'USUARIO';
}

export const authApi = {
  // Login
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    
    // Salvar token e usuário no localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
    
    return response.data;
  },

  // Registrar
  async register(data: RegisterData) {
    const response = await api.post('/auth/registrar', data);
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  },

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Obter usuário atual
  getCurrentUser() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }
};