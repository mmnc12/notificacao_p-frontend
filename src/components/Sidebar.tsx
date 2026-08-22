// ============================================
// src/components/Sidebar.tsx
// ============================================

import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks';
import logo from '../assets/logo.png';

interface SidebarProps {
  onClose?: () => void;  // ← ADICIONAR
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const { usuario } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/notificacoes', label: 'Notificações', icon: '📋' },
    { path: '/localidades', label: 'Localidades', icon: '📍' },
    { path: '/relatorios', label: 'Relatórios', icon: '📄' },
    { path: '/perfil', label: 'Perfil', icon: '👤' },
    { path: '/sobre', label: 'Sobre', icon: 'ℹ️' },
  ];

  if (usuario?.tipo === 'ADMIN') {
    menuItems.push({ path: '/usuarios', label: 'Usuários', icon: '👥' });
  }

  // ✅ FECHAR SIDEBAR AO CLICAR EM UM LINK (mobile)
  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-shrink-0">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              Arboviroses
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sistema de Notificação
            </p>
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleLinkClick}  // ← FECHA AO CLICAR
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};