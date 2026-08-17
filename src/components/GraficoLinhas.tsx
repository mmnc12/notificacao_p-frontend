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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GraficoLinhasProps {
  dados: { label: string; total: number; positivos: number }[];
  titulo: string;
}

export const GraficoLinhas = ({ dados, titulo }: GraficoLinhasProps) => {
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
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Formatar os labels para exibir mês/ano
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
        borderColor: '#1a3a6b',
        backgroundColor: 'rgba(26, 58, 107, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#1a3a6b',
      },
      {
        label: 'Casos Positivos',
        data: dados.map((d) => d.positivos),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#dc2626',
      },
    ],
  };

  return <Line options={options} data={data} />;
};