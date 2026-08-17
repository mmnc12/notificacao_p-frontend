// ============================================
// src/pages/Dashboard/index.tsx
// ============================================

import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { CardEstatistica } from '../../components/CardEstatistica';
import { GraficoBarras } from '../../components/GraficoBarras';
import { GraficoPizza } from '../../components/GraficoPizza';
import { GraficoLinhas } from '../../components/GraficoLinhas';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardEstatisticas } from '../../services/dashboardService';

const Dashboard = () => {
  const [estatisticas, setEstatisticas] = useState<DashboardEstatisticas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await dashboardService.buscarEstatisticas();
        setEstatisticas(dados);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500 dark:text-slate-400">Carregando dados...</div>
        </div>
      </Layout>
    );
  }

  if (!estatisticas) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Erro ao carregar dados.</div>
        </div>
      </Layout>
    );
  }

  // Cores para os gráficos
  const coresLocalidade = ['#1a3a6b', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

  // Preparar dados para os gráficos
  const dadosLocalidade = estatisticas.porLocalidade.map((item, index) => ({
    label: item.localidade,
    valor: item.total,
    cor: coresLocalidade[index % coresLocalidade.length],
  }));

  const dadosStatus = [
    { label: 'Ativos', valor: estatisticas.ativos, cor: '#16a34a' },
    { label: 'Inativos', valor: estatisticas.inativos, cor: '#ca8a04' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            📊 Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Visão geral do sistema de notificações
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CardEstatistica
            titulo="Total de Notificações"
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

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras - Localidades */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
            <div className="h-64">
              <GraficoBarras
                dados={dadosLocalidade}
                titulo="Notificações por Localidade"
                labelY="Quantidade"
              />
            </div>
          </div>

          {/* Gráfico de Pizza - Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
            <div className="h-64">
              <GraficoPizza
                dados={dadosStatus}
                titulo="Distribuição por Status"
              />
            </div>
          </div>
        </div>

        {/* Gráfico de Linhas - Evolução Mensal */}
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <div className="h-64">
            <GraficoLinhas
              dados={estatisticas.porMes}
              titulo="Evolução Mensal de Notificações"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;