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

export const localidadesApi = {
  // Listar todas
  async listar(): Promise<Localidade[]> {
    const response = await api.get('/localidades');
    return response.data;
  }
};