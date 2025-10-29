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

      <div className="grid grid-cols-1" style={{ gap: '1.5rem' }}>
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
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.125rem' }}>
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
                  {analysis.financial_analysis?.saudeFinanceira && (
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      backgroundColor: analysis.financial_analysis.saudeFinanceira === 'ótima' ? '#dcfce7' : 
                                      analysis.financial_analysis.saudeFinanceira === 'boa' ? '#dbeafe' : 
                                      analysis.financial_analysis.saudeFinanceira === 'regular' ? '#fef3c7' : '#fee2e2',
                      color: analysis.financial_analysis.saudeFinanceira === 'ótima' ? '#166534' : 
                             analysis.financial_analysis.saudeFinanceira === 'boa' ? '#1e40af' : 
                             analysis.financial_analysis.saudeFinanceira === 'regular' ? '#92400e' : '#991b1b',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      Saúde: {analysis.financial_analysis.saudeFinanceira}
                    </span>
                  )}
                </div>
                {analysis.financial_analysis?.margemLucro && (
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                    Margem: {analysis.financial_analysis.margemLucro}
                  </div>
                )}
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
                  <div>Simples: R$ {analysis.taxes?.simplesNacional?.valor?.toFixed(2)}</div>
                  {analysis.taxes?.melhorRegime && (
                    <div style={{ fontWeight: '600', color: '#059669', marginTop: '0.25rem' }}>
                      Recomendado: {analysis.taxes.melhorRegime}
                    </div>
                  )}
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
                        {insight.length > 80 ? insight.substring(0, 80) + '...' : insight}
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
                fontSize: '0.75rem',
                borderLeft: '3px solid #3b82f6'
              }}>
                <strong>Resumo:</strong> {analysis.monthly_summary.length > 120 
                  ? analysis.monthly_summary.substring(0, 120) + '...' 
                  : analysis.monthly_summary}
              </div>
            )}

            {analysis.strategicInsights && analysis.strategicInsights.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '0.25rem', 
                  flexWrap: 'wrap',
                  fontSize: '0.7rem'
                }}>
                  {analysis.strategicInsights.slice(0, 3).map((insight, index) => (
                    <span key={index} style={{ 
                      padding: '0.125rem 0.375rem', 
                      backgroundColor: '#fffbeb', 
                      color: '#92400e',
                      borderRadius: '0.125rem',
                    }}>
                      💡
                    </span>
                  ))}
                  {analysis.strategicInsights.length > 3 && (
                    <span style={{ 
                      padding: '0.125rem 0.375rem', 
                      backgroundColor: '#f3f4f6', 
                      color: '#6b7280',
                      borderRadius: '0.125rem',
                      fontSize: '0.625rem'
                    }}>
                      +{analysis.strategicInsights.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisHistory;