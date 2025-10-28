import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getSession } from '../services/supabase.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modo desenvolvimento - desative esta linha em produção
  const DEV_MODE = false;

  useEffect(() => {
    console.log('🔐 AuthProvider iniciado');
    
    if (DEV_MODE) {
      // Usuário mock para desenvolvimento
      const mockUser = {
        id: 'dev-user-id',
        email: 'dev@example.com',
        user_metadata: { full_name: 'Usuário Desenvolvimento' }
      };
      console.log('👤 Modo desenvolvimento ativo - usuário mock:', mockUser.email);
      setUser(mockUser);
      setLoading(false);
      return;
    }

    // Get initial session (código original para produção)
    getSession().then((session) => {
      console.log('Sessão inicial:', session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Evento auth:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle: DEV_MODE 
      ? () => {
          console.log('🔐 Modo desenvolvimento - login simulado');
          const mockUser = {
            id: 'dev-user-id',
            email: 'dev@example.com', 
            user_metadata: { full_name: 'Usuário Desenvolvimento' }
          };
          setUser(mockUser);
          return Promise.resolve();
        }
      : () => supabase.auth.signInWithOAuth({ provider: 'google' }),
    
    signOut: DEV_MODE
      ? () => {
          console.log('🔐 Modo desenvolvimento - logout simulado');
          setUser(null);
          return Promise.resolve();
        }
      : () => supabase.auth.signOut()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};