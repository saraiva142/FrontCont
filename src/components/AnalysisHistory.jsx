import { useState, useEffect } from 'react';
import { analysisAPI } from '../services/api.js';
import LoadingSpinner from './LoadingSpinner.jsx';

const AnalysisHistory = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await analysisAPI.getHistory();
      setAnalyses(data);
    } catch (err) {
      setError('Erro ao carregar histórico');
      console.error('History load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <LoadingSpinner />
        <p style={{ marginTop: '1rem', color: '#64748b' }}>Carregando histórico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div style={{ color: '#dc2626', textAlign: 'center' }}>
          {error}
          <button 
            onClick={loadHistory}
            className="btn btn-secondary"
            style={{ marginTop: '1rem' }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="card text-center">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
        <h3 style={{ marginBottom: '0.5rem' }}>Nenhuma análise encontrada</h3>
        <p style={{ color: '#64748b' }}>
          Faça upload de arquivos ou analise textos para ver seu histórico aqui.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Histórico de Análises</h2>
        <button 
          onClick={loadHistory}
          className="btn btn-secondary"
        >
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
        {analyses.map((analysis) => (
          <div key={analysis.id} className="card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                  {analysis.title}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    backgroundColor: '#dbeafe', 
                    color: '#1e40af',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {analysis.category}
                  </span>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    backgroundColor: '#f0f9ff', 
                    color: '#0369a1',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {analysis.operation_type}
                  </span>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#059669' }}>
                  R$ {analysis.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {new Date(analysis.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Impostos
                </h4>
                <div style={{ fontSize: '0.75rem' }}>
                  <div>Simples: R$ {analysis.taxes?.simplesNacional?.toFixed(2)}</div>
                  <div>IRPJ: R$ {analysis.taxes?.irpj?.toFixed(2)}</div>
                  <div>CSLL: R$ {analysis.taxes?.csll?.toFixed(2)}</div>
                  <div style={{ fontWeight: '600' }}>
                    Total: R$ {analysis.taxes?.total?.toFixed(2)}
                  </div>
                </div>
              </div>
              
              {analysis.insights && analysis.insights.length > 0 && (
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Insights
                  </h4>
                  <ul style={{ fontSize: '0.75rem', paddingLeft: '1rem' }}>
                    {analysis.insights.slice(0, 2).map((insight, index) => (
                      <li key={index} style={{ marginBottom: '0.25rem' }}>
                        {insight.length > 100 ? insight.substring(0, 100) + '...' : insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {analysis.monthly_summary && (
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: '#f8fafc', 
                borderRadius: '0.25rem',
                fontSize: '0.75rem'
              }}>
                <strong>Resumo:</strong> {analysis.monthly_summary}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisHistory;