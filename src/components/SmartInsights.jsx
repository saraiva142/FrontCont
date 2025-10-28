import { useState, useEffect } from 'react';
import { insightsAPI, analysisAPI } from '../services/api.js';
import LoadingSpinner from './LoadingSpinner.jsx';

const SmartInsights = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    loadHistoryCount();
  }, []);

  const loadHistoryCount = async () => {
    try {
      const analyses = await analysisAPI.getHistory();
      setHistoryCount(analyses.length);
    } catch (error) {
      console.error('Error loading history count:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;

    setLoading(true);
    const userQuestion = question.trim();
    
    // Add user question to conversation
    setConversation(prev => [...prev, { type: 'user', content: userQuestion }]);
    setQuestion('');

    try {
      const response = await insightsAPI.askQuestion(userQuestion);
      
      // Add AI response to conversation
      setConversation(prev => [...prev, { 
        type: 'ai', 
        content: response.answer,
        historyCount: response.historyCount
      }]);
      
    } catch (error) {
      setConversation(prev => [...prev, { 
        type: 'error', 
        content: error.message || 'Erro ao processar sua pergunta. Tente novamente.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "Quais são meus maiores gastos?",
    "Como posso otimizar meus impostos?",
    "Qual foi minha receita total no último mês?",
    "Quais categorias têm mais movimentação?",
    "Há alguma tendência nos meus gastos?"
  ];

  return (
    <div className="grid grid-cols-1" style={{ gap: '2rem' }}>
      {/* Chat Interface */}
      <div className="card">
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1rem' 
        }}>
          Observações Inteligentes
        </h2>
        
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Faça perguntas sobre seus dados financeiros e receba insights baseados em IA.
          {historyCount > 0 && (
            <span style={{ fontWeight: '500', color: '#059669' }}>
              {' '}Analisando {historyCount} registros do seu histórico.
            </span>
          )}
        </p>

        {/* Conversation */}
        <div style={{ 
          minHeight: '300px', 
          maxHeight: '400px', 
          overflowY: 'auto',
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0'
        }}>
          {conversation.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#64748b',
              padding: '2rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💡</div>
              <p>Faça uma pergunta para começar a conversa!</p>
            </div>
          ) : (
            conversation.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: msg.type === 'user' ? '#dbeafe' : 
                                 msg.type === 'error' ? '#fef2f2' : '#ffffff',
                  border: msg.type === 'error' ? '1px solid #fecaca' : '1px solid #e2e8f0',
                  marginLeft: msg.type === 'user' ? '2rem' : '0'
                }}
              >
                <div style={{ 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: msg.type === 'user' ? '#1e40af' : 
                         msg.type === 'error' ? '#dc2626' : '#059669'
                }}>
                  {msg.type === 'user' ? '👤 Você' : 
                   msg.type === 'error' ? '❌ Erro' : '🤖 Assistente IA'}
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                {msg.historyCount && (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#64748b', 
                    marginTop: '0.5rem',
                    fontStyle: 'italic'
                  }}>
                    Baseado em {msg.historyCount} registros do seu histórico
                  </div>
                )}
              </div>
            ))
          )}
          
          {loading && (
            <div style={{ 
              padding: '0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#059669' }}>
                🤖 Assistente IA
              </div>
              <LoadingSpinner size="small" />
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        {conversation.length === 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Perguntas sugeridas:
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {suggestedQuestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(suggestion)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Digite sua pergunta sobre seus dados financeiros..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !question.trim()}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>

      {/* Information Card */}
      {historyCount === 0 && (
        <div className="card" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            marginBottom: '0.5rem',
            color: '#92400e'
          }}>
            ⚠️ Dados Insuficientes
          </h3>
          <p style={{ color: '#92400e', fontSize: '0.875rem' }}>
            Para usar as Observações Inteligentes, você precisa primeiro fazer upload de alguns dados financeiros. 
            Vá para a aba "Upload e Análise" para começar.
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartInsights;