// ============================================
// src/components/Layout.tsx
// ============================================

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BotaoHamburger } from './BotaoHamburger';
import { useAuth } from '../hooks';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setSidebarAberta(!sidebarAberta);
  };

  const fecharSidebar = () => {
    setSidebarAberta(false);
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar - Desktop sempre visível, Mobile aparece com overlay */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarAberta ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={fecharSidebar} />
      </div>

      {/* Overlay - fecha sidebar ao clicar fora (apenas mobile) */}
      {sidebarAberta && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={fecharSidebar}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header mobile com botão hamburger e botão Sair */}
        <div className="lg:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <BotaoHamburger isOpen={sidebarAberta} onClick={toggleSidebar} />
            <span className="ml-3 text-sm font-semibold text-white">
              Arboviroses
            </span>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>

        {/* Header normal (desktop) */}
        <div className="hidden lg:block">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
};