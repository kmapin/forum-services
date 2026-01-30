import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Handshake, 
  GraduationCap, 
  ArrowRight, 
  Menu, 
  X, 
  Settings, 
  LogIn, 
  LogOut,
  ChevronDown,
  Sparkles,
  Heart,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { supabase, Profile } from '../lib/supabase';
import { AuthModal } from '../components/learning/common/AuthModal';

interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  path: string;
  features: string[];
}

const features: FeatureCard[] = [
  {
    id: 'forum',
    title: 'Forum des Services',
    subtitle: 'Découvrez les ministères',
    description: 'Explorez les différents services de l\'église et trouvez où vos talents peuvent servir.',
    icon: <Users size={32} />,
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-600',
    path: '/forum',
    features: ['Découvrir les services', 'Rejoindre une équipe', 'Voir les responsables'],
  },
  {
    id: 'conciergerie',
    title: 'Conciergerie',
    subtitle: 'Entraide communautaire',
    description: 'Proposez ou demandez de l\'aide au sein de la communauté. Ensemble, nous sommes plus forts.',
    icon: <Handshake size={32} />,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    path: '/services',
    features: ['Offrir un service', 'Demander de l\'aide', 'Connecter les talents'],
  },
  {
    id: 'learning',
    title: 'Formation',
    subtitle: 'Apprenez et grandissez',
    description: 'Suivez des parcours de formation pour approfondir votre foi et développer vos compétences.',
    icon: <GraduationCap size={32} />,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    path: '/learning',
    features: ['Cours interactifs', 'Quiz ludiques', 'Certificats'],
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkAuth();
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setMenuOpen(false);
  };

  const handleAuthSuccess = async () => {
    await checkAuth();
    setShowAuthModal(false);
  };

  const isAdmin = profile?.role && ['admin', 'pastor', 'leader'].includes(profile.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={22} />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 leading-tight">ADD Poissy</h1>
                <p className="text-xs text-gray-500">Communauté & Services</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => navigate(feature.path)}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  {feature.title}
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {profile?.full_name?.split(' ')[0] || 'Mon compte'}
                    </span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {menuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-medium text-gray-900">{profile?.full_name || 'Utilisateur'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        
                        {isAdmin && (
                          <button
                            onClick={() => { navigate('/admin'); setMenuOpen(false); }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                          >
                            <Settings size={18} />
                            Administration
                          </button>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3"
                        >
                          <LogOut size={18} />
                          Déconnexion
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <LogIn size={16} />
                  <span className="hidden sm:block">Connexion</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => { navigate(feature.path); setMenuOpen(false); }}
                className="w-full py-3 text-left text-gray-700 hover:text-gray-900 font-medium border-b border-gray-50"
              >
                {feature.title}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-600 mb-8 shadow-sm">
            <Heart className="text-red-500" size={16} />
            Bienvenue dans notre communauté
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Connectez-vous,
            <span className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 bg-clip-text text-transparent"> grandissez</span>,
            <br />servez ensemble
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Découvrez les services de l'église, proposez votre aide à la communauté, 
            et profitez de nos formations en ligne.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/forum')}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Explorer les services
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/learning')}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all border border-gray-200 flex items-center justify-center gap-2"
            >
              <BookOpen size={20} />
              Commencer à apprendre
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tout en un seul endroit
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Trois espaces dédiés pour faciliter votre engagement dans la vie de l'église
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() => navigate(feature.path)}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{feature.subtitle}</p>
                <p className="text-gray-600 mb-6">{feature.description}</p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all`}>
                  Accéder
                  <ArrowRight size={16} className={`text-${feature.color}-500`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '12+', label: 'Services actifs' },
              { value: '150+', label: 'Membres engagés' },
              { value: '20+', label: 'Formations' },
              { value: '∞', label: 'Amour partagé' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <MessageCircle className="mx-auto text-teal-400 mb-6" size={48} />
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Prêt à vous engager ?
              </h2>
              <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                Rejoignez une communauté dynamique où chacun a sa place. 
                Vos talents sont précieux et peuvent faire la différence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/services')}
                  className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Proposer mon aide
                </button>
                <button
                  onClick={() => navigate('/forum')}
                  className="px-8 py-4 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  Découvrir les services
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Sparkles size={18} className="text-teal-500" />
            <span className="text-sm">Église Évangélique ADD Poissy</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <button onClick={() => navigate('/forum')} className="hover:text-gray-700">Forum</button>
            <button onClick={() => navigate('/services')} className="hover:text-gray-700">Conciergerie</button>
            <button onClick={() => navigate('/learning')} className="hover:text-gray-700">Formation</button>
            {isAdmin && (
              <button onClick={() => navigate('/admin')} className="hover:text-gray-700">Admin</button>
            )}
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        defaultMode="login"
      />
    </div>
  );
};
