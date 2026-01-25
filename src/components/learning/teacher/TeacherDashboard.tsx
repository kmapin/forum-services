import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Users, Eye, Edit2, Trash2, BarChart3, CheckCircle } from 'lucide-react';
import { supabase, Course } from '../../../lib/supabase';
import { DifficultyBadge } from '../common/DifficultyBadge';

interface CourseWithStats extends Course {
  students_count: number;
  completion_rate: number;
}

interface TeacherDashboardProps {
  onCreateCourse: () => void;
  onEditCourse: (course: Course) => void;
  onViewStats: (course: Course) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onCreateCourse,
  onEditCourse,
  onViewStats,
}) => {
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer tous les cours (commentez la ligne .eq pour voir tous les cours)
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select('*')
        // .eq('teacher_id', user.id) // Décommentez pour filtrer par enseignant
        .order('created_at', { ascending: false });

      if (error) throw error;

      const coursesWithStats = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { count: studentsCount } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          const { data: enrollments } = await supabase
            .from('course_enrollments')
            .select('progress_percentage')
            .eq('course_id', course.id);

          const completedCount = enrollments?.filter(e => e.progress_percentage === 100).length || 0;
          const completionRate = enrollments?.length 
            ? Math.round((completedCount / enrollments.length) * 100) 
            : 0;

          return {
            ...course,
            students_count: studentsCount || 0,
            completion_rate: completionRate,
          };
        })
      );

      setCourses(coursesWithStats);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      setCourses(prev => prev.filter(c => c.id !== courseId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const togglePublish = async (course: CourseWithStats) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !course.is_published })
        .eq('id', course.id);

      if (error) throw error;
      setCourses(prev => prev.map(c => 
        c.id === course.id ? { ...c, is_published: !c.is_published } : c
      ));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const publishedCourses = courses.filter(c => c.is_published);
  const draftCourses = courses.filter(c => !c.is_published);
  const totalStudents = courses.reduce((sum, c) => sum + c.students_count, 0);

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              <p className="text-gray-500">Cours créés</p>
            </div>
            <BookOpen className="text-teal-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              <p className="text-gray-500">Étudiants inscrits</p>
            </div>
            <Users className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{publishedCourses.length}</p>
              <p className="text-gray-500">Cours publiés</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Mes cours</h2>
        <button
          onClick={onCreateCourse}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          <Plus size={18} />
          Nouveau cours
        </button>
      </div>

      {/* Drafts */}
      {draftCourses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Brouillons</h3>
          <div className="space-y-3">
            {draftCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={() => onEditCourse(course)}
                onDelete={() => setDeleteConfirm(course.id)}
                onTogglePublish={() => togglePublish(course)}
                onViewStats={() => onViewStats(course)}
                deleteConfirm={deleteConfirm === course.id}
                onCancelDelete={() => setDeleteConfirm(null)}
                onConfirmDelete={() => handleDelete(course.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Published */}
      {publishedCourses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Publiés</h3>
          <div className="space-y-3">
            {publishedCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={() => onEditCourse(course)}
                onDelete={() => setDeleteConfirm(course.id)}
                onTogglePublish={() => togglePublish(course)}
                onViewStats={() => onViewStats(course)}
                deleteConfirm={deleteConfirm === course.id}
                onCancelDelete={() => setDeleteConfirm(null)}
                onConfirmDelete={() => handleDelete(course.id)}
              />
            ))}
          </div>
        </div>
      )}

      {courses.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours créé</h3>
          <p className="text-gray-600 mb-4">Commencez par créer votre premier cours</p>
          <button
            onClick={onCreateCourse}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Créer un cours
          </button>
        </div>
      )}
    </div>
  );
};

interface CourseCardProps {
  course: CourseWithStats;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  onViewStats: () => void;
  deleteConfirm: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  onTogglePublish,
  onViewStats,
  deleteConfirm,
  onCancelDelete,
  onConfirmDelete,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          {course.image_url ? (
            <img src={course.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <BookOpen className="text-white/70" size={28} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 truncate">{course.title}</h4>
            <DifficultyBadge level={course.difficulty_level} size="sm" />
            {!course.is_published && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                Brouillon
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {course.students_count} inscrits
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 size={14} />
              {course.completion_rate}% terminé
            </span>
          </div>
        </div>

        {deleteConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-600">Supprimer ?</span>
            <button
              onClick={onConfirmDelete}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Oui
            </button>
            <button
              onClick={onCancelDelete}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              Non
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onViewStats}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              title="Statistiques"
            >
              <BarChart3 size={18} />
            </button>
            <button
              onClick={onTogglePublish}
              className={`p-2 rounded-lg ${
                course.is_published 
                  ? 'text-green-600 hover:bg-green-50' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title={course.is_published ? 'Dépublier' : 'Publier'}
            >
              <Eye size={18} />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Modifier"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
