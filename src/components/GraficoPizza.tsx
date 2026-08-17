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
          },
          padding: 20,
        },
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
    cutout: '60%',
  };

  const data = {
    labels: dados.map((d) => d.label),
    datasets: [
      {
        data: dados.map((d) => d.valor),
        backgroundColor: dados.map((d) => d.cor || '#1a3a6b'),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  return <Doughnut options={options} data={data} />;
};