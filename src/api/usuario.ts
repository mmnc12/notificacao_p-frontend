// ============================================
// src/api/usuario.ts
// ============================================

import api from './api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'ADMIN' | 'AGENTE' | 'USUARIO';
  status: string;
  created_at?: string;
}

export interface AlterarSenhaInput {
  senha_atual: string;
  nova_senha: string;
  confirmar_senha: string;
}

export const usuarioApi = {
  // Buscar dados do usuário atual
  async buscarPerfil(): Promise<Usuario> {
    const response = await api.get('/usuarios/perfil');
    return response.data;
  },

  // Alterar senha
  async alterarSenha(dados: AlterarSenhaInput): Promise<{ message: string }> {
    const response = await api.put('/usuarios/alterar-senha', dados);
    return response.data;
  },
};