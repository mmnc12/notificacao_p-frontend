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

export interface UsuarioInput {
  nome: string;
  email: string;
  senha?: string;
  tipo: string;
}

export interface AlterarSenhaInput {
  senha_atual: string;
  nova_senha: string;
  confirmar_senha: string;
}

export const usuarioApi = {
  async buscarPerfil(): Promise<Usuario> {
    const response = await api.get('/usuarios/perfil');
    return response.data;
  },

  async alterarSenha(dados: AlterarSenhaInput): Promise<{ message: string }> {
    const response = await api.put('/usuarios/alterar-senha', dados);
    return response.data;
  },

  async listarTodos(): Promise<Usuario[]> {
    const response = await api.get('/usuarios');
    return response.data;
  },

  async criar(dados: UsuarioInput): Promise<Usuario> {
    const response = await api.post('/usuarios', dados);
    return response.data;
  },

  async atualizar(id: number, dados: {
    nome: string;
    email: string;
    tipo: string;
    status?: string;
    senha?: string;
  }): Promise<Usuario> {
    const response = await api.put(`/usuarios/${id}`, dados);
    return response.data;
  },

  async atualizarStatus(id: number, status: string): Promise<{ message: string }> {
    const response = await api.patch(`/usuarios/${id}/status`, { status });
    return response.data;
  },

  async deletar(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
};