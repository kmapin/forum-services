import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AdminLogin } from '../components/AdminLogin';
import { UsersAdmin } from '../components/UsersAdmin';
import { NotificationProvider } from '../contexts/NotificationContext';
import { LogOut, ArrowLeft, Home } from 'lucide-react';

export const UsersAdminWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (!session) {
        setShowLogin(true);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setShowLogin(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || showLogin) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onClose={() => navigate('/admin')}
      />
    );
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  title="Retour au dashboard principal"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                  <p className="text-gray-600">Gérer les profils et rôles des utilisateurs</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Home size={18} />
                  <span>Accueil</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UsersAdmin />
        </div>
      </div>
    </NotificationProvider>
  );
};
