import { useState } from 'react';
import { analysisAPI } from '../services/api.js';
import LoadingSpinner from './LoadingSpinner.jsx';

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
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (!allowedTypes.includes(selectedFile.type) && 
          !selectedFile.name.match(/\.(txt|pdf|xls|xlsx|csv)$/i)) {
        setError('Tipo de arquivo não suportado. Use TXT, PDF, XLS, XLSX ou CSV.');
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
      
      // Clear file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError(err.message || 'Erro ao processar análise. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1" style={{ gap: '2rem' }}>
      {/* Upload Form */}
      <div className="card">
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1rem' 
        }}>
          Análise Financeira
        </h2>
        
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Faça upload de arquivos (PDF, Excel, CSV) ou cole texto para análise automática de impostos e insights financeiros.
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
              accept=".txt,.pdf,.xls,.xlsx,.csv"
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
                Formatos suportados: CSV, XLS, XLSX (PDF temporariamente desabilitado)
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontWeight: '500', 
              marginBottom: '0.5rem' 
            }}>
              Ou digite o texto
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ex: Compra de equipamentos no valor de R$ 5.000, venda de serviços R$ 8.000..."
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
            {loading ? <LoadingSpinner size="small" /> : '🔍 Analisar Dados'}
          </button>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="card">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#059669'
          }}>
            ✅ Análise Concluída
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{result.title}</h4>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              flexWrap: 'wrap',
              marginBottom: '1rem'
            }}>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h5 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Valores</h5>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#059669' }}>
                R$ {result.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            
            <div>
              <h5 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Impostos Calculados</h5>
              <div style={{ fontSize: '0.875rem' }}>
                <div>Simples Nacional: R$ {result.taxes?.simplesNacional?.toFixed(2)}</div>
                <div>IRPJ: R$ {result.taxes?.irpj?.toFixed(2)}</div>
                <div>CSLL: R$ {result.taxes?.csll?.toFixed(2)}</div>
                <div style={{ fontWeight: '600', marginTop: '0.25rem' }}>
                  Total: R$ {result.taxes?.total?.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {result.insights && result.insights.length > 0 && (
            <div>
              <h5 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Insights</h5>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {result.insights.map((insight, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{insight}</li>
                ))}
              </ul>
            </div>
          )}

          {result.monthly_summary && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
              <h5 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Resumo do Mês</h5>
              <p style={{ fontSize: '0.875rem' }}>{result.monthly_summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;