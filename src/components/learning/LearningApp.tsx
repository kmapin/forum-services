import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, ArrowLeft, Home, Plus, Settings, X, LogOut, ChevronDown } from 'lucide-react';
import { supabase, Profile } from '../../lib/supabase';
import { StudentDashboard } from './student/StudentDashboard';
import { CourseCatalog } from './student/CourseCatalog';
import { CoursePlayer } from './student/CoursePlayer';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { PathEditor } from './teacher/PathEditor';
import { StudentProgress } from './teacher/StudentProgress';
import { Course } from '../../lib/supabase';

type View = 'home' | 'catalog' | 'course' | 'teacher' | 'editor' | 'students';

interface LearningAppProps {
  onBack?: () => void;
}

export const LearningApp: React.FC<LearningAppProps> = ({ onBack }) => {
  const [, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [view, setView] = useState<View>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', category: '', difficulty_level: 'beginner' as const });
  const [creating, setCreating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const isTeacher = profile?.role && ['admin', 'pastor', 'leader', 'teacher'].includes(profile.role);

  const handleSelectCourse = (course: any) => {
    setSelectedCourseId(course.id);
    setView('course');
  };

  const handleEditCourse = (course: any) => {
    setSelectedCourseId(course.id);
    setView('editor');
  };

  const handleViewStats = (course: Course) => {
    setSelectedCourse(course);
    setView('students');
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim()) return;
    
    try {
      setCreating(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: newCourse.title,
          description: newCourse.description,
          category: newCourse.category || 'general',
          difficulty_level: newCourse.difficulty_level,
          teacher_id: user.id,
          is_published: false,
        })
        .select()
        .single();

      if (error) throw error;
      
      setShowCreateModal(false);
      setNewCourse({ title: '', description: '', category: '', difficulty_level: 'beginner' });
      setSelectedCourseId(data.id);
      setView('editor');
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setView('home');
      setMenuOpen(false);
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="flex items-center gap-2">
                <GraduationCap className="text-teal-600" size={28} />
                <h1 className="text-xl font-bold text-gray-900">Formation</h1>
              </div>
            </div>

            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setView('home')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'home' 
                    ? 'bg-teal-100 text-teal-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home size={18} className="inline mr-1" />
                <span className="hidden sm:inline">Accueil</span>
              </button>
              <button
                onClick={() => setView('catalog')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'catalog' 
                    ? 'bg-teal-100 text-teal-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BookOpen size={18} className="inline mr-1" />
                <span className="hidden sm:inline">Catalogue</span>
              </button>
              {isTeacher && (
                <>
                  <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />
                  <button
                    onClick={() => setView('teacher')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      view === 'teacher' || view === 'editor' || view === 'students'
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Settings size={18} className="inline mr-1" />
                    <span className="hidden sm:inline">Gérer</span>
                  </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-1"
                  >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Créer</span>
                  </button>
                </>
              )}
            </nav>

            {profile && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-teal-600 font-semibold text-sm">
                        {profile.full_name?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {profile.full_name?.split(' ')[0] || 'Mon compte'}
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{profile.full_name}</p>
                        <p className="text-sm text-gray-500">{profile.role}</p>
                      </div>
                      
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
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'home' && (
          <StudentDashboard
            onSelectCourse={handleSelectCourse}
            onBrowseCatalog={() => setView('catalog')}
          />
        )}

        {view === 'catalog' && (
          <CourseCatalog onSelectCourse={handleSelectCourse} />
        )}

        {view === 'teacher' && (
          <TeacherDashboard
            onCreateCourse={() => {
              // TODO: Course creation modal
              console.log('Create course');
            }}
            onEditCourse={handleEditCourse}
            onViewStats={handleViewStats}
          />
        )}

        {view === 'students' && selectedCourse && (
          <StudentProgress
            course={selectedCourse}
            onBack={() => setView('teacher')}
          />
        )}

        {view === 'editor' && selectedCourseId && (
          <PathEditor
            courseId={selectedCourseId}
            onBack={() => setView('teacher')}
          />
        )}

        {view === 'course' && selectedCourseId && (
          <CoursePlayer
            courseId={selectedCourseId}
            onBack={() => setView('home')}
          />
        )}
      </main>

      {/* Modal Création de Cours */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Nouveau cours</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre du cours *</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="Ex: Introduction à la Bible"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Décrivez le contenu et les objectifs du cours..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="bible">Étude biblique</option>
                    <option value="theology">Théologie</option>
                    <option value="leadership">Leadership</option>
                    <option value="worship">Louange</option>
                    <option value="ministry">Ministère</option>
                    <option value="general">Général</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <select
                    value={newCourse.difficulty_level}
                    onChange={(e) => setNewCourse({ ...newCourse, difficulty_level: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateCourse}
                disabled={!newCourse.title.trim() || creating}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Créer le cours
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
