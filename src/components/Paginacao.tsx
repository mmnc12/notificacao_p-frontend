// ============================================
// src/components/Paginacao.tsx
// ============================================

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  onPaginaChange: (pagina: number) => void;
}

export const Paginacao = ({ paginaAtual, totalPaginas, onPaginaChange }: PaginacaoProps) => {
  if (totalPaginas <= 1) return null;

  const handleAnterior = () => {
    if (paginaAtual > 1) onPaginaChange(paginaAtual - 1);
  };

  const handleProximo = () => {
    if (paginaAtual < totalPaginas) onPaginaChange(paginaAtual + 1);
  };

  return (
    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Página {paginaAtual} de {totalPaginas}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleAnterior}
          disabled={paginaAtual <= 1}
          className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          ← Anterior
        </button>
        <button
          onClick={handleProximo}
          disabled={paginaAtual >= totalPaginas}
          className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
};