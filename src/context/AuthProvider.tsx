// ============================================
// src/context/AuthProvider.tsx
// ============================================

import { useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api/api';
import { AuthContext } from './AuthContext';
import type { Usuario, AuthContextData } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const user = localStorage.getItem('usuario');
    if (user) {
      try {
        return JSON.parse(user);
      } catch {
        localStorage.removeItem('usuario');
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { usuario, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      setUsuario(usuario);
    } catch (err: unknown) {
      // ✅ SIMPLESMENTE RELANÇAR O ERRO
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  const value: AuthContextData = {
    usuario,
    isAuthenticated: !!usuario,
    isLoading,
    login,
    logout,
    error: null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};