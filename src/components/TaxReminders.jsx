import { useState, useEffect } from 'react';

const TaxReminders = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeadlines();
  }, []);

  const loadDeadlines = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/reminders/tax-deadlines');
      const data = await response.json();
      setDeadlines(data);
    } catch (error) {
      console.error('Error loading deadlines:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  if (loading) {
    return <div className="card">Carregando prazos fiscais...</div>;
  }

  return (
    <div className="card">
      <h3 style={{ fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        🔔 Próximos Prazos Fiscais
      </h3>

      {deadlines.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
          Nenhum prazo fiscal próximo encontrado.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {deadlines.map((deadline, index) => {
            const daysUntilDue = getDaysUntilDue(deadline.dueDate);
            const isUrgent = daysUntilDue <= 3;
            
            return (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  backgroundColor: isUrgent ? '#fef2f2' : '#f8fafc',
                  borderRadius: '0.5rem',
                  border: `1px solid ${isUrgent ? '#fecaca' : '#e2e8f0'}`,
                  borderLeft: `4px solid ${getPriorityColor(deadline.priority)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{deadline.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{deadline.description}</div>
                  </div>
                  <div style={{ 
                    padding: '0.25rem 0.5rem', 
                    backgroundColor: isUrgent ? '#dc2626' : '#3b82f6',
                    color: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.7rem',
                    fontWeight: '500'
                  }}>
                    {daysUntilDue <= 0 ? 'VENCIDO' : `${daysUntilDue} dias`}
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                  <div>Vencimento: {new Date(deadline.dueDate).toLocaleDateString('pt-BR')}</div>
                  <div>Tipo: {deadline.type === 'payment' ? 'Pagamento' : 'Declaração'}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#0369a1' }}>
          💡 <strong>Dica:</strong> Configure lembretes no seu calendário para não perder prazos importantes.
        </div>
      </div>
    </div>
  );
};

export default TaxReminders;