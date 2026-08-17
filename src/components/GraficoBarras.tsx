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
        color: '#1a3a6b',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: labelY,
        },
      },
      x: {
        grid: {
          display: false,
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