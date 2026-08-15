// ============================================
// src/components/CardEstatistica.tsx
// ============================================

interface CardEstatisticaProps {
  titulo: string;
  valor: number | string;
  cor: string;
  icone: React.ReactNode;
}

export const CardEstatistica = ({ titulo, valor, cor, icone }: CardEstatisticaProps) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {titulo}
          </p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
            {valor}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${cor}`}>
          {icone}
        </div>
      </div>
    </div>
  );
};