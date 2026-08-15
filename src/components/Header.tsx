// ============================================
// src/components/Header.tsx
// ============================================

import { useAuth } from '../hooks';

export const Header = () => {
  const { usuario, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-slate-800 dark:text-white">
            Sistema de Notificação
          </span>
          <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">
            v1.0
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {usuario?.nome || 'Usuário'}
          </span>
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};