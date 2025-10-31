import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaChartLine } from 'react-icons/fa';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    // Se já estiver logado, redireciona para a dashboard
    if (session) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard', // Redireciona de volta para a dashboard
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao tentar login com Google:', error);
      alert('Erro ao tentar login. Tente novamente.');
    }
  };

  if (loading || session) {
    return <div className="flex justify-center items-center h-screen text-xl text-gray-700">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-xl border border-gray-100">
        <div className="text-center">
          <FaChartLine className="mx-auto h-12 w-auto text-blue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Fintech AI MVP
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login para começar a analisar suas finanças com inteligência artificial.
          </p>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-md transition duration-150 ease-in-out border-gray-300"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            <FcGoogle className="h-5 w-5" />
          </span>
          Entrar com Google
        </button>
      </div>
    </div>
  );
};

export default Login;

