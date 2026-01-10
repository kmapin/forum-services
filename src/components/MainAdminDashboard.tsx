import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Package, ArrowRight, Church } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MainAdminDashboardProps {
  onLogout: () => void;
}

export const MainAdminDashboard: React.FC<MainAdminDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const adminSections = [
    {
      id: 'forum',
      title: 'Administration du Forum',
      description: 'Gérer les inscriptions aux services du forum',
      icon: Users,
      color: 'from-teal-500 to-blue-500',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      path: '/admin/forum'
    },
    {
      id: 'conciergerie',
      title: 'Administration de la Conciergerie',
      description: 'Gérer les demandes de services de conciergerie',
      icon: Package,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      path: '/admin/conciergerie'
    },
    {
      id: 'church',
      title: 'Administration ChurchApp',
      description: 'Gérer le contenu de l\'application mobile (About, Events, Meetings, Welcome)',
      icon: Church,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      path: '/admin/church'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
              <p className="text-gray-600">Choisissez la section à administrer</p>
            </div>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => navigate(section.path)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`${section.bgColor} rounded-2xl p-4 inline-block mb-6`}>
                    <Icon className={section.iconColor} size={48} />
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {section.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-6">
                    {section.description}
                  </p>
                  
                  {/* Arrow */}
                  <div className="flex items-center text-gray-400 group-hover:text-gray-600 transition-colors">
                    <span className="text-sm font-medium mr-2">Accéder</span>
                    <ArrowRight size={20} className="transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bienvenue dans l'espace d'administration
            </h3>
            <p className="text-gray-600">
              Sélectionnez la section que vous souhaitez administrer. Vous pouvez gérer les inscriptions 
              au forum des services ou les demandes de la conciergerie des jeunes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
