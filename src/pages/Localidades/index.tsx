// ============================================
// src/pages/Localidades/index.tsx
// ============================================

import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { localidadesApi, type Localidade, type LocalidadeInput } from '../../api/localidades';
import { ModalConfirmacao } from '../../components/ModalConfirmacao';
import { ModalLocalidade } from '../../components/ModalLocalidade';

interface LocalidadesProps {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const Localidades = ({ showToast }: LocalidadesProps) => {
  const [dados, setDados] = useState<Localidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [modalDeleteAberto, setModalDeleteAberto] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [idParaDeletar, setIdParaDeletar] = useState<number | null>(null);

  // ✅ ESTADOS DO MODAL DE CRIAÇÃO/EDIÇÃO
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [localidadeEditando, setLocalidadeEditando] = useState<Localidade | null>(null);

  const carregarLocalidades = async () => {
    setLoading(true);
    try {
      const data = await localidadesApi.listar();
      setDados(data);
    } catch {
      showToast('❌ Erro ao carregar localidades.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLocalidades();
  }, []);

  // ✅ FUNÇÃO PARA CRIAR LOCALIDADE
  const handleCriarLocalidade = async (dados: LocalidadeInput) => {
    setSalvando(true);
    try {
      await localidadesApi.criar(dados);
      setModalFormAberto(false);
      carregarLocalidades();
      showToast('✅ Localidade criada com sucesso!', 'success');
    } catch (error: any) {
      const mensagem = error.response?.data?.error || 'Erro ao criar localidade.';
      showToast(`❌ ${mensagem}`, 'error');
    } finally {
      setSalvando(false);
    }
  };

  // ✅ FUNÇÃO PARA ATUALIZAR LOCALIDADE
  const handleAtualizarLocalidade = async (dados: LocalidadeInput) => {
    if (!localidadeEditando) return;

    setSalvando(true);
    try {
      await localidadesApi.atualizar(localidadeEditando.id, dados);
      setModalFormAberto(false);
      setLocalidadeEditando(null);
      carregarLocalidades();
      showToast('✅ Localidade atualizada com sucesso!', 'success');
    } catch (error: any) {
      const mensagem = error.response?.data?.error || 'Erro ao atualizar localidade.';
      showToast(`❌ ${mensagem}`, 'error');
    } finally {
      setSalvando(false);
    }
  };

  // ✅ ABRIR MODAL PARA EDIÇÃO
  const handleEditarClick = (localidade: Localidade) => {
    setLocalidadeEditando(localidade);
    setModalFormAberto(true);
  };

  // ✅ ABRIR MODAL PARA CRIAÇÃO
  const handleCriarClick = () => {
    setLocalidadeEditando(null);
    setModalFormAberto(true);
  };

  // ✅ FECHAR MODAL
  const handleFecharModal = () => {
    setModalFormAberto(false);
    setLocalidadeEditando(null);
  };

  const localidadesFiltradas = dados.filter((item) =>
    item.nome_localidade.toLowerCase().includes(busca.toLowerCase())
  );

  const handleDeleteClick = (id: number) => {
    setIdParaDeletar(id);
    setModalDeleteAberto(true);
  };

  const handleConfirmDelete = async () => {
    if (!idParaDeletar) return;

    setDeletando(true);
    try {
      await localidadesApi.deletar(idParaDeletar);
      setModalDeleteAberto(false);
      setDeletando(false);
      setIdParaDeletar(null);
      carregarLocalidades();
      showToast('✅ Localidade excluída com sucesso!', 'success');
    } catch (error: any) {
      const mensagem = error.response?.data?.error || 'Erro ao excluir localidade.';
      showToast(`❌ ${mensagem}`, 'error');
      setDeletando(false);
      setModalDeleteAberto(false);
    }
  };

  const handleCancelDelete = () => {
    setModalDeleteAberto(false);
    setIdParaDeletar(null);
    setDeletando(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              📍 Localidades
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gerencie as localidades do sistema
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar localidade..."
              className="flex-1 sm:flex-none px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
            />
            <button
              onClick={handleCriarClick}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-md shadow-emerald-500/30 transition-all whitespace-nowrap"
            >
              + Nova
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          {loading ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              Carregando localidades...
            </div>
          ) : localidadesFiltradas.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              {busca ? 'Nenhuma localidade encontrada com este nome.' : 'Nenhuma localidade cadastrada.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Código</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Localidade</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Tipo</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {localidadesFiltradas.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {item.codigo || '-'}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {item.nome_localidade}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {item.descricao || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditarClick(item)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                          >
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO PARA DELETAR */}
      <ModalConfirmacao
        isOpen={modalDeleteAberto}
        titulo="Confirmar exclusão"
        mensagem="Tem certeza que deseja excluir esta localidade? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deletando}
      />

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      <ModalLocalidade
        isOpen={modalFormAberto}
        onClose={handleFecharModal}
        onSave={localidadeEditando ? handleAtualizarLocalidade : handleCriarLocalidade}
        localidade={localidadeEditando}
        titulo={localidadeEditando ? 'Editar Localidade' : 'Nova Localidade'}
        loading={salvando}
      />
    </Layout>
  );
};

export default Localidades;