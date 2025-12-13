import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AdminLogin } from '../components/AdminLogin';
import { ConciergerieAdminPage } from './ConciergerieAdminPage';

export const ConciergerieAdminWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdminLoggedIn(!!session);
      setIsCheckingAuth(false);
      
      // Si pas connecté, ouvrir la modal de connexion
      if (!session) {
        setIsAdminLoginOpen(true);
      }
    };

    checkAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminLoggedIn(!!session);
      if (session) {
        setIsAdminLoginOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminLoginOpen(false);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    navigate('/');
  };

  const handleCloseLogin = () => {
    setIsAdminLoginOpen(false);
    navigate('/services');
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Administrateur Requis</h1>
            <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
            <button
              onClick={() => navigate('/services')}
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Retour à la conciergerie
            </button>
          </div>
        </div>
        
        {isAdminLoginOpen && (
          <AdminLogin
            onClose={handleCloseLogin}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </>
    );
  }

  return <ConciergerieAdminPage onLogout={handleLogout} />;
};
