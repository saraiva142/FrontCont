import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { FaSignOutAlt, FaChartPie, FaLightbulb, FaUpload } from 'react-icons/fa';
import UploadSection from '../components/UploadSection';
import HistorySection from '../components/HistorySection';
import SmartObservationsSection from '../components/SmartObservationsSection';

// Paleta: tons de branco + cinza + uma cor primária suave (azul: #3b82f6)

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'history' | 'smart'>('upload');

  const userName = user?.user_metadata?.full_name || user?.email || 'Usuário';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {userName.split(' ')[0]}!
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition duration-150 ease-in-out p-2 rounded-md hover:bg-red-50"
            >
              <FaSignOutAlt className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition duration-150 ease-in-out flex items-center space-x-2`}
            >
              <FaUpload className="h-5 w-5" />
              <span>Analisar Dados</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition duration-150 ease-in-out flex items-center space-x-2`}
            >
              <FaChartPie className="h-5 w-5" />
              <span>Histórico de Análises</span>
            </button>
            <button
              onClick={() => setActiveTab('smart')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'smart'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition duration-150 ease-in-out flex items-center space-x-2`}
            >
              <FaLightbulb className="h-5 w-5" />
              <span>Observações Inteligentes</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-8 shadow-lg rounded-xl border border-gray-100">
          {activeTab === 'upload' && <UploadSection />}
          {activeTab === 'history' && <HistorySection />}
          {activeTab === 'smart' && <SmartObservationsSection />}
        </div>
      </main>

      {/* Footer (Opcional, para manter o layout limpo) */}
      <footer className="py-4 text-center text-gray-400 text-sm border-t border-gray-100 mt-auto">
        Fintech AI MVP - Powered by Supabase & Groq
      </footer>
    </div>
  );
};

export default Dashboard;

