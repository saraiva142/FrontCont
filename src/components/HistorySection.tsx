import React, { useState, useEffect, useCallback } from 'react';
import { FaSpinner, FaHistory, FaExclamationCircle } from 'react-icons/fa';

interface AnalysisRecord {
  id: number;
  title: string;
  category: string;
  value: number;
  calculated_taxes: any;
  insights: string;
  created_at: string;
}

const HistorySection: React.FC = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('supabase.auth.token');
    const accessToken = token ? JSON.parse(token).access_token : '';

    try {
      const response = await fetch('http://localhost:3000/api/analysis/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar o histórico.');
      }

      setHistory(data);
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
      setError(err instanceof Error ? err.message : 'Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-3 text-lg text-gray-600">Carregando Histórico...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg space-x-3">
        <FaExclamationCircle className="h-5 w-5" />
        <p className="font-medium">Erro ao carregar o histórico: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
        <FaHistory className="h-6 w-6 text-blue-500" />
        <span>Histórico de Análises</span>
      </h2>

      {history.length === 0 ? (
        <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
          <p className="text-lg">Nenhuma análise encontrada.</p>
          <p className="text-sm mt-2">Comece a analisar dados na aba "Analisar Dados".</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div key={record.id} className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out bg-white">
              <div className="flex justify-between items-start border-b pb-2 mb-2">
                <h3 className="text-lg font-bold text-gray-800">{record.title}</h3>
                <span className="text-sm text-gray-500">{new Date(record.created_at).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="font-medium text-gray-600">Categoria:</p>
                <p className="text-gray-900">{record.category}</p>

                <p className="font-medium text-gray-600">Valor:</p>
                <p className="text-gray-900">R$ {record.value.toFixed(2)}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="font-medium text-gray-600">Insights:</p>
                <p className="text-sm text-gray-700 mt-1">{record.insights}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="font-medium text-gray-600">Impostos Calculados:</p>
                <pre className="text-xs bg-gray-50 p-2 rounded-md overflow-auto">{JSON.stringify(record.calculated_taxes, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorySection;

