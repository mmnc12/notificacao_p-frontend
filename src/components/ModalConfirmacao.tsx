// ============================================
// src/components/ModalConfirmacao.tsx
// ============================================

interface ModalConfirmacaoProps {
  isOpen: boolean;
  titulo: string;
  mensagem: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ModalConfirmacao = ({
  isOpen,
  titulo,
  mensagem,
  onConfirm,
  onCancel,
  loading = false,
}: ModalConfirmacaoProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          {titulo}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          {mensagem}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md shadow-red-500/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
};