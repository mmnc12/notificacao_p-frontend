// ============================================
// src/components/GraficoPizza.tsx
// ============================================

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GraficoPizzaProps {
  dados: { label: string; valor: number; cor?: string }[];
  titulo: string;
}

export const GraficoPizza = ({ dados, titulo }: GraficoPizzaProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          padding: 20,
          color: '#ffffff', // ✅ BRANCO
        },
      },
      title: {
        display: true,
        text: titulo,
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        color: '#ffffff', // ✅ BRANCO
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#0f172a',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed} notificações`;
          }
        }
      },
    },
    cutout: '60%',
  };

  // ✅ CORES MAIS CLARAS para o fundo escuro
  const cores = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#22d3ee', '#fb923c'];

  const data = {
    labels: dados.map((d) => d.label),
    datasets: [
      {
        data: dados.map((d) => d.valor),
        backgroundColor: dados.map((d, i) => d.cor || cores[i % cores.length]),
        borderWidth: 2,
        borderColor: '#1a3a6b', // ✅ Borda escura para contrastar
      },
    ],
  };

  return <Doughnut options={options} data={data} />;
};

export default GraficoPizza;