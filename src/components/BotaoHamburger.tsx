// ============================================
// src/components/BotaoHamburger.tsx
// ============================================

interface BotaoHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
}

export const BotaoHamburger = ({ isOpen, onClick }: BotaoHamburgerProps) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      aria-label="Menu"
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <span className={`block h-0.5 w-full bg-slate-700 dark:bg-slate-300 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block h-0.5 w-full bg-slate-700 dark:bg-slate-300 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-full bg-slate-700 dark:bg-slate-300 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </div>
    </button>
  );
};