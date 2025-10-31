import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import FileUpload from '../components/FileUpload.jsx';
import AnalysisHistory from '../components/AnalysisHistory.jsx';
import SmartInsights from '../components/SmartInsights.jsx';
import FinancialCharts from '../components/FinancialCharts.jsx';
import TaxReminders from '../components/TaxReminders.jsx';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <header style={{ 
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: '#1e293b',
            marginBottom: '0.25rem'
          }}>
            Financial AI
          </h1>
          <p style={{ color: '#64748b' }}>
            Olá, {user?.user_metadata?.full_name || user?.email}!
          </p>
        </div>
        
        <button
          onClick={handleSignOut}
          className="btn btn-secondary"
        >
          Sair
        </button>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ 
        marginBottom: '2rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'upload', label: '📁 Upload e Análise' },
            { id: 'history', label: '📊 Histórico' },
            { id: 'charts', label: '📈 Gráficos' },
            { id: 'insights', label: '💡 Observações Inteligentes' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? '#3b82f6' : 'transparent'}`,
                color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                fontWeight: activeTab === tab.id ? '600' : '400',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '2rem', marginTop: '2rem' }}>
        <div className="lg:col-span-2">
          {activeTab === 'upload' && <FileUpload />}
          {activeTab === 'history' && <AnalysisHistory />}
          {activeTab === 'charts' && <FinancialCharts />}
          {activeTab === 'insights' && <SmartInsights />}
        </div>
        
        
      </div>
    </div>
  );
};

export default Dashboard;