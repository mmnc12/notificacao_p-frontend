// ============================================
// src/pages/Notificacoes/index.tsx
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // ← ADICIONAR
import { Layout } from '../../components/Layout';
import { TabelaNotificacoes } from '../../components/TabelaNotificacoes';
import { FiltrosNotificacoes } from '../../components/FiltrosNotificacoes';
import { notificacoesApi } from '../../api/notificacoes';
import type { Notificacao, NotificacaoFiltros } from '../../api/notificacoes';

const Notificacoes = () => {
  const navigate = useNavigate();  // ← ADICIONAR
  const [dados, setDados] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarNotificacoes = async (filtros?: NotificacaoFiltros) => {
    setLoading(true);
    try {
      const data = await notificacoesApi.listar(filtros);
      setDados(data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await carregarNotificacoes();
    };
    fetchData();
  }, []);

  const handleFiltrar = (filtros: NotificacaoFiltros) => {
    carregarNotificacoes(filtros);
  };

  const handleLimpar = () => {
    carregarNotificacoes();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Notificações
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gerencie todas as notificações de arboviroses
            </p>
          </div>
          <button
            onClick={() => navigate('/notificacoes/novo')}  // ← AGORA FUNCIONA
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-md shadow-emerald-500/30 transition-all"
          >
            + Nova Notificação
          </button>
        </div>

        <FiltrosNotificacoes onFiltrar={handleFiltrar} onLimpar={handleLimpar} />

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <TabelaNotificacoes dados={dados} loading={loading} />
        </div>
      </div>
    </Layout>
  );
};

export default Notificacoes;