// ============================================
// src/services/dashboardService.ts
// ============================================

import { notificacoesApi } from '../api/notificacoes';

export interface DashboardEstatisticas {
  total: number;
  ativos: number;
  inativos: number;
  positivos: number;
  negativos: number;
  aguardando: number;
  porLocalidade: {
    localidade: string;
    total: number;
  }[];
  porMes: {
    label: string;
    total: number;
    positivos: number;
  }[];
  porStatus: {
    status: string;
    total: number;
  }[];
}

export const dashboardService = {
  async buscarEstatisticas(): Promise<DashboardEstatisticas> {
    // Buscar todas as notificações (sem filtros)
    const response = await notificacoesApi.listar({ limit: 9999 });
    const dados = response.dados;

    // ============================================
    // ESTATÍSTICAS BÁSICAS
    // ============================================

    const total = dados.length;
    const ativos = dados.filter((n) => n.status === 'ATIVO').length;
    const inativos = dados.filter((n) => n.status === 'INATIVO').length;
    const positivos = dados.filter((n) => n.resultado === 'POSITIVO').length;
    const negativos = dados.filter((n) => n.resultado === 'NEGATIVO').length;
    const aguardando = dados.filter((n) => n.resultado === 'AGUARDANDO').length;

    // ============================================
    // POR LOCALIDADE
    // ============================================

    const localidadeMap = new Map<string, number>();
    dados.forEach((n) => {
      const nome = n.localidade_nome || 'Não informada';
      localidadeMap.set(nome, (localidadeMap.get(nome) || 0) + 1);
    });

    const porLocalidade = Array.from(localidadeMap.entries())
      .map(([localidade, total]) => ({ localidade, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // ============================================
    // POR MÊS (últimos 12 meses)
    // ============================================

    const mesMap = new Map<string, { total: number; positivos: number }>();

    dados.forEach((n) => {
      const data = new Date(n.dt_notificacao);
      const mes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;

      const existing = mesMap.get(mes) || { total: 0, positivos: 0 };
      existing.total += 1;
      if (n.resultado === 'POSITIVO') existing.positivos += 1;
      mesMap.set(mes, existing);
    });

    // Pegar os últimos 12 meses
    const mesesArray = Array.from(mesMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12);

    const porMes = mesesArray.map(([mes, dados]) => ({
      label: mes,
      total: dados.total,
      positivos: dados.positivos,
    }));

    // ============================================
    // POR STATUS
    // ============================================

    const porStatus = [
      { status: 'ATIVO', total: ativos },
      { status: 'INATIVO', total: inativos },
    ];

    return {
      total,
      ativos,
      inativos,
      positivos,
      negativos,
      aguardando,
      porLocalidade,
      porMes,
      porStatus,
    };
  },
};