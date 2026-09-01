// ============================================
// src/components/CardNotificacaoMobile.tsx
// ============================================

import { useNavigate } from 'react-router-dom';
import type { Notificacao } from '../api/notificacoes';
import { abrirGoogleMaps, temCoordenadas, formatarCoordenadas } from '../utils/mapaUtils';

interface CardNotificacaoMobileProps {
  notificacao: Notificacao;
  onDelete?: (id: number) => void;
}

export const CardNotificacaoMobile = ({ notificacao, onDelete }: CardNotificacaoMobileProps) => {
  const navigate = useNavigate();

  // ✅ CORRIGIDO: Formatar data (suporta ISO com T e YYYY-MM-DD)
  const formatarData = (data: string) => {
    if (!data) return '-';
    
    // Se a data estiver no formato ISO com T (ex: 2026-08-18T00:00:00.000Z)
    if (data.includes('T')) {
      const partes = data.split('T')[0].split('-');
      if (partes.length === 3) {
        const ano = partes[0];
        const mes = partes[1];
        const dia = partes[2];
        return `${dia}/${mes}/${ano}`;
      }
    }
    
    // Se já estiver no formato YYYY-MM-DD
    const partes = data.split('-');
    if (partes.length === 3) {
      const ano = partes[0];
      const mes = partes[1];
      const dia = partes[2];
      return `${dia}/${mes}/${ano}`;
    }
    
    return data;
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      ATIVO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      INATIVO: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-4 mb-3">
      {/* Cabeçalho com nome e status */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white text-lg">
            {notificacao.nome_paciente}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {notificacao.localidade_nome || 'Sem localidade'}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(notificacao.status)}`}>
          {notificacao.status}
        </span>
      </div>

      {/* Informações detalhadas */}
      <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 py-1">
          <span className="font-medium">Mãe:</span>
          <span>{notificacao.nome_mae}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 py-1">
          <span className="font-medium">1ºs Sintomas:</span>
          <span>{formatarData(notificacao.dt_primeiros_sintomas)}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 py-1">
          <span className="font-medium">Notificação:</span>
          <span>{formatarData(notificacao.dt_notificacao)}</span>
        </div>
        {notificacao.dt_recebimento && (
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 py-1">
            <span className="font-medium">Recebimento:</span>
            <span>{formatarData(notificacao.dt_recebimento)}</span>
          </div>
        )}
        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 py-1">
          <span className="font-medium">Resultado:</span>
          <span className="font-medium">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              notificacao.resultado === 'POSITIVO' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              notificacao.resultado === 'NEGATIVO' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              notificacao.resultado === 'INCONCLUSIVO' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400'
            }`}>
              {notificacao.resultado || 'AGUARDANDO'}
            </span>
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="font-medium">Localização:</span>
          {temCoordenadas(notificacao.latitude, notificacao.longitude) ? (
            <button
              onClick={() => abrirGoogleMaps(
                Number(notificacao.latitude),
                Number(notificacao.longitude)
              )}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              title={formatarCoordenadas(notificacao.latitude, notificacao.longitude)}
            >
              📍 Ver Mapa
            </button>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500">Sem coordenadas</span>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => navigate(`/notificacoes/${notificacao.id}/editar`)}
          className="flex-1 text-center py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete?.(notificacao.id)}
          className="flex-1 text-center py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
        >
          Deletar
        </button>
      </div>
    </div>
  );
};

export default CardNotificacaoMobile;