// ============================================
// src/pages/Notificacoes/index.tsx
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { TabelaNotificacoes } from '../../components/TabelaNotificacoes';
import { FiltrosNotificacoes } from '../../components/FiltrosNotificacoes';
import { Paginacao } from '../../components/Paginacao';
import { ModalConfirmacao } from '../../components/ModalConfirmacao';
import { notificacoesApi } from '../../api/notificacoes';
import type { Notificacao, NotificacaoFiltros } from '../../api/notificacoes';

const Notificacoes = () => {
  const navigate = useNavigate();
  const [dados, setDados] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [filtrosAplicados, setFiltrosAplicados] = useState<NotificacaoFiltros>({});

  // ✅ ESTADOS DO MODAL
  const [modalAberto, setModalAberto] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [idParaDeletar, setIdParaDeletar] = useState<number | null>(null);

  const carregarNotificacoes = async (filtros?: NotificacaoFiltros, paginaAtual: number = 1) => {
    setLoading(true);
    try {
      const response = await notificacoesApi.listar({
        ...filtros,
        page: paginaAtual,
        limit: 10,
      });
      setDados(response.dados);
      setTotalPaginas(response.paginacao.totalPaginas);
      setTotalRegistros(response.paginacao.total);
      setPagina(response.paginacao.pagina);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const handleFiltrar = (filtros: NotificacaoFiltros) => {
    setFiltrosAplicados(filtros);
    carregarNotificacoes(filtros, 1);
  };

  const handleLimpar = () => {
    setFiltrosAplicados({});
    carregarNotificacoes({}, 1);
  };

  const handlePaginaChange = (novaPagina: number) => {
    carregarNotificacoes(filtrosAplicados, novaPagina);
  };

  // ✅ FUNÇÃO PARA ABRIR MODAL DE CONFIRMAÇÃO
  const handleDeleteClick = (id: number) => {
    setIdParaDeletar(id);
    setModalAberto(true);
  };

  // ✅ FUNÇÃO PARA CONFIRMAR EXCLUSÃO
  const handleConfirmDelete = async () => {
    if (!idParaDeletar) return;

    setDeletando(true);
    try {
      await notificacoesApi.deletar(idParaDeletar);
      // Fechar modal
      setModalAberto(false);
      setDeletando(false);
      setIdParaDeletar(null);
      // Recarregar a lista (mantendo a página atual)
      carregarNotificacoes(filtrosAplicados, pagina);
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      setDeletando(false);
      setModalAberto(false);
    }
  };

  // ✅ FUNÇÃO PARA CANCELAR EXCLUSÃO
  const handleCancelDelete = () => {
    setModalAberto(false);
    setIdParaDeletar(null);
    setDeletando(false);
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
              {totalRegistros > 0 ? `Total: ${totalRegistros} notificações` : 'Gerencie todas as notificações de arboviroses'}
            </p>
          </div>
          <button
            onClick={() => navigate('/notificacoes/novo')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-md shadow-emerald-500/30 transition-all"
          >
            + Nova Notificação
          </button>
        </div>

        <FiltrosNotificacoes onFiltrar={handleFiltrar} onLimpar={handleLimpar} />

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <TabelaNotificacoes
            dados={dados}
            loading={loading}
            onDelete={handleDeleteClick}
          />
          <Paginacao
            paginaAtual={pagina}
            totalPaginas={totalPaginas}
            onPaginaChange={handlePaginaChange}
          />
        </div>
      </div>

      {/* ✅ MODAL DE CONFIRMAÇÃO */}
      <ModalConfirmacao
        isOpen={modalAberto}
        titulo="Confirmar exclusão"
        mensagem="Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deletando}
      />
    </Layout>
  );
};

export default Notificacoes;