import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      alert('Erro ao fazer login. Tente novamente.');
    }
  };

  const handleDevLogin = () => {
    // Força o login em modo desenvolvimento
    signInWithGoogle();
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1e293b',
          marginBottom: '0.5rem'
        }}>
          Financial AI
        </h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Análise financeira inteligente com IA
        </p>

        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1rem' 
        }}>
          Bem-vindo
        </h2>

        {/* Botão Google */}
        <button
          onClick={handleGoogleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: '500',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '1rem'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>

        {/* Botão Desenvolvimento */}
        <button
          onClick={handleDevLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            border: '2px solid #d1d5db',
            borderRadius: '0.5rem',
            backgroundColor: 'transparent',
            color: '#6b7280',
            fontWeight: '500',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '2rem'
          }}
        >
          🚀 Modo Desenvolvimento
        </button>

        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f1f5f9', 
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#64748b'
        }}>
          <strong>Recursos incluídos:</strong>
          <ul style={{ textAlign: 'left', marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Upload de CSV e Excel</li>
            <li>Análise automática com IA</li>
            <li>Cálculo de impostos</li>
            <li>Insights financeiros</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;