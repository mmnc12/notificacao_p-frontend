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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GraficoBarrasProps {
  dados: { label: string; valor: number; cor?: string }[];
  titulo: string;
  labelY?: string;
}

export const GraficoBarras = ({ dados, titulo, labelY = 'Quantidade' }: GraficoBarrasProps) => {
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
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        color: '#0f172a', 
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#0f172a', 
        bodyColor: '#1e293b', 
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: labelY,
          color: '#0f172a',
          font: {
            weight: 'bold' as const,
            size: 12,
          },
        },
        ticks: {
          color: '#475569', 
        },
        grid: {
          color: '#e2e8f0', 
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#475569', 
        },
      },
    },
  };

  const data = {
    labels: dados.map((d) => d.label),
    datasets: [
      {
        data: dados.map((d) => d.valor),
        backgroundColor: dados.map((d) => d.cor || '#1a3a6b'),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default GraficoBarras;