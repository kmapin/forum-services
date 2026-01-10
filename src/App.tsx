import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Poster } from './components/Poster';
import { ContactModal } from './components/ContactModal';
import { ServiceDetail } from './components/ServiceDetail';
import { services } from './data/services';
import { ServiceTheme } from './types';
import { Settings } from 'lucide-react';

function App() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceTheme | null>(null);
  const [detailService, setDetailService] = useState<ServiceTheme | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      {/* Bouton Admin discret */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => navigate('/admin')}
          className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-200"
          title="Administration"
        >
          <Settings size={20} />
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
              Église Évangélique ADD Poissy
            </div>
          </div>
        </div>

        {/* Lien discret vers la conciergerie */}
        <div className="mt-8 text-center">
          <Link 
            to="/services" 
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-300 underline decoration-dotted"
          >
            Conciergerie des Jeunes
          </Link>
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
    </div>
  );
}

export default App;