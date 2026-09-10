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
import { useTheme } from '../hooks/useTheme';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GraficoPizzaProps {
  dados: { label: string; valor: number; cor?: string }[];
  titulo: string;
}

export const GraficoPizza = ({ dados, titulo }: GraficoPizzaProps) => {
  const { isDark } = useTheme();
  const textColor = isDark ? '#ffffff' : '#1e293b'; // ✅ DINÂMICO
  const borderColor = isDark ? '#1a3a6b' : '#ffffff';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { size: 12, weight: 'bold' as const },
          padding: 20,
          color: textColor, // ✅ DINÂMICO
        },
      },
      title: {
        display: true,
        text: titulo,
        font: { size: 14, weight: 'bold' as const },
        color: textColor, // ✅ DINÂMICO
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

  const cores = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#22d3ee', '#fb923c'];

  const data = {
    labels: dados.map((d) => d.label),
    datasets: [
      {
        data: dados.map((d) => d.valor),
        backgroundColor: dados.map((d, i) => d.cor || cores[i % cores.length]),
        borderWidth: 2,
        borderColor: borderColor, // ✅ DINÂMICO
      },
    ],
  };

  return <Doughnut options={options} data={data} />;
};

export default GraficoPizza;