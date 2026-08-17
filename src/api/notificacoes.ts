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
  endereco_completo?: string | null;
  localidade_id: number;
  localidade_nome?: string;
  dt_notificacao: string;
  dt_recebimento?: string | null;
  status: 'ATIVO' | 'INATIVO';
  suspeita_dengue: boolean;
  suspeita_zika: boolean;
  suspeita_chikungunya: boolean;
  resultado: 'POSITIVO' | 'NEGATIVO' | 'INCONCLUSIVO' | 'AGUARDANDO';
  bloqueio_realizado: boolean;
  dt_resultado?: string | null;
  observacoes?: string | null;
  created_at?: string;
  updated_at?: string | null;
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
  page?: number;
  limit?: number;
}

export interface Paginacao {
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export interface ListaNotificacoesResponse {
  dados: Notificacao[];
  paginacao: Paginacao;
}

export type Resultado = 'POSITIVO' | 'NEGATIVO' | 'INCONCLUSIVO' | 'AGUARDANDO';

export interface NotificacaoInput {
  dt_primeiros_sintomas: string;
  nome_paciente: string;
  nome_mae: string;
  endereco?: string;
  localidade_id: number;
  dt_notificacao: string;
  dt_recebimento?: string | null;
  suspeita_dengue: boolean;
  suspeita_zika: boolean;
  suspeita_chikungunya: boolean;
  resultado?: Resultado;
  observacoes?: string;
}

export const notificacoesApi = {
  async listar(filtros?: NotificacaoFiltros): Promise<ListaNotificacoesResponse> {
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

  async buscarPorId(id: number): Promise<Notificacao> {
    const response = await api.get(`/notificacoes/${id}`);
    return response.data;
  },

  async criar(dados: NotificacaoInput): Promise<Notificacao> {
    const response = await api.post('/notificacoes', dados);
    return response.data;
  },

  async atualizar(id: number, dados: NotificacaoInput): Promise<Notificacao> {
    const response = await api.put(`/notificacoes/${id}`, dados);
    return response.data;
  },
};