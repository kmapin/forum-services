import React from 'react';
import { ServiceTheme } from '../types';
import * as Icons from 'lucide-react';
import { Eye, Download } from 'lucide-react';

interface PosterProps {
  service: ServiceTheme;
  onJoinClick: (service: ServiceTheme) => void;
  onViewDetail: (service: ServiceTheme) => void;
}

export const Poster: React.FC<PosterProps> = ({ service, onJoinClick, onViewDetail }) => {
  const IconComponent = Icons[service.icon as keyof typeof Icons] as React.ComponentType<any>;

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJoinClick(service);
  };

  const handleViewDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetail(service);
  };

  const handleDownloadPDF = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Import dynamique pour éviter les problèmes de SSR
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).jsPDF;

      // Créer un élément temporaire pour le PDF avec un design optimisé
      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute';
      tempElement.style.left = '-9999px';
      tempElement.style.width = '794px'; // A4 width in pixels at 96 DPI
      tempElement.style.height = '1123px'; // A4 height in pixels at 96 DPI
      tempElement.style.backgroundColor = 'white';
      tempElement.style.fontFamily = 'system-ui, -apple-system, sans-serif';

      // Créer l'icône SVG pour le PDF
      const iconSvg = `
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${getIconPath(service.icon)}
        </svg>
      `;

      tempElement.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, ${service.color}CC 0%, ${service.color}E6 30%, ${service.color}B3 70%, ${service.color}CC 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 60px;
          box-sizing: border-box;
        ">
          <!-- Background Image -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${service.imageUrl}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.15;
            z-index: 1;
          "></div>
          
          <!-- Content -->
          <div style="position: relative; z-index: 2; color: white; text-align: center;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
              <div style="
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 80px;
                height: 80px;
              ">
                ${iconSvg}
              </div>
              <div style="text-align: right;">
                <div style="font-size: 14px; font-weight: 600; opacity: 0.9; margin-bottom: 8px;">FORUM DES SERVICES</div>
                <div style="
                  font-size: 12px;
                  opacity: 0.8;
                  background: rgba(255, 255, 255, 0.2);
                  backdrop-filter: blur(10px);
                  padding: 8px 16px;
                  border-radius: 20px;
                  border: 1px solid rgba(255, 255, 255, 0.3);
                ">29 JUIN 2025</div>
              </div>
            </div>

            <!-- Main Title -->
            <div style="margin: 80px 0;">
              <h1 style="
                font-size: 48px;
                font-weight: bold;
                margin: 0 0 30px 0;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                line-height: 1.2;
              ">${service.title}</h1>
              
              <div style="
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 30px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                margin: 0 auto;
                max-width: 600px;
              ">
                <p style="
                  font-size: 18px;
                  line-height: 1.6;
                  margin: 0;
                  opacity: 0.95;
                ">${service.description}</p>
              </div>
            </div>

            <!-- Additional Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0; max-width: 600px; margin-left: auto; margin-right: auto;">
              <div style="
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                text-align: left;
              ">
                <h3 style="font-weight: 600; margin: 0 0 10px 0; font-size: 16px;">Rôles disponibles</h3>
                <div style="font-size: 14px; opacity: 0.9; line-height: 1.4;">
                  <div style="margin-bottom: 8px;">• Lead - Responsable du service</div>
                  <div>• Participant - Membre de l'équipe</div>
                </div>
              </div>
              <div style="
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                text-align: left;
              ">
                <h3 style="font-weight: 600; margin: 0 0 10px 0; font-size: 16px;">Engagement</h3>
                <p style="font-size: 14px; opacity: 0.9; margin: 0; line-height: 1.4;">
                  Rejoignez une équipe passionnée et servez avec joie dans ce ministère qui vous correspond.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-center;">
              <div style="
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                padding: 20px 40px;
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                display: inline-block;
                margin-bottom: 30px;
                font-size: 18px;
                font-weight: 600;
              ">Rejoignez-nous !</div>
              
              <div style="margin-top: 40px;">
                <div style="font-size: 32px; font-weight: bold; margin-bottom: 8px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">
                  ADD POISSY
                </div>
                <div style="font-size: 16px; opacity: 0.9; font-weight: 500;">
                  Assemblée de Dieu de Poissy
                </div>
              </div>
            </div>
          </div>

          <!-- Decorative Elements -->
          <div style="position: absolute; top: 60px; left: 60px; width: 12px; height: 12px; background: rgba(255, 255, 255, 0.4); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: 60px; right: 60px; width: 8px; height: 8px; background: rgba(255, 255, 255, 0.4); border-radius: 50%;"></div>
          <div style="position: absolute; top: 40%; right: 60px; width: 10px; height: 10px; background: rgba(255, 255, 255, 0.3); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: 40%; left: 60px; width: 6px; height: 6px; background: rgba(255, 255, 255, 0.3); border-radius: 50%;"></div>
        </div>
      `;

      document.body.appendChild(tempElement);

      // Attendre que les images se chargent
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capturer l'élément
      const canvas = await html2canvas(tempElement, {
        width: 794,
        height: 1123,
        scale: 2, // Haute résolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });

      // Nettoyer l'élément temporaire
      document.body.removeChild(tempElement);

      // Créer le PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 dimensions in mm

      // Télécharger le PDF
      const fileName = `${service.title.replace(/[^a-zA-Z0-9]/g, '_')}_Forum_Services_ADD_Poissy.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };

  // Fonction pour obtenir le chemin SVG de chaque icône
  const getIconPath = (iconName: string): string => {
    const iconPaths: { [key: string]: string } = {
      'Heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
      'Users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      'Zap': '<polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>',
      'Flame': '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
      'Star': '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>',
      'Music': '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
      'Monitor': '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
      'Coffee': '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>',
      'Droplets': '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2.04 4.6 4.14 6.12s3.83 2.96 4.36 5.06c.53 2.1.04 4.27-1.32 5.8s-3.29 2.5-5.18 2.5c-1.89 0-3.82-.87-5.18-2.34"/>',
      'Hand': '<path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
      'Home': '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
      'Calendar': '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
      'Camera': '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
      'Volume2': '<polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/>',
      'MessageCircle': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
      'Megaphone': '<path d="M3 11h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"/><path d="M21 6H8l-2 2v8l2 2h13a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 3.23.67 6.47 6.47 0 0 0 3.23-.67"/>',
      'HandHeart': '<path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="M11 14c.5-1.6 2.2-3 4-3 1.8 0 3.5 1.4 4 3"/><path d="M16 5c-.7-1.7-2.2-3-4-3s-3.3 1.3-4 3"/><path d="M15 6.8C14.2 6.3 13.1 6 12 6s-2.2.3-3 .8"/>',
    };
    return iconPaths[iconName] || iconPaths['Heart'];
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${service.imageUrl})` }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br opacity-90"
        style={{ 
          background: `linear-gradient(135deg, ${service.color}CC 0%, ${service.color}E6 50%, ${service.color}B3 100%)`
        }}
      />
      
      {/* Content */}
      <div className="relative h-96 p-6 flex flex-col justify-between text-white">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
            <IconComponent size={28} className="text-white drop-shadow-lg" />
          </div>
          <div className="text-right">
            <div className="text-xs font-medium opacity-90 mb-1">FORUM DES SERVICES</div>
            <div className="text-xs opacity-80 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30">
              29 JUIN 2025
            </div>
          </div>
        </div>

        {/* Action Buttons - Top Right */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={handleViewDetail}
            className="bg-black/20 backdrop-blur-sm text-white/70 p-2 rounded-full hover:bg-black/30 hover:text-white transition-all duration-300"
            title="Voir en détail"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-black/20 backdrop-blur-sm text-white/70 p-2 rounded-full hover:bg-black/30 hover:text-white transition-all duration-300"
            title="Télécharger en PDF"
          >
            <Download size={16} />
          </button>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-3 flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white drop-shadow-2xl leading-tight">
            {service.title}
          </h2>
          <p className="text-sm text-white/95 leading-relaxed max-w-sm mx-auto backdrop-blur-sm bg-white/10 p-3 rounded-xl border border-white/20">
            {service.description}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 space-y-3">
          <div className="text-xl font-bold text-white drop-shadow-xl">
            ADD POISSY
          </div>
          <div className="text-xs text-white/90 font-medium">
            Assemblée de Dieu de Poissy
          </div>
          <button
            onClick={handleJoinClick}
            className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 text-sm font-semibold hover:bg-white/30 transition-all duration-300 cursor-pointer mb-2 hover:scale-105 active:scale-95"
          >
            Rejoignez-nous !
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
      <div className="absolute bottom-4 right-4 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-4 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse delay-500" />
    </div>
  );
};