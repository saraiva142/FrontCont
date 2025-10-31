export const getTaxDeadlines = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const deadlines = [
    {
      name: 'DAS (Simples Nacional)',
      description: 'Pagamento mensal do Simples Nacional',
      dueDate: `${currentYear}-${String(currentMonth).padStart(2, '0')}-20T23:59:59`,
      amount: 'Variável conforme faturamento',
      priority: 'high',
      type: 'payment'
    },
    {
      name: 'DIRF',
      description: 'Declaração do Imposto de Renda Retido na Fonte',
      dueDate: `${currentYear}-02-28T23:59:59`,
      amount: 'Não se aplica',
      priority: 'high', 
      type: 'declaration'
    },
    {
      name: 'DCTF',
      description: 'Declaração de Débitos Tributários Federais',
      dueDate: `${currentYear}-${String(currentMonth).padStart(2, '0')}-15T23:59:59`,
      amount: 'Não se aplica',
      priority: 'medium',
      type: 'declaration'
    },
    {
      name: 'EFD Contribuições',
      description: 'Escrituração Fiscal Digital de Contribuições',
      dueDate: `${currentYear}-${String(currentMonth).padStart(2, '0')}-15T23:59:59`,
      amount: 'Não se aplica',
      priority: 'medium',
      type: 'declaration'
    }
  ];

  // Filtrar apenas prazos futuros ou do mês atual
  return deadlines.filter(deadline => {
    const dueDate = new Date(deadline.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    
    return daysDiff >= -7; // Mostrar prazos que vencem em até 7 dias
  });
};

export const getUpcomingDeadlines = () => {
  const deadlines = getTaxDeadlines();
  const now = new Date();
  
  return deadlines
    .filter(deadline => {
      const dueDate = new Date(deadline.dueDate);
      return dueDate > now;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);
};