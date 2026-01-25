import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, Users, ChevronRight } from 'lucide-react';
import { supabase, Course, CourseEnrollment, Profile } from '../../../lib/supabase';
import { ProgressBar } from '../common/ProgressBar';
import { DifficultyBadge } from '../common/DifficultyBadge';

interface CourseWithEnrollment extends Course {
  teacher?: Profile;
  enrollment?: CourseEnrollment;
  students_count?: number;
}

interface CourseCatalogProps {
  onSelectCourse: (course: CourseWithEnrollment) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ onSelectCourse }) => {
  const [courses, setCourses] = useState<CourseWithEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      const { data: coursesData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const coursesWithDetails = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { data: teacher } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', course.teacher_id)
            .single();

          let enrollment = null;
          if (user) {
            const { data: enrollmentData } = await supabase
              .from('course_enrollments')
              .select('*')
              .eq('course_id', course.id)
              .eq('user_id', user.id)
              .single();
            enrollment = enrollmentData;
          }

          const { count } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          return {
            ...course,
            teacher,
            enrollment,
            students_count: count || 0,
          };
        })
      );

      setCourses(coursesWithDetails);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(courses.map(c => c.category))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'Tous' : category}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours trouvé</h3>
          <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
            >
              <div className="relative h-40 bg-gradient-to-br from-teal-400 to-blue-500">
                {course.image_url ? (
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="text-white/50" size={48} />
                  </div>
                )}
                {course.is_featured && (
                  <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                    ⭐ Recommandé
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <ChevronRight className="text-gray-400 group-hover:text-teal-500 transition-colors flex-shrink-0" size={20} />
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <DifficultyBadge level={course.difficulty_level} size="sm" />
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {course.estimated_duration} min
                  </div>
                </div>

                {course.enrollment && (
                  <div className="mb-3">
                    <ProgressBar progress={course.enrollment.progress_percentage} showLabel size="sm" />
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {course.teacher?.full_name || 'Enseignant'}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <Users size={14} className="mr-1" />
                    {course.students_count} inscrits
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
