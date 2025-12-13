import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ConciergerieHeader } from '../components/ConciergerieHeader';
import { conciergeServices } from '../data/conciergeServices';
import { Settings } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const ServicesListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleServiceClick = (slug: string) => {
    navigate(`/services/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-orange-50">
      {/* Header avec navigation */}
      <ConciergerieHeader />
      
      {/* Bouton Admin discret */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => navigate('/admin/conciergerie')}
          className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-200"
          title="Administration"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Section titre */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 shadow-md border-b border-white/20">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-3">
            Nos Services de Conciergerie
          </h1>
          <p className="text-gray-700 text-center text-lg max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-purple-700">Soutenez les jeunes dans leur projet Echo 2026 !</span>
            <br />
            En faisant appel à nos services, vous contribuez directement au financement 
            de la participation des jeunes à cet événement exceptionnel. 🎉
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {conciergeServices.map((service) => {
            const IconComponent = (LucideIcons as any)[service.icon];
            
            return (
              <div
                key={service.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 flex flex-col cursor-pointer"
                onClick={() => handleServiceClick(service.slug)}
              >
                {/* Icon */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-4 w-16 h-16 flex items-center justify-center mb-4 shadow-md">
                  {IconComponent && <IconComponent className="w-8 h-8" />}
                </div>

                {/* Service Name */}
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Button */}
                <button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceClick(service.slug);
                  }}
                >
                  Voir le service
                </button>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border-2 border-purple-200 max-w-3xl mx-auto">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Ensemble vers Echo 2026 !
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Chaque service que vous commandez aide directement les jeunes de notre église 
              à financer leur participation à <strong className="text-purple-700">Echo 2026</strong>.
              <br />
              <span className="text-purple-600 font-semibold">
                Merci de votre soutien et de votre confiance ! 🙏
              </span>
            </p>
            <div className="bg-white rounded-xl p-4 inline-block shadow-md">
              <p className="text-sm text-gray-600 mb-2">Une initiative du</p>
              <p className="text-xl font-bold text-purple-700">Groupe de Jeunes - Église ADD Poissy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
