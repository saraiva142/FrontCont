import React, { useState, useCallback } from 'react';
import { FaFilePdf, FaFileExcel, FaFileCsv, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface AnalysisResult {
  message: string;
  analysis: any; // Ajustar o tipo conforme a estrutura de dados do Supabase
  ai_data: any; // Ajustar o tipo conforme a estrutura de dados da IA
}

const UploadSection: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setTextInput(''); // Limpa o input de texto
      setResult(null);
      setError(null);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    setFile(null); // Limpa o arquivo
    setResult(null);
    setError(null);
  };

  const getFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['xls', 'xlsx'].includes(ext || '')) return 'xlsx';
    if (ext === 'csv') return 'csv';
    return 'text';
  };

  const analyzeData = useCallback(async (content: string, fileType: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const token = localStorage.getItem('supabase.auth.token');
    const accessToken = token ? JSON.parse(token).access_token : '';

    try {
      // Em um MVP, vamos simular a leitura do arquivo e enviar o conteúdo como texto.
      // Em produção, o backend precisaria de um serviço de upload e processamento mais robusto.
      // Para PDF/Planilhas, o usuário deve copiar o texto relevante para o campo de texto,
      // ou o backend precisaria de bibliotecas para extrair o texto.
      // Aqui, vamos apenas enviar o texto/conteúdo.

      const response = await fetch('http://localhost:3000/api/analysis/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          text: content,
          fileType: fileType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido na análise.');
      }

      setResult(data);
    } catch (err) {
      console.error('Erro na análise:', err);
      setError(err instanceof Error ? err.message : 'Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      // Para o MVP, vamos forçar o usuário a extrair o texto de arquivos complexos
      // e usar o campo de texto.
      // O backend está esperando o texto.
      setError('Para PDF/Planilhas, por favor, copie o conteúdo relevante e cole no campo de texto.');
      return;
    }

    if (textInput.trim()) {
      analyzeData(textInput.trim(), 'text');
    } else {
      setError('Por favor, insira um texto para análise ou selecione um arquivo.');
    }
  };

  const renderFileIcon = (fileName: string) => {
    const type = getFileType(fileName);
    if (type === 'pdf') return <FaFilePdf className="h-6 w-6 text-red-500" />;
    if (type === 'xlsx') return <FaFileExcel className="h-6 w-6 text-green-500" />;
    if (type === 'csv') return <FaFileCsv className="h-6 w-6 text-yellow-500" />;
    return null;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Analisar Dados Financeiros</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input de Texto */}
        <div className="space-y-2">
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-700">
            Insira o texto para análise (Ex: "Paguei R$ 1500 de aluguel em 01/01/2024")
          </label>
          <textarea
            id="text-input"
            rows={4}
            value={textInput}
            onChange={handleTextChange}
            placeholder="Cole o texto ou o conteúdo relevante de um arquivo aqui..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          />
        </div>

        {/* Upload de Arquivo (Simulado) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Ou faça upload de um arquivo (Apenas para referência do tipo no MVP)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".txt,.pdf,.xls,.xlsx,.csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />
            {file && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {renderFileIcon(file.name)}
                <span>{file.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Botão de Análise */}
        <button
          type="submit"
          disabled={loading || (!textInput.trim() && !file)}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white transition duration-150 ease-in-out ${
            loading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {loading ? (
            <FaSpinner className="animate-spin h-5 w-5 mr-3" />
          ) : (
            'Analisar com IA'
          )}
        </button>
      </form>

      {/* Mensagens de Status */}
      {error && (
        <div className="flex items-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg space-x-3">
          <FaExclamationCircle className="h-5 w-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex items-center p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg space-x-3">
            <FaCheckCircle className="h-5 w-5" />
            <p className="font-medium">{result.message}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Resultado da Análise</h3>
            
            {/* Dados Principais */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-gray-600">Operação:</div>
                <div className="text-gray-900">{result.ai_data.operacao || 'N/A'}</div>
                
                <div className="font-medium text-gray-600">Categoria:</div>
                <div className="text-gray-900">{result.ai_data.categoria || 'N/A'}</div>

                <div className="font-medium text-gray-600">Valor:</div>
                <div className="text-gray-900">R$ {result.ai_data.valor?.toFixed(2) || 'N/A'}</div>
            </div>

            {/* Impostos Calculados */}
            <div className="pt-4 border-t border-gray-200">
                <p className="font-medium text-gray-600 mb-2">Impostos Calculados:</p>
                <pre className="bg-white p-3 rounded-lg text-xs overflow-auto border">
                    {JSON.stringify(result.ai_data.impostos_calculados, null, 2)}
                </pre>
            </div>

            {/* Insights */}
            <div className="pt-4 border-t border-gray-200">
                <p className="font-medium text-gray-600 mb-2">Insights Contábeis:</p>
                <p className="bg-white p-3 rounded-lg text-sm border">{result.ai_data.insights || 'Nenhum insight.'}</p>
            </div>

            {/* Resumo Mensal */}
            <div className="pt-4 border-t border-gray-200">
                <p className="font-medium text-gray-600 mb-2">Resumo do Mês (IA):</p>
                <p className="bg-white p-3 rounded-lg text-sm border">{result.ai_data.resumo_mensal || 'Nenhum resumo.'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;

