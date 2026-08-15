// ============================================
// src/pages/Dashboard/index.tsx
// ============================================

import { Layout } from '../../components/Layout';
import { CardEstatistica } from '../../components/CardEstatistica';

const Dashboard = () => {
  const estatisticas = {
    total: 150,
    ativos: 80,
    inativos: 70,
    positivos: 45,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho da página */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Visão geral do sistema
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CardEstatistica
            titulo="Total"
            valor={estatisticas.total}
            cor="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            icone={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <CardEstatistica
            titulo="Ativos"
            valor={estatisticas.ativos}
            cor="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            icone={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <CardEstatistica
            titulo="Inativos"
            valor={estatisticas.inativos}
            cor="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
            icone={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <CardEstatistica
            titulo="Positivos"
            valor={estatisticas.positivos}
            cor="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            icone={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
        </div>

        {/* Área para tabela */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Últimas Notificações
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">
            Em breve: listagem de notificações
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;