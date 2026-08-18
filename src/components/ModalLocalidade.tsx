// ============================================
// src/components/ModalLocalidade.tsx
// ============================================

import { useState, useEffect } from 'react';
import type { Localidade, LocalidadeInput } from '../api/localidades';

interface ModalLocalidadeProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dados: LocalidadeInput) => Promise<void>;
  localidade?: Localidade | null;
  titulo: string;
  loading?: boolean;
}

export const ModalLocalidade = ({
  isOpen,
  onClose,
  onSave,
  localidade,
  titulo,
  loading = false,
}: ModalLocalidadeProps) => {
  const [form, setForm] = useState<LocalidadeInput>({
    codigo: undefined,
    nome_localidade: '',
    descricao: '',
  });

  useEffect(() => {
    if (localidade) {
      setForm({
        codigo: localidade.codigo || undefined,
        nome_localidade: localidade.nome_localidade,
        descricao: localidade.descricao || '',
      });
    } else {
      setForm({
        codigo: undefined,
        nome_localidade: '',
        descricao: '',
      });
    }
  }, [localidade, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome_localidade.trim()) {
      alert('Nome da localidade é obrigatório.');
      return;
    }
    await onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
          {titulo}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Código
              </label>
              <input
                type="number"
                value={form.codigo || ''}
                onChange={(e) => setForm({ ...form, codigo: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                placeholder="Código da localidade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nome da Localidade *
              </label>
              <input
                type="text"
                value={form.nome_localidade}
                onChange={(e) => setForm({ ...form, nome_localidade: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                placeholder="Nome da localidade"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Descrição / Tipo
              </label>
              <input
                type="text"
                value={form.descricao || ''}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                placeholder="Ex: Bairro, Povoado, Fazenda..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-md shadow-emerald-500/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};