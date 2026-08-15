// ============================================
// src/context/AuthProvider.tsx
// ============================================

import React, { useState } from 'react';
import type { ReactNode } from 'react';  // ← tipo
import api from '../api/api';
import { AuthContext } from './AuthContext';
import type { Usuario, AuthContextData } from './AuthContext';  // ← tipos

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

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
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { usuario, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      setUsuario(usuario);
    } catch (err: unknown) {
      const message = 
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as ApiError).response?.data?.error || 'Erro ao fazer login. Tente novamente.'
          : 'Erro ao fazer login. Tente novamente.';
      setError(message);
      
      const errorWithCause = new Error(message);
      if (err instanceof Error) {
        errorWithCause.cause = err;
      }
      throw errorWithCause;
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
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};