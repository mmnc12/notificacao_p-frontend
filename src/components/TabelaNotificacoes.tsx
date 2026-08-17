// ============================================
// src/components/TabelaNotificacoes.tsx
// ============================================

import { useNavigate } from 'react-router-dom';
import type { Notificacao } from '../api/notificacoes';

interface TabelaNotificacoesProps {
  dados: Notificacao[];
  loading: boolean;
  onDelete?: (id: number) => void;
}

export const TabelaNotificacoes = ({ dados, loading, onDelete }: TabelaNotificacoesProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        Carregando notificações...
      </div>
    );
  }

  if (dados.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        Nenhuma notificação encontrada.
      </div>
    );
  }

  const formatarData = (data: string) => {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      ATIVO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      INATIVO: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Ano</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Paciente</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Mãe</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Localidade</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">1ºs Sintomas</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Ações</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((notificacao) => (
            <tr
              key={notificacao.id}
              className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                {new Date(notificacao.dt_primeiros_sintomas).getFullYear()}
              </td>
              <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                {notificacao.nome_paciente}
              </td>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                {notificacao.nome_mae}
              </td>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                {notificacao.localidade_nome || '-'}
              </td>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                {formatarData(notificacao.dt_primeiros_sintomas)}
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(notificacao.status)}`}>
                  {notificacao.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/notificacoes/${notificacao.id}/editar`)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete?.(notificacao.id)}
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
  );
};