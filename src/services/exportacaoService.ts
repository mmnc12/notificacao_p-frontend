// ============================================
// src/services/exportacaoService.ts
// ============================================

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { Notificacao } from '../api/notificacoes';
import html2pdf from 'html2pdf.js';

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

const formatarData = (data: string | null | undefined): string => {
  if (!data) return '-';
  const d = new Date(data);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('pt-BR');
};

const getSuspeitas = (item: Notificacao): string => {
  const suspeitas = [];
  if (item.suspeita_dengue) suspeitas.push('Dengue');
  if (item.suspeita_zika) suspeitas.push('Zika');
  if (item.suspeita_chikungunya) suspeitas.push('Chikungunya');
  return suspeitas.join(', ') || 'Nenhuma';
};

// ============================================
// SERVIÇO DE EXPORTAÇÃO
// ============================================

export const exportacaoService = {
  async exportarExcel(dados: Notificacao[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório de Notificações');

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

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E3A8A' },
    };
    headerRow.alignment = { horizontal: 'center' };

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

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `relatorio_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  exportarCSV(dados: Notificacao[]): void {
    const BOM = '\uFEFF';
    const headers = [
      'ID', 'Paciente', 'Mãe', 'Localidade', 'Endereço',
      '1ºs Sintomas', 'Notificação', 'Status', 'Resultado',
      'Suspeitas', 'Bloqueio',
    ];

    let csv = BOM + headers.join(';') + '\n';

    dados.forEach((item) => {
      const suspeitas = getSuspeitas(item);
      const row = [
        item.id,
        `"${item.nome_paciente || ''}"`,
        `"${item.nome_mae || ''}"`,
        `"${item.localidade_nome || ''}"`,
        `"${item.endereco || ''}"`,
        formatarData(item.dt_primeiros_sintomas),
        formatarData(item.dt_notificacao),
        item.status,
        item.resultado || 'Aguardando',
        `"${suspeitas}"`,
        item.bloqueio_realizado ? 'Sim' : 'Não',
      ];
      csv += row.join(';') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  },

  exportarPDF(dados: Notificacao[]): void {
    try {
      // Criar o conteúdo HTML do PDF
      const conteudo = document.createElement('div');
      conteudo.style.padding = '30px 40px';
      conteudo.style.fontFamily = 'Arial, sans-serif';
      conteudo.style.backgroundColor = '#ffffff';

      // ============================================
      // CABEÇALHO COM LOGO E TÍTULOS CENTRALIZADOS
      // ============================================

      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'center';
      header.style.gap = '20px';
      header.style.borderBottom = '2px solid #1a3a6b';
      header.style.paddingBottom = '15px';
      header.style.marginBottom = '15px';
      header.style.flexWrap = 'wrap';

      // ✅ LOGO (lado esquerdo)
      const logoImg = document.createElement('img');
      logoImg.src = '/src/assets/logo.png';
      logoImg.style.width = '60px';
      logoImg.style.height = '60px';
      logoImg.style.objectFit = 'contain';
      logoImg.style.flexShrink = '0';
      header.appendChild(logoImg);

      // Títulos (centralizados)
      const titulosDiv = document.createElement('div');
      titulosDiv.style.display = 'flex';
      titulosDiv.style.flexDirection = 'column';
      titulosDiv.style.alignItems = 'center';
      titulosDiv.style.flex = '1';

      const titulo1 = document.createElement('div');
      titulo1.style.fontSize = '16px';
      titulo1.style.fontWeight = 'bold';
      titulo1.style.color = '#1a3a6b';
      titulo1.style.textTransform = 'uppercase';
      titulo1.textContent = 'PREFEITURA MUNICIPAL DE PINDOBAÇU';
      titulosDiv.appendChild(titulo1);

      const titulo2 = document.createElement('div');
      titulo2.style.fontSize = '14px';
      titulo2.style.fontWeight = 'bold';
      titulo2.style.color = '#1a3a6b';
      titulo2.textContent = 'SECRETARIA MUNICIPAL DE SAÚDE';
      titulosDiv.appendChild(titulo2);

      const titulo3 = document.createElement('div');
      titulo3.style.fontSize = '13px';
      titulo3.style.fontWeight = 'bold';
      titulo3.style.color = '#333';
      titulo3.textContent = 'SETOR DE ENDEMIAS';
      titulosDiv.appendChild(titulo3);

      header.appendChild(titulosDiv);

      // Espaço vazio para balancear
      const spacer = document.createElement('div');
      spacer.style.width = '60px';
      spacer.style.flexShrink = '0';
      header.appendChild(spacer);

      conteudo.appendChild(header);

      // ============================================
      // NÚMERO DO OFÍCIO E TÍTULO
      // ============================================

      const oficio = document.createElement('div');
      oficio.style.textAlign = 'center';
      oficio.style.fontSize = '11px';
      oficio.style.color = '#555';
      oficio.style.marginBottom = '5px';
      oficio.textContent = `Geral nº: ${new Date().getFullYear()}/${String(Math.floor(Math.random() * 9000) + 1000)} de ${new Date().toLocaleDateString('pt-BR')}`;
      conteudo.appendChild(oficio);

      const tituloRelatorio = document.createElement('h2');
      tituloRelatorio.style.textAlign = 'center';
      tituloRelatorio.style.color = '#1a3a6b';
      tituloRelatorio.style.fontSize = '16px';
      tituloRelatorio.style.marginBottom = '5px';
      tituloRelatorio.textContent = 'Relatório de Notificações de Arboviroses';
      conteudo.appendChild(tituloRelatorio);

      const totalInfo = document.createElement('p');
      totalInfo.style.textAlign = 'center';
      totalInfo.style.color = '#666';
      totalInfo.style.fontSize = '12px';
      totalInfo.style.marginBottom = '15px';
      totalInfo.textContent = `Total de registros: ${dados.length}`;
      conteudo.appendChild(totalInfo);

      // ============================================
      // TABELA DE DADOS
      // ============================================

      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.fontSize = '9px';
      table.style.marginTop = '10px';

      // Cabeçalho da tabela
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');

      const headers = ['Ano', 'Paciente', 'Mãe', 'Localidade', '1ºs Sintomas', 'Notificação', 'Status', 'Resultado'];

      headers.forEach((text) => {
        const th = document.createElement('th');
        th.style.padding = '5px 4px';
        th.style.backgroundColor = '#1a3a6b';
        th.style.color = 'white';
        th.style.fontWeight = 'bold';
        th.style.border = '1px solid #1a3a6b';
        th.style.fontSize = '8px';
        th.style.textAlign = 'center';
        th.textContent = text;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Corpo da tabela
      const tbody = document.createElement('tbody');
      dados.slice(0, 100).forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff';

        const formatarDataPDF = (data: string | null | undefined): string => {
          if (!data) return '-';
          const d = new Date(data);
          if (isNaN(d.getTime())) return '-';
          return d.toLocaleDateString('pt-BR');
        };

        const getStatusColor = (status: string): string => {
          return status === 'ATIVO' ? '#16a34a' : '#ca8a04';
        };

        const cells = [
          { text: new Date(item.dt_notificacao).getFullYear().toString() },
          { text: item.nome_paciente || '-' },
          { text: item.nome_mae || '-' },
          { text: item.localidade_nome || '-' },
          { text: formatarDataPDF(item.dt_primeiros_sintomas) },
          { text: formatarDataPDF(item.dt_notificacao) },
          {
            text: item.status || '-',
            color: getStatusColor(item.status),
            bold: true,
          },
          { text: item.resultado || 'Aguardando' },
        ];

        cells.forEach((cell) => {
          const td = document.createElement('td');
          td.style.padding = '4px 4px';
          td.style.border = '1px solid #ddd';
          td.style.textAlign = 'center';
          td.style.fontSize = '8px';
          if (cell.color) td.style.color = cell.color;
          if (cell.bold) td.style.fontWeight = 'bold';
          td.textContent = cell.text;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      conteudo.appendChild(table);

      // ============================================
      // RODAPÉ
      // ============================================

      const footer = document.createElement('div');
      footer.style.display = 'flex';
      footer.style.justifyContent = 'space-between';
      footer.style.marginTop = '15px';
      footer.style.paddingTop = '10px';
      footer.style.borderTop = '1px solid #ddd';
      footer.style.fontSize = '9px';
      footer.style.color = '#666';

      const footerLeft = document.createElement('span');
      footerLeft.textContent = 'Valores de notificação do Arboviroses - Setor de Endemias';

      const totalPaginas = Math.ceil(dados.length / 100) || 1;
      const footerRight = document.createElement('span');
      footerRight.textContent = `Página 1 de ${totalPaginas}`;

      footer.appendChild(footerLeft);
      footer.appendChild(footerRight);
      conteudo.appendChild(footer);

      // ============================================
      // GERAR PDF
      // ============================================

      const opt = {
        margin: 8,
        filename: `relatorio_${new Date().toISOString().split('T')[0]}.pdf`,
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait' as 'portrait' | 'landscape',
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      html2pdf().set(opt).from(conteudo).save();
      console.log('✅ PDF gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao exportar PDF:', error);
      alert('Erro ao gerar PDF. Verifique o console para mais detalhes.');
    }
  },
};