import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Info, Calendar, Users, MessageSquare, ClipboardList, UserCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { NotificationProvider } from '../contexts/NotificationContext';
import { AboutAdmin } from './church-admin/AboutAdmin';
import { EventsAdmin } from './church-admin/EventsAdmin';
import { MeetingsAdmin } from './church-admin/MeetingsAdmin';
import { WelcomeMessagesAdmin } from './church-admin/WelcomeMessagesAdmin';
import { PlanningsAdmin } from './church-admin/PlanningsAdmin';
import { ServiceMembersAdmin } from './church-admin/ServiceMembersAdmin';

interface ChurchAdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'about' | 'events' | 'meetings' | 'welcome' | 'plannings' | 'members';

export const ChurchAdminDashboard: React.FC<ChurchAdminDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('about');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const tabs = [
    { id: 'about' as TabType, label: 'À propos', icon: Info },
    { id: 'events' as TabType, label: 'Événements', icon: Calendar },
    { id: 'meetings' as TabType, label: 'Réunions', icon: Users },
    { id: 'welcome' as TabType, label: 'Messages d\'accueil', icon: MessageSquare },
    { id: 'members' as TabType, label: 'Membres', icon: UserCheck },
    { id: 'plannings' as TabType, label: 'Plannings', icon: ClipboardList },
  ];

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
                  <h1 className="text-2xl font-bold text-gray-900">Administration - ChurchApp</h1>
                  <p className="text-gray-600">Gestion du contenu de l'application</p>
                </div>
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

        {/* Tabs Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'about' && <AboutAdmin />}
          {activeTab === 'events' && <EventsAdmin />}
          {activeTab === 'meetings' && <MeetingsAdmin />}
          {activeTab === 'welcome' && <WelcomeMessagesAdmin />}
          {activeTab === 'members' && <ServiceMembersAdmin />}
          {activeTab === 'plannings' && <PlanningsAdmin />}
        </div>
      </div>
    </NotificationProvider>
  );
};
