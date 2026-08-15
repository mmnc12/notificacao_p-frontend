// ============================================
// src/components/FiltrosNotificacoes.tsx
// ============================================

import { useState, useEffect } from 'react';
import type { NotificacaoFiltros } from '../api/notificacoes';
import { localidadesApi, type Localidade } from '../api/localidades';

interface FiltrosNotificacoesProps {
  onFiltrar: (filtros: NotificacaoFiltros) => void;
  onLimpar: () => void;
}

export const FiltrosNotificacoes = ({ onFiltrar, onLimpar }: FiltrosNotificacoesProps) => {
  const [nome, setNome] = useState('');
  const [localidadeId, setLocalidadeId] = useState('');
  const [status, setStatus] = useState('');
  const [ano, setAno] = useState('');
  const [localidades, setLocalidades] = useState<Localidade[]>([]);
  const [loadingLocalidades, setLoadingLocalidades] = useState(true);

  // Carregar localidades da API
  useEffect(() => {
    const carregarLocalidades = async () => {
      try {
        const data = await localidadesApi.listar();
        setLocalidades(data);
      } catch (error) {
        console.error('Erro ao carregar localidades:', error);
      } finally {
        setLoadingLocalidades(false);
      }
    };
    carregarLocalidades();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filtros: NotificacaoFiltros = {};
    
    if (nome) filtros.nome = nome;
    if (localidadeId) filtros.localidade_id = parseInt(localidadeId);
    if (status) filtros.status = status as 'ATIVO' | 'INATIVO';
    if (ano) filtros.ano = parseInt(ano);
    
    onFiltrar(filtros);
  };

  const handleLimpar = () => {
    setNome('');
    setLocalidadeId('');
    setStatus('');
    setAno('');
    onLimpar();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 border border-slate-200 dark:border-slate-700 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Nome */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Nome do Paciente
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
          />
        </div>

        {/* Localidade */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Localidade
          </label>
          <select
            value={localidadeId}
            onChange={(e) => setLocalidadeId(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
            disabled={loadingLocalidades}
          >
            <option value="">Todas</option>
            {localidades.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.nome_localidade}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Todos</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>

        {/* Ano */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Ano
          </label>
          <select
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Todos</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>

        {/* Botões */}
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg shadow-md shadow-emerald-500/30 transition-all"
          >
            🔍 Filtrar
          </button>
          <button
            type="button"
            onClick={handleLimpar}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-all"
          >
            Limpar
          </button>
        </div>
      </div>
    </form>
  );
};