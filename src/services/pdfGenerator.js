import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateAnalysisPDF = async (analysis, elementId = 'analysis-result') => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error('Elemento não encontrado para gerar PDF');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`relatorio-financeiro-${analysis.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};

export const generateSummaryPDF = async (analyses) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let yPosition = 20;

  // Cabeçalho
  pdf.setFontSize(20);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Relatório Financeiro - Resumo Executivo', 20, yPosition);
  yPosition += 15;

  // Data de emissão
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Emitido em: ${new Date().toLocaleDateString('pt-BR')}`, 20, yPosition);
  yPosition += 20;

  // Resumo
  pdf.setFontSize(16);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Resumo Geral', 20, yPosition);
  yPosition += 10;

  const totalAmount = analyses.reduce((sum, a) => sum + a.amount, 0);
  const totalTaxes = analyses.reduce((sum, a) => sum + (a.taxes?.simplesNacional?.valor || 0), 0);

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Total de Operações: ${analyses.length}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Valor Total Analisado: R$ ${totalAmount.toLocaleString('pt-BR')}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Impostos Estimados: R$ ${totalTaxes.toLocaleString('pt-BR')}`, 20, yPosition);
  yPosition += 15;

  // Análises recentes
  pdf.setFontSize(14);
  pdf.setTextColor(44, 62, 80);
  pdf.text('Últimas Análises', 20, yPosition);
  yPosition += 10;

  analyses.slice(0, 10).forEach((analysis, index) => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${analysis.title}`, 25, yPosition);
    yPosition += 5;
    pdf.text(`   Valor: R$ ${analysis.amount.toLocaleString('pt-BR')} | Categoria: ${analysis.category}`, 25, yPosition);
    yPosition += 5;
    pdf.text(`   Data: ${new Date(analysis.created_at).toLocaleDateString('pt-BR')}`, 25, yPosition);
    yPosition += 8;
  });

  pdf.save('relatorio-financeiro-resumo.pdf');
};