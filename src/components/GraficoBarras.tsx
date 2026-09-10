// ============================================
// src/components/GraficoBarras.tsx
// ============================================

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '../hooks/useTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GraficoBarrasProps {
  dados: { label: string; valor: number; cor?: string }[];
  titulo: string;
  labelY?: string;
}

export const GraficoBarras = ({ dados, titulo, labelY = 'Quantidade' }: GraficoBarrasProps) => {
  const { isDark } = useTheme();
  const textColor = isDark ? '#ffffff' : '#1e293b'; // ✅ DINÂMICO
  const gridColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
            return `${context.parsed.y} notificações`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: labelY,
          color: textColor, // ✅ DINÂMICO
          font: { weight: 'bold' as const, size: 12 },
        },
        ticks: {
          color: textColor, // ✅ DINÂMICO
          font: { weight: 'bold' as const, size: 11 },
        },
        grid: {
          color: gridColor, // ✅ DINÂMICO
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: textColor, // ✅ DINÂMICO
          font: { weight: 'bold' as const, size: 11 },
          maxRotation: 45,
          minRotation: 30,
        },
      },
    },
  };

  const coresBarras = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#22d3ee', '#fb923c'];

  const data = {
    labels: dados.map((d) => d.label),
    datasets: [
      {
        data: dados.map((d) => d.valor),
        backgroundColor: dados.map((d, i) => d.cor || coresBarras[i % coresBarras.length]),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default GraficoBarras;