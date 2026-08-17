// ============================================
// src/services/exportacaoService.ts
// ============================================

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { Notificacao } from '../api/notificacoes';

// Função para formatar data
const formatarData = (data: string | null | undefined): string => {
  if (!data) return '-';
  const d = new Date(data);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('pt-BR');
};

// Função para obter as suspeitas
const getSuspeitas = (item: Notificacao): string => {
  const suspeitas = [];
  if (item.suspeita_dengue) suspeitas.push('Dengue');
  if (item.suspeita_zika) suspeitas.push('Zika');
  if (item.suspeita_chikungunya) suspeitas.push('Chikungunya');
  return suspeitas.join(', ') || 'Nenhuma';
};

export const exportacaoService = {
  /**
   * Exportar dados para Excel
   */
  async exportarExcel(dados: Notificacao[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório de Notificações');

    // Definir colunas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Paciente', key: 'nome_paciente', width: 30 },
      { header: 'Mãe', key: 'nome_mae', width: 30 },
      { header: 'Localidade', key: 'localidade_nome', width: 25 },
      { header: 'Endereço', key: 'endereco', width: 30 },
      { header: '1ºs Sintomas', key: 'dt_primeiros_sintomas', width: 15 },
      { header: 'Notificação', key: 'dt_notificacao', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Resultado', key: 'resultado', width: 15 },
      { header: 'Suspeitas', key: 'suspeitas', width: 25 },
      { header: 'Bloqueio', key: 'bloqueio', width: 12 },
    ];

    // Estilizar cabeçalho
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E3A8A' },
    };
    headerRow.alignment = { horizontal: 'center' };

    // Adicionar dados
    dados.forEach((item) => {
      worksheet.addRow({
        id: item.id,
        nome_paciente: item.nome_paciente,
        nome_mae: item.nome_mae,
        localidade_nome: item.localidade_nome || '-',
        endereco: item.endereco || '-',
        dt_primeiros_sintomas: formatarData(item.dt_primeiros_sintomas),
        dt_notificacao: formatarData(item.dt_notificacao),
        status: item.status,
        resultado: item.resultado || 'Aguardando',
        suspeitas: getSuspeitas(item),
        bloqueio: item.bloqueio_realizado ? 'Sim' : 'Não',
      });
    });

    // Gerar arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `relatorio_${new Date().toISOString().split('T')[0]}.xlsx`);
  },
};