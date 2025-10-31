import React, { useState, useCallback } from 'react';
import { FaLightbulb, FaSpinner, FaPaperPlane, FaExclamationCircle } from 'react-icons/fa';

interface SmartObservationResult {
  question: string;
  answer: string;
}

const SmartObservationsSection: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<SmartObservationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Por favor, digite uma pergunta.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const token = localStorage.getItem('supabase.auth.token');
    const accessToken = token ? JSON.parse(token).access_token : '';

    try {
      const response = await fetch('http://localhost:3000/api/analysis/smart-observations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao obter a observação inteligente.');
      }

      // A resposta da IA para este endpoint é um texto livre (string)
      // O backend está retornando o JSON completo da Groq, que contém a resposta.
      // Vamos assumir que a resposta livre da IA é o campo 'answer' que o backend deve fornecer.
      // Como o backend está retornando o JSON da Groq, vamos precisar ajustar a extração.

      // Para o MVP, vamos assumir que o backend retorna { question: string, answer: string }
      // Mas como o backend está retornando o JSON da Groq, vamos tratar a resposta como o JSON completo
      // e extrair o texto de insight.
      
      // Ajustando para a estrutura de JSON que a IA retorna no backend
      // { operacao, categoria, valor, impostos_calculados, insights, resumo_mensal }
      // A IA foi instruída a retornar um JSON, mas para esta função, ela deveria retornar texto livre.
      // Vamos assumir que o campo 'insights' conterá a resposta livre.
      
      // NOTA: O backend precisa ser ajustado para retornar a resposta livre da IA neste endpoint.
      // Por enquanto, vamos extrair o campo 'insights' ou 'resumo_mensal' como a resposta.

      // Como a função generateFinancialInsight no backend está forçando JSON,
      // a resposta será um JSON. Vamos assumir que o campo 'insights' trará a resposta.
      // O ideal seria criar uma função separada na Groq que não force JSON.

      // Para o MVP, vamos forçar uma resposta de texto livre no backend, mas aqui vamos simular a extração.
      // Vamos assumir que o backend retorna { question: string, answer: string } onde 'answer' é o texto livre.

      setResult({
        question: question.trim(),
        answer: data.answer // Assumindo que o backend foi ajustado para retornar a resposta livre aqui
      });
      setQuestion('');

    } catch (err) {
      console.error('Erro na observação inteligente:', err);
      setError(err instanceof Error ? err.message : 'Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  }, [question]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
        <FaLightbulb className="h-6 w-6 text-blue-500" />
        <span>Observações Inteligentes</span>
      </h2>

      <p className="text-gray-600">
        Faça perguntas sobre seu histórico de análises. A IA usará seus dados para responder.
        Ex: "Qual foi meu maior gasto no último mês?", "Quanto de imposto foi calculado no total?"
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={3}
          value={question}
          onChange={handleQuestionChange}
          placeholder="Digite sua pergunta aqui..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white transition duration-150 ease-in-out ${
            loading || !question.trim()
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {loading ? (
            <FaSpinner className="animate-spin h-5 w-5 mr-3" />
          ) : (
            <>
              <FaPaperPlane className="h-5 w-5 mr-2" />
              Perguntar à IA
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="flex items-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg space-x-3">
          <FaExclamationCircle className="h-5 w-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Resposta da IA</h3>
          <p className="font-medium text-gray-600">Sua Pergunta:</p>
          <p className="text-sm bg-white p-3 rounded-lg border">{result.question}</p>
          
          <p className="font-medium text-gray-600">Resposta:</p>
          <p className="text-lg text-gray-900 bg-white p-3 rounded-lg border">{result.answer}</p>
        </div>
      )}
    </div>
  );
};

export default SmartObservationsSection;

