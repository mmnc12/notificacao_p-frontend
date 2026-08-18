// ============================================
// src/api/localidades.ts
// ============================================

import api from './api';

export interface Localidade {
  id: number;
  codigo: number | null;
  nome_localidade: string;
  descricao: string | null;
}

export interface LocalidadeInput {
  codigo?: number;
  nome_localidade: string;
  descricao?: string;
}

export const localidadesApi = {
  async listar(): Promise<Localidade[]> {
    const response = await api.get('/localidades');
    return response.data;
  },

  // ✅ ADICIONAR
  async criar(dados: LocalidadeInput): Promise<Localidade> {
    const response = await api.post('/localidades', dados);
    return response.data;
  },

  async atualizar(id: number, dados: LocalidadeInput): Promise<Localidade> {
    const response = await api.put(`/localidades/${id}`, dados);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/localidades/${id}`);
  },
};