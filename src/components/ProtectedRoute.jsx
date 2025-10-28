import { useAuth } from '../context/AuthContext.jsx';
import Login from '../pages/Login.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute:', { user: user?.email, loading });

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Carregando...</div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ Usuário não autenticado, redirecionando para login');
    return <Login />;
  }

  console.log('✅ Usuário autenticado:', user.email);
  return children;
};

export default ProtectedRoute;