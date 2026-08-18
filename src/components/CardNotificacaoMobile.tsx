// ============================================
// src/components/CardNotificacaoMobile.tsx
// ============================================

import { useNavigate } from 'react-router-dom';
import type { Notificacao } from '../api/notificacoes';

interface CardNotificacaoMobileProps {
  notificacao: Notificacao;
  onDelete?: (id: number) => void;
}

export const CardNotificacaoMobile = ({ notificacao, onDelete }: CardNotificacaoMobileProps) => {
  const navigate = useNavigate();

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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-3">
      {/* Cabeçalho do card */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            #{notificacao.id}
          </span>
          <h3 className="text-base font-semibold text-slate-800 dark:text-white">
            {notificacao.nome_paciente}
          </h3>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(notificacao.status)}`}>
          {notificacao.status}
        </span>
      </div>

      {/* Detalhes */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Mãe:</span>
          <span className="text-slate-700 dark:text-slate-300">{notificacao.nome_mae}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Localidade:</span>
          <span className="text-slate-700 dark:text-slate-300">{notificacao.localidade_nome || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">1ºs Sintomas:</span>
          <span className="text-slate-700 dark:text-slate-300">{formatarData(notificacao.dt_primeiros_sintomas)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Ano:</span>
          <span className="text-slate-700 dark:text-slate-300">{new Date(notificacao.dt_primeiros_sintomas).getFullYear()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Resultado:</span>
          <span className="text-slate-700 dark:text-slate-300">{notificacao.resultado || 'Aguardando'}</span>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => navigate(`/notificacoes/${notificacao.id}/editar`)}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete?.(notificacao.id)}
          className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
        >
          Deletar
        </button>
      </div>
    </div>
  );
};