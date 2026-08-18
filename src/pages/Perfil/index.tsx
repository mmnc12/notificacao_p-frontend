// ============================================
// src/pages/Perfil/index.tsx
// ============================================

import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { usuarioApi, type Usuario } from '../../api/usuario';
import { useAuth } from '../../hooks';

interface PerfilProps {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const Perfil = ({ showToast }: PerfilProps) => {
  const { usuario: usuarioAuth } = useAuth();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  // Estado do formulário de senha
  const [senhaForm, setSenhaForm] = useState({
    senha_atual: '',
    nova_senha: '',
    confirmar_senha: '',
  });

  // Carregar dados do perfil
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const data = await usuarioApi.buscarPerfil();
        setUsuario(data);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        showToast('❌ Erro ao carregar dados do perfil.', 'error');
      } finally {
        setLoading(false);
      }
    };
    carregarPerfil();
  }, []);

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSenhaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senhaForm.senha_atual || !senhaForm.nova_senha || !senhaForm.confirmar_senha) {
      showToast('❌ Preencha todos os campos de senha.', 'error');
      return;
    }

    if (senhaForm.nova_senha.length < 6) {
      showToast('❌ A nova senha deve ter pelo menos 6 caracteres.', 'error');
      return;
    }

    if (senhaForm.nova_senha !== senhaForm.confirmar_senha) {
      showToast('❌ As senhas não coincidem.', 'error');
      return;
    }

    setAlterandoSenha(true);
    try {
      await usuarioApi.alterarSenha({
        senha_atual: senhaForm.senha_atual,
        nova_senha: senhaForm.nova_senha,
        confirmar_senha: senhaForm.confirmar_senha,
      });
      showToast('✅ Senha alterada com sucesso!', 'success');
      setSenhaForm({
        senha_atual: '',
        nova_senha: '',
        confirmar_senha: '',
      });
    } catch (error: any) {
      const mensagem = error.response?.data?.error || 'Erro ao alterar senha.';
      showToast(`❌ ${mensagem}`, 'error');
    } finally {
      setAlterandoSenha(false);
    }
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500 dark:text-slate-400">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            👤 Meu Perfil
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerencie seus dados pessoais
          </p>
        </div>

        {/* Dados do Usuário */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Dados Pessoais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                Nome
              </label>
              <p className="text-slate-800 dark:text-white font-medium">
                {usuario?.nome || usuarioAuth?.nome || '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                E-mail
              </label>
              <p className="text-slate-800 dark:text-white font-medium">
                {usuario?.email || usuarioAuth?.email || '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                Tipo
              </label>
              <p className="text-slate-800 dark:text-white font-medium">
                {getTipoLabel(usuario?.tipo || usuarioAuth?.tipo || 'USUARIO')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                Status
              </label>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                usuario?.status === 'ATIVO' || usuarioAuth?.status === 'ATIVO'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {usuario?.status || usuarioAuth?.status || 'ATIVO'}
              </span>
            </div>
          </div>
        </div>

        {/* Alterar Senha */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            🔒 Alterar Senha
          </h2>
          <form onSubmit={handleAlterarSenha}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Senha Atual
                </label>
                <input
                  type="password"
                  name="senha_atual"
                  value={senhaForm.senha_atual}
                  onChange={handleSenhaChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Digite sua senha atual"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  name="nova_senha"
                  value={senhaForm.nova_senha}
                  onChange={handleSenhaChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Digite sua nova senha"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  name="confirmar_senha"
                  value={senhaForm.confirmar_senha}
                  onChange={handleSenhaChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Confirme sua nova senha"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={alterandoSenha}
              className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-md shadow-emerald-500/30 transition-all disabled:bg-emerald-300"
            >
              {alterandoSenha ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Perfil;