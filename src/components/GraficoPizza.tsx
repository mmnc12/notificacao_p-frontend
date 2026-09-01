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
          color: '#0f172a', 
        },
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
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
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

export default GraficoPizza;