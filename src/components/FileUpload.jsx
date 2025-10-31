import { useState } from 'react';
import { analysisAPI } from '../services/api.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import { generateAnalysisPDF } from '../services/pdfGenerator.js';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        'text/plain',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (!allowedTypes.includes(selectedFile.type) && 
          !selectedFile.name.match(/\.(txt|xls|xlsx|csv)$/i)) {
        setError('Tipo de arquivo não suportado. Use TXT, XLS, XLSX ou CSV.');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file && !text.trim()) {
      setError('Por favor, selecione um arquivo ou digite algum texto.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let response;
      
      if (file) {
        response = await analysisAPI.uploadFile(file);
      } else {
        response = await analysisAPI.analyzeText(text);
      }

      setResult(response.analysis);
      setFile(null);
      setText('');
      
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError(err.message || 'Erro ao processar análise. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // No início do componente, adicione:
  console.log('🔍 DEBUG - Verificando seções:');
  console.log('documentation_guide:', result?.documentation_guide);
  console.log('practical_steps:', result?.practical_steps);
  console.log('legal_obligations:', result?.legal_obligations);
  console.log('best_practices:', result?.best_practices);
  console.log('strategic_insights:', result?.strategic_insights);
  console.log('financial_analysis:', result?.financial_analysis);
  console.log('alerts:', result?.alerts);
  return (
    <div className="grid grid-cols-1" style={{ gap: '2rem' }}>
      {/* Upload Form */}
      <div className="card">
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1rem' 
        }}>
          Consultoria Fiscal Completa
        </h2>
        
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Receba orientações práticas sobre impostos, documentação, recibos e obrigações legais com análise de IA avançada.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: '500', 
              marginBottom: '0.5rem' 
            }}>
              Upload de Arquivo
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept=".txt,.xls,.xlsx,.csv"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
              disabled={loading}
            />
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Formatos suportados: TXT, XLS, XLSX, CSV
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: '500', 
              marginBottom: '0.5rem' 
            }}>
              Ou descreva a operação financeira
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ex: Recebimento de R$ 50.000 para desenvolvimento de software, com R$ 5.000 para despesas de hosting. Venda de criptomoedas por US$ 1.200..."
              rows={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              disabled={loading}
            />
          </div>

          {error && (
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              color: '#dc2626',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? <LoadingSpinner size="small" /> : '📊 Obter Consultoria Completa'}
          </button>
        </form>
      </div>

      {/* Results - VERSÃO COMPLETA COM NOVAS SEÇÕES */}
      {result && (
        <div id="analysis-result" className="card">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🚀 {result.title}
          </h3>
          
          {/* Cabeçalho com informações principais */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  backgroundColor: '#dbeafe', 
                  color: '#1e40af',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {result.category}
                </span>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  backgroundColor: '#f0f9ff', 
                  color: '#0369a1',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {result.operation_type}
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Tipo: {result.operationType}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#059669' }}>
                R$ {result.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* SEÇÃO: ANÁLISE FINANCEIRA */}
          {result.financialAnalysis && (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📊 Análise Financeira
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Margem de Lucro:</div>
                  <div style={{ color: '#059669', fontWeight: '600' }}>{result.financialAnalysis.margemLucro}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Saúde Financeira:</div>
                  <div style={{ 
                    color: result.financialAnalysis.saudeFinanceira === 'ótima' ? '#059669' : 
                           result.financialAnalysis.saudeFinanceira === 'boa' ? '#3b82f6' : 
                           result.financialAnalysis.saudeFinanceira === 'regular' ? '#f59e0b' : '#dc2626',
                    fontWeight: '600'
                  }}>
                    {result.financialAnalysis.saudeFinanceira}
                  </div>
                </div>
              </div>

              {result.financialAnalysis.riscosIdentificados && result.financialAnalysis.riscosIdentificados.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Riscos Identificados:</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {result.financialAnalysis.riscosIdentificados.map((risco, index) => (
                      <span key={index} style={{ 
                        padding: '0.25rem 0.5rem', 
                        backgroundColor: '#fef2f2', 
                        color: '#dc2626',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem'
                      }}>
                        ⚠️ {risco}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.financialAnalysis.projecaoFluxoCaixa && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Projeção de Fluxo de Caixa:</div>
                  <div style={{ fontSize: '0.875rem' }}>{result.financialAnalysis.projecaoFluxoCaixa}</div>
                </div>
              )}
            </div>
          )}

          {/* SEÇÃO: IMPOSTOS COMPARADOS */}
          {result.taxes && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                💰 Otimização Tributária
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
                {/* Simples Nacional */}
                <div style={{ padding: '1rem', backgroundColor: '#faf5ff', borderRadius: '0.5rem', border: '1px solid #e9d5ff' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#7c3aed' }}>Simples Nacional</div>
                  <div style={{ fontSize: '0.875rem' }}>
                    <div>Valor: R$ {result.taxes.simplesNacional?.valor?.toFixed(2)}</div>
                    <div>Alíquota: {result.taxes.simplesNacional?.aliquota}</div>
                    {result.taxes.simplesNacional?.observacao && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                        {result.taxes.simplesNacional.observacao}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lucro Presumido */}
                <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#0369a1' }}>Lucro Presumido</div>
                  <div style={{ fontSize: '0.875rem' }}>
                    <div>IRPJ: R$ {result.taxes.lucroPresumido?.irpj?.toFixed(2)}</div>
                    <div>CSLL: R$ {result.taxes.lucroPresumido?.csll?.toFixed(2)}</div>
                    <div>PIS/COFINS: R$ {result.taxes.lucroPresumido?.pisCofins?.toFixed(2)}</div>
                    <div style={{ fontWeight: '600', marginTop: '0.25rem' }}>
                      Total: R$ {result.taxes.lucroPresumido?.total?.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Melhor Regime */}
                <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#059669' }}>💰 Recomendação</div>
                  <div style={{ fontSize: '0.875rem' }}>
                    <div><strong>{result.taxes.melhorRegime}</strong></div>
                    {result.taxes.economiaPotencial && (
                      <div style={{ color: '#059669', fontWeight: '600', marginTop: '0.5rem' }}>
                        {result.taxes.economiaPotencial}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO: GUIA DE DOCUMENTAÇÃO */}
          {result.documentation_guide && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📋 Guia de Documentação
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#faf5ff', borderRadius: '0.5rem', border: '1px solid #e9d5ff' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#7c3aed' }}>📄 Documentos Necessários</div>
                  <div style={{ fontSize: '0.875rem' }}>
                    {result.documentation_guide.reciboObrigatorio && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Recibo:</strong> {result.documentation_guide.tipoRecibo}
                      </div>
                    )}
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Nota Fiscal:</strong> {result.documentation_guide.notaFiscal}
                    </div>
                    {result.documentation_guide.documentosNecessarios && (
                      <div>
                        <strong>Outros:</strong>
                        <ul style={{ paddingLeft: '1rem', marginTop: '0.25rem' }}>
                          {result.documentation_guide.documentosNecessarios.map((doc, index) => (
                            <li key={index} style={{ fontSize: '0.75rem' }}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#0369a1' }}>📅 Prazos e Declarações</div>
                  <div style={{ fontSize: '0.875rem' }}>
                    {result.documentation_guide.declaracoes && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Declarações:</strong>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                          {result.documentation_guide.declaracoes.join(', ')}
                        </div>
                      </div>
                    )}
                    {result.documentation_guide.prazosImportantes && (
                      <div>
                        <strong>Prazos:</strong>
                        <ul style={{ paddingLeft: '1rem', marginTop: '0.25rem' }}>
                          {result.documentation_guide.prazosImportantes.map((prazo, index) => (
                            <li key={index} style={{ fontSize: '0.75rem' }}>{prazo}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO: PASSOS PRÁTICOS */}
          {result.practical_steps && result.practical_steps.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛠️ Passos Práticos Imediatos
              </h4>
              <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                <ol style={{ paddingLeft: '1.5rem' }}>
                  {result.practical_steps.map((step, index) => (
                    <li key={index} style={{ 
                      marginBottom: index < result.practical_steps.length - 1 ? '0.75rem' : '0',
                      padding: '0.75rem',
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      borderLeft: '4px solid #059669'
                    }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* SEÇÃO: OBRIGAÇÕES LEGAIS */}
          {result.legal_obligations && result.legal_obligations.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⚖️ Obrigações Legais
              </h4>
              <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
                {result.legal_obligations.map((obligation, index) => (
                  <div key={index} style={{ 
                    marginBottom: index < result.legal_obligations.length - 1 ? '0.5rem' : '0',
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span>📋</span>
                    <span>{obligation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO: MELHORES PRÁTICAS */}
          {result.best_practices && result.best_practices.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ✅ Melhores Práticas
              </h4>
              <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fcd34d' }}>
                {result.best_practices.map((practice, index) => (
                  <div key={index} style={{ 
                    marginBottom: index < result.best_practices.length - 1 ? '0.5rem' : '0',
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span>✅</span>
                    <span>{practice}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO: INSIGHTS ESTRATÉGICOS */}
          {result.strategic_insights && result.strategic_insights.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                💡 Insights Estratégicos
              </h4>
              <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fcd34d' }}>
                {result.strategic_insights.map((insight, index) => (
                  <div key={index} style={{ 
                    marginBottom: index < result.strategic_insights.length - 1 ? '0.75rem' : '0',
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    borderLeft: '4px solid #f59e0b',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span>💡</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO: ANÁLISE FINANCEIRA */}
          {result.financial_analysis && (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📊 Análise Financeira
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Margem de Lucro:</div>
                  <div style={{ color: '#059669', fontWeight: '600' }}>{result.financial_analysis.margemLucro}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Saúde Financeira:</div>
                  <div style={{ 
                    color: result.financial_analysis.saudeFinanceira === 'ótima' ? '#059669' : 
                          result.financial_analysis.saudeFinanceira === 'boa' ? '#3b82f6' : 
                          result.financial_analysis.saudeFinanceira === 'regular' ? '#f59e0b' : '#dc2626',
                    fontWeight: '600'
                  }}>
                    {result.financial_analysis.saudeFinanceira}
                  </div>
                </div>
              </div>

              {result.financial_analysis.riscosIdentificados && result.financial_analysis.riscosIdentificados.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Riscos Identificados:</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {result.financial_analysis.riscosIdentificados.map((risco, index) => (
                      <span key={index} style={{ 
                        padding: '0.25rem 0.5rem', 
                        backgroundColor: '#fef2f2', 
                        color: '#dc2626',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem'
                      }}>
                        ⚠️ {risco}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEÇÃO: ALERTAS CRÍTICOS */}
          {result.alerts && result.alerts.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🚨 Alertas Críticos
              </h4>
              <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
                {result.alerts.map((alert, index) => (
                  <div key={index} style={{ 
                    marginBottom: index < result.alerts.length - 1 ? '0.5rem' : '0',
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    borderRadius: '0.25rem',
                    borderLeft: '4px solid #dc2626',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span>⚠️</span>
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESUMO EXECUTIVO */}
          {result.monthlySummary && (
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#1e293b', 
              color: 'white',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem' // ← Adicione margin-bottom aqui
            }}>
              <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#f8fafc' }}>
                📋 Resumo Executivo
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                {result.monthlySummary}
              </p>
            </div>
          )}

          {/* BOTÃO DOWNLOAD PDF - ADICIONE ESTA SEÇÃO */}
          <div style={{ 
            marginTop: '2rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid #e5e7eb',
            display: 'flex', 
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => generateAnalysisPDF(result, 'analysis-result')}
              className="btn btn-secondary"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.75rem 1.5rem'
              }}
            >
              📄 Baixar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;