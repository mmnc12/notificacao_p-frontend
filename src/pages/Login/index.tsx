// ============================================
// src/pages/Login/index.tsx
// ============================================

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [toastVisible, setToastVisible] = useState(false);
  
  // ✅ CORRIGIDO: Usar ReturnType<typeof setTimeout>
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mostrarToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    console.log('📝 mostrarToast - Mensagem:', message);
    console.log('📝 mostrarToast - Type:', type);
    
    // ✅ LIMPAR TIMER ANTERIOR
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    console.log('📝 mostrarToast - Toast visível!');
    
    // ✅ FECHAR APÓS 5 SEGUNDOS
    toastTimerRef.current = setTimeout(() => {
      console.log('📝 mostrarToast - Fechando Toast após 5 segundos');
      setToastVisible(false);
      toastTimerRef.current = null;
    }, 5000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('📝 handleSubmit - Chamado!');
    console.log('📝 Email:', email);
    console.log('📝 Senha:', senha ? '***' : 'vazia');

    if (!email || !senha) {
      mostrarToast('❌ Preencha todos os campos.', 'error');
      return;
    }

    realizarLogin();
  };

  const realizarLogin = async () => {
    console.log('📝 realizarLogin - Iniciando...');
    
    try {
      await login(email, senha);
      console.log('📝 realizarLogin - Sucesso!');
      navigate('/dashboard');
    } catch (err: unknown) {
      console.log('📝 realizarLogin - Erro:', err);
      
      let errorMessage = '❌ Erro ao fazer login. Tente novamente.';

      if (typeof err === 'object' && err !== null && 'response' in err) {
        const error = err as any;
        if (error.response?.status === 401) {
          errorMessage = error.response?.data?.error || '❌ Credenciais inválidas.';
        } else if (error.response?.data?.error) {
          errorMessage = `❌ ${error.response.data.error}`;
        }
      }

      console.log('📝 realizarLogin - Mensagem de erro:', errorMessage);
      
      // ✅ MOSTRAR TOAST APENAS UMA VEZ
      mostrarToast(errorMessage, 'error');
      
      // ✅ LIMPAR OS CAMPOS EM CASO DE ERRO
      setEmail('');
      setSenha('');
      document.getElementById('email')?.focus();
    }
  };

  return (
    <>
      {/* Toast */}
      {toastVisible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${
              toastType === 'error' ? 'bg-red-500' : 'bg-green-500'
            } mx-4`}
          >
            <span className="text-sm font-medium flex-1">{toastMessage}</span>
            <button
              onClick={() => {
                console.log('📝 Botão ✕ clicado!');
                if (toastTimerRef.current) {
                  clearTimeout(toastTimerRef.current);
                  toastTimerRef.current = null;
                }
                setToastVisible(false);
              }}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          {/* Ícone */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-4 shadow-lg shadow-emerald-500/20">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold text-slate-800 dark:text-white">
            Sistema de Notificação
          </h2>
          <h3 className="text-center text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            de Arboviroses
          </h3>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
            Faça login para acessar o sistema
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white transition-colors duration-200"
                placeholder="admin@sistema.com"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white transition-colors duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Carregando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-700 pt-4">
            Sistema de Notificação de Arboviroses v1.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;