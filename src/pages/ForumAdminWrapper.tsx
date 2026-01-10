import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AdminLogin } from '../components/AdminLogin';
import { AdminDashboard } from '../components/AdminDashboard';

export const ForumAdminWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdminLoggedIn(!!session);
      setIsCheckingAuth(false);
      
      if (!session) {
        setIsAdminLoginOpen(true);
      }
    };

    checkAuth();

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
    navigate('/admin');
  };

  const handleCloseLogin = () => {
    setIsAdminLoginOpen(false);
    navigate('/admin');
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
              onClick={() => navigate('/admin')}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Retour au dashboard admin
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

  return <AdminDashboard onLogout={handleLogout} />;
};
