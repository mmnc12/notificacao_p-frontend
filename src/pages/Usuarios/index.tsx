// ============================================
// src/pages/Usuarios/index.tsx
// ============================================

import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { usuarioApi, type Usuario } from '../../api/usuario';
import { ModalConfirmacao } from '../../components/ModalConfirmacao';
import { ModalUsuario } from '../../components/ModalUsuario';

interface UsuariosProps {
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const Usuarios = ({ showToast }: UsuariosProps) => {
    const [dados, setDados] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [modalDeleteAberto, setModalDeleteAberto] = useState(false);
    const [deletando, setDeletando] = useState(false);
    const [idParaDeletar, setIdParaDeletar] = useState<number | null>(null);

    // Estados do modal de criação/edição
    const [modalFormAberto, setModalFormAberto] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

    const carregarUsuarios = async () => {
        setLoading(true);
        try {
            const data = await usuarioApi.listarTodos();
            setDados(data);
        } catch {
            showToast('❌ Erro ao carregar usuários.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const usuariosFiltrados = dados.filter((item) =>
        item.nome.toLowerCase().includes(busca.toLowerCase()) ||
        item.email.toLowerCase().includes(busca.toLowerCase())
    );

    // Abrir modal para criar
    const handleCriarClick = () => {
        setUsuarioEditando(null);
        setModalFormAberto(true);
    };

    // Abrir modal para editar
    const handleEditarClick = (usuario: Usuario) => {
        setUsuarioEditando(usuario);
        setModalFormAberto(true);
    };

    // Fechar modal
    const handleFecharModal = () => {
        setModalFormAberto(false);
        setUsuarioEditando(null);
    };

    // Salvar usuário (criar ou editar)
    const handleSalvarUsuario = async (dados: { nome: string; email: string; senha?: string; tipo: string }) => {
        
        setSalvando(true);
        try {
            if (usuarioEditando) {
                // ✅ EDIÇÃO
                await usuarioApi.atualizar(usuarioEditando.id, {
                    nome: dados.nome,
                    email: dados.email,
                    tipo: dados.tipo,
                    senha: dados.senha, // ← SENHA OPCIONAL
                });
                showToast('✅ Usuário atualizado com sucesso!', 'success');
            } else {
                // CRIAÇÃO
                await usuarioApi.criar(dados as any);
                showToast('✅ Usuário criado com sucesso!', 'success');
            }
            setModalFormAberto(false);
            setUsuarioEditando(null);
            carregarUsuarios();
        } catch (error: any) {
            const mensagem = error.response?.data?.error || 'Erro ao salvar usuário.';
            showToast(`❌ ${mensagem}`, 'error');
        } finally {
            setSalvando(false);
        }
    };

    // Deletar usuário
    const handleDeleteClick = (id: number) => {
        setIdParaDeletar(id);
        setModalDeleteAberto(true);
    };

    const handleConfirmDelete = async () => {
        if (!idParaDeletar) return;

        setDeletando(true);
        try {
            await usuarioApi.deletar(idParaDeletar);
            setModalDeleteAberto(false);
            setDeletando(false);
            setIdParaDeletar(null);
            carregarUsuarios();
            showToast('✅ Usuário excluído com sucesso!', 'success');
        } catch (error: any) {
            const mensagem = error.response?.data?.error || 'Erro ao excluir usuário.';
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

    // Tipo de usuário em português
    const getTipoLabel = (tipo: string) => {
        const tipos: Record<string, string> = {
            ADMIN: 'Administrador',
            AGENTE: 'Agente',
            USUARIO: 'Usuário',
        };
        return tipos[tipo] || tipo;
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                            👥 Usuários
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Gerencie os usuários do sistema
                        </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar usuário..."
                            className="flex-1 sm:flex-none px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                        />
                        <button
                            onClick={handleCriarClick}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-md shadow-emerald-500/30 transition-all whitespace-nowrap"
                        >
                            + Novo Usuário
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
                    {loading ? (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            Carregando usuários...
                        </div>
                    ) : usuariosFiltrados.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            {busca ? 'Nenhum usuário encontrado.' : 'Nenhum usuário cadastrado.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Nome</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">E-mail</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Tipo</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuariosFiltrados.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                                                {item.nome}
                                            </td>
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                                                {item.email}
                                            </td>
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                                                {getTipoLabel(item.tipo)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'ATIVO'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                    {item.status}
                                                </span>
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

            {/* Modal de confirmação para deletar */}
            <ModalConfirmacao
                isOpen={modalDeleteAberto}
                titulo="Confirmar exclusão"
                mensagem="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                loading={deletando}
            />

            {/* Modal de criação/edição */}
            <ModalUsuario
                isOpen={modalFormAberto}
                onClose={handleFecharModal}
                onSave={handleSalvarUsuario}
                usuario={usuarioEditando}
                titulo={usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
                loading={salvando}
            />
        </Layout>
    );
};

export default Usuarios;