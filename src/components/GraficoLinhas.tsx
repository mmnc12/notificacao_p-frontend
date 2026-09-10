// ============================================
// src/components/GraficoLinhas.tsx
// ============================================

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTheme } from '../hooks/useTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface GraficoLinhasProps {
  dados: { label: string; total: number; positivos: number }[];
  titulo: string;
}

export const GraficoLinhas = ({ dados, titulo }: GraficoLinhasProps) => {
  const { isDark } = useTheme();
  const textColor = isDark ? '#ffffff' : '#1e293b'; // ✅ DINÂMICO
  const gridColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
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
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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

  const labels = dados.map((d) => {
    const [ano, mes] = d.label.split('-');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${meses[parseInt(mes) - 1]}/${ano.slice(-2)}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Total de Notificações',
        data: dados.map((d) => d.total),
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#60a5fa',
        pointBorderColor: isDark ? '#ffffff' : '#1e293b',
        pointBorderWidth: 1.5,
      },
      {
        label: 'Casos Positivos',
        data: dados.map((d) => d.positivos),
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#f87171',
        pointBorderColor: isDark ? '#ffffff' : '#1e293b',
        pointBorderWidth: 1.5,
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default GraficoLinhas;