// ============================================
// src/context/AuthContext.ts
// ============================================

import { createContext } from 'react';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'ADMIN' | 'AGENTE' | 'USUARIO';
  status: string;
}

export interface AuthContextData {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// ✅ Contexto (não é um componente)
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);