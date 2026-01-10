import React from 'react';

export const ConciergerieHeader: React.FC = () => {
  return (
    <div className="text-center py-12 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-transparent to-orange-400/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl"></div>
      
      {/* Navigation discrète - accessible uniquement par URL/QR code */}
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/30">
            <img 
              src="/image.png" 
              alt="Église Évangélique ADD Poissy" 
              className="h-20 w-auto"
            />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
          CONCIERGERIE DES JEUNES
        </h1>
        
        <div className="text-2xl md:text-3xl text-white font-semibold mb-2 drop-shadow-lg">
          Groupe de Jeunes - Église ADD Poissy
        </div>
        
        <div className="text-xl md:text-2xl text-white/95 font-medium mb-8 drop-shadow-lg">
          🎯 Objectif : Echo 2026
        </div>
        
        <div className="max-w-4xl mx-auto text-white/90 text-lg md:text-xl leading-relaxed px-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="mb-4">
              Les jeunes de notre église se mobilisent pour participer à <strong className="text-white">Echo 2026</strong>, 
              un événement majeur de rassemblement de la jeunesse chrétienne.
            </p>
            <p className="font-semibold text-white">
              En utilisant nos services de conciergerie, vous nous aidez à financer notre participation 
              et à vivre cette expérience inoubliable ensemble ! 🙏✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
