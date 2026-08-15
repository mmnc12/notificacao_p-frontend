// ============================================
// src/hooks/useAuth.ts
// ============================================

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextData } from '../context/AuthContext'; 

// ✅ Hook (função, não é componente)
export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};