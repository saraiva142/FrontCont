import { useState, useEffect } from 'react';
import { analysisAPI } from '../services/api.js';
import { generateSummaryPDF } from '../services/pdfGenerator.js'; // ← IMPORT ADICIONADA
import TaxReminders from './TaxReminders.jsx';

const FinancialCharts = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last-30-days');

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const data = await analysisAPI.getHistory();
      setAnalyses(data);
    } catch (error) {
      console.error('Error loading analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar dados por categoria e mês
  const getChartData = () => {
    const categories = {};
    const monthlyData = {};
    
    analyses.forEach(analysis => {
      const date = new Date(analysis.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      // Por categoria
      if (!categories[analysis.category]) {
        categories[analysis.category] = 0;
      }
      categories[analysis.category] += analysis.amount;
      
      // Por mês
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { receitas: 0, despesas: 0 };
      }
      
      // Simplificação: considerar valores positivos como receita
      monthlyData[monthYear].receitas += analysis.amount;
    });

    return { categories, monthlyData };
  };

  const { categories, monthlyData } = getChartData();

  if (loading) {
    return <div className="card">Carregando gráficos...</div>;
  }

  if (analyses.length === 0) {
    return (
      <div className="card text-center">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
        <h3>Nenhum dado para análise</h3>
        <p style={{ color: '#64748b' }}>Faça algumas análises para ver os gráficos.</p>
      </div>
    );
  }

  return (
    <div>
      {/* CABEÇALHO COM BOTÃO PDF - NOVA SEÇÃO ADICIONADA */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600' 
        }}>
          📊 Análises e Gráficos
        </h2>
        <button
          onClick={() => generateSummaryPDF(analyses)}
          className="btn btn-secondary"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.75rem 1.5rem'
          }}
        >
          📄 Gerar Relatório PDF
        </button>
      </div>

      {/* CONTEÚDO DOS GRÁFICOS (mantido igual) */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '2rem' }}>
        {/* Gráfico de Categorias */}
        <div className="card">
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>📈 Distribuição por Categoria</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem' }}>
            {Object.entries(categories).map(([category, amount], index) => {
              const maxAmount = Math.max(...Object.values(categories));
              const height = (amount / maxAmount) * 200;
              
              return (
                <div key={category} style={{ textAlign: 'center', flex: 1 }}>
                  <div
                    style={{
                      height: `${height}px`,
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                      borderRadius: '4px 4px 0 0',
                      minHeight: '20px'
                    }}
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: '500' }}>
                    {category}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    R$ {(amount / 1000).toFixed(0)}k
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfico de Evolução Mensal */}
        <div className="card">
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>📅 Evolução Mensal</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '0.5rem', padding: '1rem' }}>
            {Object.entries(monthlyData).map(([month, data], index) => {
              const maxReceita = Math.max(...Object.values(monthlyData).map(m => m.receitas));
              const height = (data.receitas / maxReceita) * 200;
              
              return (
                <div key={month} style={{ textAlign: 'center', flex: 1 }}>
                  <div
                    style={{
                      height: `${height}px`,
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px 4px 0 0',
                      minHeight: '20px'
                    }}
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', fontWeight: '500' }}>
                    {month}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                    R$ {(data.receitas / 1000).toFixed(0)}k
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="card lg:col-span-2">
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>💰 Resumo Financeiro</h3>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Analisado</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#059669' }}>
                R$ {analyses.reduce((sum, a) => sum + a.amount, 0).toLocaleString('pt-BR')}
              </div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Operações</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0369a1' }}>
                {analyses.length}
              </div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Categorias</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#d97706' }}>
                {Object.keys(categories).length}
              </div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Impostos Estimados</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>
                R$ {analyses.reduce((sum, a) => sum + (a.taxes?.simplesNacional?.valor || 0), 0).toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        <div>
            <TaxReminders />
        </div>
        
      </div>
    </div>
  );
};

export default FinancialCharts;