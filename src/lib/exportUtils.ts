import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

interface ExportData {
  sales: any[];
  models: any[];
  options: any;
  summary: {
    totalSales: number;
    totalRevenue: number;
    averageTicket: number;
    topModel: string;
  };
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const exportToPDF = async (data: ExportData): Promise<void> => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Relatório Financeiro OnlyCat', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 20, 30);
  
  let yPosition = 50;

  // Summary Section
  if (data.options.includeSummary) {
    doc.setFontSize(16);
    doc.text('Resumo Executivo', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    const summaryData = [
      ['Total de Vendas', data.summary.totalSales.toString()],
      ['Receita Total', formatCurrency(data.summary.totalRevenue)],
      ['Ticket Médio', formatCurrency(data.summary.averageTicket)],
      ['Modelo Destaque', data.summary.topModel]
    ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Métrica', 'Valor']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Detailed Data
  if (data.options.includeDetailed && data.sales.length > 0) {
    doc.setFontSize(16);
    doc.text('Vendas Detalhadas', 20, yPosition);
    yPosition += 10;
    
    const tableData = data.sales.map(sale => {
      const model = data.models.find(m => m.id === sale.model_id);
      return [
        format(new Date(sale.created_at), 'dd/MM/yyyy', { locale: ptBR }),
        model?.name || 'N/A',
        sale.platform.charAt(0).toUpperCase() + sale.platform.slice(1),
        formatCurrency(sale.amount),
        formatCurrency(sale.admin_earnings),
        formatCurrency(sale.model_earnings)
      ];
    });
    
    doc.autoTable({
      startY: yPosition,
      head: [['Data', 'Modelo', 'Plataforma', 'Valor Total', 'Admin', 'Modelo']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 }
      }
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Página ${i} de ${pageCount} - OnlyCat Command Center`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Save
  const fileName = `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`;
  doc.save(fileName);
};

export const exportToExcel = async (data: ExportData): Promise<void> => {
  const workbook = XLSX.utils.book_new();

  // Summary Sheet
  if (data.options.includeSummary) {
    const summaryData = [
      ['Relatório Financeiro OnlyCat'],
      [`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`],
      [''],
      ['Resumo Executivo'],
      ['Total de Vendas', data.summary.totalSales],
      ['Receita Total', data.summary.totalRevenue],
      ['Ticket Médio', data.summary.averageTicket],
      ['Modelo Destaque', data.summary.topModel]
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Style the header
    summarySheet['A1'] = { v: 'Relatório Financeiro OnlyCat', t: 's', s: { font: { bold: true, sz: 16 } } };
    
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');
  }

  // Sales Detail Sheet
  if (data.options.includeDetailed && data.sales.length > 0) {
    const salesData = [
      ['Data', 'Modelo', 'Plataforma', 'Valor Total', 'Ganhos Admin', 'Ganhos Modelo', 'Taxa Plataforma'],
      ...data.sales.map(sale => {
        const model = data.models.find(m => m.id === sale.model_id);
        return [
          format(new Date(sale.created_at), 'dd/MM/yyyy', { locale: ptBR }),
          model?.name || 'N/A',
          sale.platform.charAt(0).toUpperCase() + sale.platform.slice(1),
          sale.amount,
          sale.admin_earnings,
          sale.model_earnings,
          sale.platform_fee
        ];
      })
    ];
    
    const salesSheet = XLSX.utils.aoa_to_sheet(salesData);
    
    // Auto-fit columns
    const cols = [
      { wch: 12 }, // Data
      { wch: 20 }, // Modelo
      { wch: 15 }, // Plataforma
      { wch: 15 }, // Valor Total
      { wch: 15 }, // Ganhos Admin
      { wch: 15 }, // Ganhos Modelo
      { wch: 15 }  // Taxa Plataforma
    ];
    salesSheet['!cols'] = cols;
    
    XLSX.utils.book_append_sheet(workbook, salesSheet, 'Vendas Detalhadas');
  }

  // Platform Summary Sheet
  const platformSummary = data.sales.reduce((acc, sale) => {
    if (!acc[sale.platform]) {
      acc[sale.platform] = { count: 0, revenue: 0 };
    }
    acc[sale.platform].count++;
    acc[sale.platform].revenue += sale.amount;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  const platformData = [
    ['Plataforma', 'Número de Vendas', 'Receita Total', 'Ticket Médio'],
    ...Object.entries(platformSummary).map(([platform, stats]) => [
      platform.charAt(0).toUpperCase() + platform.slice(1),
      stats.count,
      stats.revenue,
      stats.revenue / stats.count
    ])
  ];

  const platformSheet = XLSX.utils.aoa_to_sheet(platformData);
  XLSX.utils.book_append_sheet(workbook, platformSheet, 'Por Plataforma');

  // Save
  const fileName = `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd-HHmm')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportToCSV = async (data: ExportData): Promise<void> => {
  const headers = [
    'Data',
    'Modelo',
    'Plataforma',
    'Valor Total',
    'Ganhos Admin',
    'Ganhos Modelo',
    'Taxa Plataforma',
    'Observações'
  ];

  const csvData = [
    headers,
    ...data.sales.map(sale => {
      const model = data.models.find(m => m.id === sale.model_id);
      return [
        format(new Date(sale.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        model?.name || 'N/A',
        sale.platform.charAt(0).toUpperCase() + sale.platform.slice(1),
        sale.amount.toString(),
        sale.admin_earnings.toString(),
        sale.model_earnings.toString(),
        sale.platform_fee.toString(),
        sale.notes || ''
      ];
    })
  ];

  const csvContent = csvData
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
  const fileName = `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;
  
  saveAs(blob, fileName);
}; 