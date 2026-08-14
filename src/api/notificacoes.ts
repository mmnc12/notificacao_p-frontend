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
  latitude: number | null;
  longitude: number | null;
  link_google_earth: string | null;
  dt_notificacao: string;
  dt_recebimento: string;
  status: 'ATIVO' | 'INATIVO';
  suspeita_dengue: boolean;
  suspeita_zika: boolean;
  suspeita_chikungunya: boolean;
  resultado: 'POSITIVO' | 'NEGATIVO' | 'INCONCLUSIVO' | 'AGUARDANDO';
  dt_resultado: string | null;
  bloqueio_realizado: boolean;
  dt_bloqueio: string | null;
  observacoes_bloqueio: string | null;
  observacoes: string | null;
}

export interface NotificacaoInput {
  dt_primeiros_sintomas: string;
  nome_paciente: string;
  nome_mae: string;
  endereco?: string;
  endereco_completo?: string;
  localidade_id: number;
  latitude?: number;
  longitude?: number;
  link_google_earth?: string;
  dt_notificacao: string;
  dt_recebimento: string;
  suspeita_dengue: boolean;
  suspeita_zika: boolean;
  suspeita_chikungunya: boolean;
  resultado?: 'POSITIVO' | 'NEGATIVO' | 'INCONCLUSIVO' | 'AGUARDANDO';
  dt_resultado?: string;
  observacoes?: string;
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
  suspeita_dengue?: boolean;
  suspeita_zika?: boolean;
  suspeita_chikungunya?: boolean;
}

export const notificacoesApi = {
  // Listar com filtros
  async listar(filtros?: NotificacaoFiltros): Promise<Notificacao[]> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/notificacoes?${params.toString()}`);
    return response.data;
  },

  // Buscar por ID
  async buscarPorId(id: number): Promise<Notificacao> {
    const response = await api.get(`/notificacoes/${id}`);
    return response.data;
  },

  // Criar
  async criar(dados: NotificacaoInput): Promise<Notificacao> {
    const response = await api.post('/notificacoes', dados);
    return response.data;
  },

  // Atualizar
  async atualizar(id: number, dados: Partial<NotificacaoInput>): Promise<Notificacao> {
    const response = await api.put(`/notificacoes/${id}`, dados);
    return response.data;
  },

  // Deletar
  async deletar(id: number): Promise<void> {
    await api.delete(`/notificacoes/${id}`);
  },

  // Registrar bloqueio
  async registrarBloqueio(id: number, observacoes?: string): Promise<void> {
    await api.patch(`/notificacoes/${id}/bloqueio`, { observacoes });
  }
};