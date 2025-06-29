import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Poster } from './components/Poster';
import { ContactModal } from './components/ContactModal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ServiceDetail } from './components/ServiceDetail';
import { services } from './data/services';
import { ServiceTheme } from './types';
import { supabase } from './lib/supabase';
import { LogIn } from 'lucide-react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceTheme | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [detailService, setDetailService] = useState<ServiceTheme | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdminLoggedIn(!!session);
      setIsCheckingAuth(false);
    };

    checkAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAdminLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Gérer les liens directs vers les services
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#service-')) {
        const serviceId = hash.replace('#service-', '');
        const service = services.find(s => s.id === serviceId);
        if (service) {
          setDetailService(service);
        }
      } else {
        setDetailService(null);
      }
    };

    // Vérifier le hash initial
    handleHashChange();

    // Écouter les changements de hash
    window.addEventListener('hashchange', handleHashChange);

    // Écouter les événements personnalisés de changement de service
    const handleServiceChange = (event: CustomEvent) => {
      setDetailService(event.detail);
    };

    window.addEventListener('serviceChange', handleServiceChange as EventListener);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('serviceChange', handleServiceChange as EventListener);
    };
  }, []);

  const handleJoinClick = (service: ServiceTheme) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleViewDetail = (service: ServiceTheme) => {
    setDetailService(service);
    window.history.pushState(null, '', `#service-${service.id}`);
  };

  const handleCloseDetail = () => {
    setDetailService(null);
    window.history.replaceState(null, '', window.location.pathname);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isAdminLoggedIn) {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      {/* Bouton de connexion administrateur */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setIsAdminLoginOpen(true)}
          className="bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center space-x-2 border border-white/20"
        >
          <LogIn size={18} />
          <span className="font-medium">Admin</span>
        </button>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service) => (
            <Poster 
              key={service.id} 
              service={service} 
              onJoinClick={handleJoinClick}
              onViewDetail={handleViewDetail}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Venez nous rencontrer !
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Que vous soyez nouveau dans la foi ou membre de longue date, 
              il y a une place pour vous dans l'œuvre de Dieu. 
              Venez découvrir comment vos talents peuvent servir le Royaume.
            </p>
            <div className="bg-gradient-to-r from-teal-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold inline-block shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Église Évangélique de Poissy
            </div>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      {detailService && (
        <ServiceDetail
          service={detailService}
          onClose={handleCloseDetail}
          onJoinClick={handleJoinClick}
        />
      )}

      <ContactModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedService={selectedService}
      />

      {isAdminLoginOpen && (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onClose={() => setIsAdminLoginOpen(false)}
        />
      )}
    </div>
  );
}

export default App;