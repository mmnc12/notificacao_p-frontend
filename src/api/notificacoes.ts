// ============================================
// src/api/notificacoes.ts
// ============================================

import api from './api';

export interface Notificacao {
  id: number;
  dt_primeiros_sintomas: string;
  nome_paciente: string;
  nome_mae: string;
  endereco: string | null;
  localidade_id: number;
  localidade_nome?: string;
  dt_notificacao: string;
  dt_recebimento: string;
  status: 'ATIVO' | 'INATIVO';
  suspeita_dengue: boolean;
  suspeita_zika: boolean;
  suspeita_chikungunya: boolean;
  resultado: 'POSITIVO' | 'NEGATIVO' | 'INCONCLUSIVO' | 'AGUARDANDO';
  bloqueio_realizado: boolean;
}

export interface NotificacaoFiltros {
  nome?: string;
  localidade_id?: number;
  status?: 'ATIVO' | 'INATIVO';
  ano?: number;
  mes?: number;
  dataInicio?: string;
  dataFim?: string;
  resultado?: 'POSITIVO' | 'NEGATIVO' | 'INCONCLUSIVO' | 'AGUARDANDO';
}

export const notificacoesApi = {
  async listar(filtros?: NotificacaoFiltros): Promise<Notificacao[]> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/notificacoes?${params.toString()}`);
    return response.data;
  },

  async criar(dados: any): Promise<Notificacao> {
    const response = await api.post('/notificacoes', dados);
    return response.data;
  },
};