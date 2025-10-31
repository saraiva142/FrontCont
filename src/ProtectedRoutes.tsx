import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoutes: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    // Estado de carregamento, pode ser substituído por um spinner
    return <div className="flex justify-center items-center h-screen text-xl">Carregando...</div>;
  }

  // Se não houver sessão, redireciona para a página de login
  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;

