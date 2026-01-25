import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, Target, Flame, ChevronRight, Play, LogIn } from 'lucide-react';
import { supabase, Course, CourseEnrollment, UserLearningStats, UserBadge, LearningBadge, Profile } from '../../../lib/supabase';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { DifficultyBadge } from '../common/DifficultyBadge';
import { AuthModal } from '../common/AuthModal';

interface EnrolledCourse extends Course {
  enrollment: CourseEnrollment;
  teacher?: Profile;
}

interface CourseWithTeacher extends Course {
  teacher?: Profile;
}

interface StudentDashboardProps {
  onSelectCourse: (course: EnrolledCourse | CourseWithTeacher) => void;
  onBrowseCatalog: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onSelectCourse,
  onBrowseCatalog,
}) => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [publicCourses, setPublicCourses] = useState<CourseWithTeacher[]>([]);
  const [stats, setStats] = useState<UserLearningStats | null>(null);
  const [badges, setBadges] = useState<(UserBadge & { badge: LearningBadge })[]>([]);
  const [allBadges, setAllBadges] = useState<LearningBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (!user) {
        // Fetch public courses for non-authenticated users
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(5);

        if (coursesData) {
          const coursesWithTeachers = await Promise.all(
            coursesData.map(async (course) => {
              const { data: teacher } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', course.teacher_id)
                .single();
              return { ...course, teacher } as CourseWithTeacher;
            })
          );
          setPublicCourses(coursesWithTeachers);
        }
        setLoading(false);
        return;
      }

      // Fetch enrolled courses
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .order('last_accessed_at', { ascending: false });

      if (enrollments) {
        const coursesWithDetails = await Promise.all(
          enrollments.map(async (enrollment) => {
            const { data: course } = await supabase
              .from('courses')
              .select('*')
              .eq('id', enrollment.course_id)
              .single();

            const { data: teacher } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', course?.teacher_id)
              .single();

            return { ...course, enrollment, teacher } as EnrolledCourse;
          })
        );
        setEnrolledCourses(coursesWithDetails.filter(c => c.id));
      }

      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_learning_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (statsError) {
        console.error('Error fetching stats:', statsError);
      }
      setStats(statsData);

      // Fetch user badges
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id);

      if (userBadges) {
        const badgesWithDetails = await Promise.all(
          userBadges.map(async (ub) => {
            const { data: badge } = await supabase
              .from('learning_badges')
              .select('*')
              .eq('id', ub.badge_id)
              .single();
            return { ...ub, badge } as UserBadge & { badge: LearningBadge };
          })
        );
        setBadges(badgesWithDetails.filter(b => b.badge));
      }

      // Fetch all badges for display
      const { data: allBadgesData } = await supabase
        .from('learning_badges')
        .select('*');
      setAllBadges(allBadgesData || []);

    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const earnedBadgeIds = new Set(badges.map(b => b.badge_id));
  const inProgressCourses = enrolledCourses.filter(c => c.enrollment.progress_percentage < 100);
  const completedCourses = enrolledCourses.filter(c => c.enrollment.progress_percentage === 100);

  const handleEnrollCourse = async (courseId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setPendingCourseId(courseId);
      setShowAuthModal(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress_percentage: 0,
        });

      if (error) throw error;
      
      // Refresh data
      fetchDashboardData();
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleAuthSuccess = async () => {
    await fetchDashboardData();
    
    if (pendingCourseId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const { error } = await supabase
            .from('course_enrollments')
            .insert({
              user_id: user.id,
              course_id: pendingCourseId,
              progress_percentage: 0,
            });

          if (!error) {
            await fetchDashboardData();
          }
        } catch (err) {
          console.error('Erreur:', err);
        }
      }
      setPendingCourseId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview - Only for authenticated users */}
      {isAuthenticated && (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Trophy className="text-teal-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_points || 0}</p>
              <p className="text-sm text-gray-500">Points</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_steps_completed || 0}</p>
              <p className="text-sm text-gray-500">Étapes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_courses_completed || 0}</p>
              <p className="text-sm text-gray-500">Cours terminés</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.current_streak || 0}</p>
              <p className="text-sm text-gray-500">Jours consécutifs</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Continue Learning or Public Courses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isAuthenticated ? "Continuer l'apprentissage" : "Cours disponibles"}
          </h2>
          <button
            onClick={onBrowseCatalog}
            className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
          >
            Parcourir le catalogue
            <ChevronRight size={16} />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="space-y-4">
            {publicCourses.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours disponible</h3>
                <p className="text-gray-600">Revenez plus tard pour découvrir nos formations</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <LogIn className="text-teal-600" size={24} />
                    <h3 className="text-lg font-semibold text-gray-900">Connectez-vous pour commencer</h3>
                  </div>
                  <p className="text-gray-600">Créez un compte gratuit pour accéder à tous nos cours et suivre votre progression.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {publicCourses.map(course => (
                    <div
                      key={course.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="h-40 bg-gradient-to-br from-teal-400 to-blue-500 relative">
                        {course.image_url ? (
                          <img src={course.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="text-white/70" size={48} />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DifficultyBadge level={course.difficulty_level} />
                          <span className="text-xs text-gray-500">{course.estimated_duration} min</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                        {course.teacher && (
                          <p className="text-xs text-gray-500 mb-3">Par {course.teacher.full_name}</p>
                        )}
                        <button
                          onClick={() => handleEnrollCourse(course.id)}
                          className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <LogIn size={16} />
                          S'inscrire au cours
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : inProgressCourses.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours en cours</h3>
            <p className="text-gray-600 mb-4">Commencez votre parcours d'apprentissage !</p>
            <button
              onClick={onBrowseCatalog}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Découvrir les cours
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressCourses.slice(0, 4).map(course => (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    {course.image_url ? (
                      <img src={course.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <BookOpen className="text-white/70" size={32} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors truncate">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{course.teacher?.full_name}</p>
                    <ProgressBar progress={course.enrollment.progress_percentage} size="sm" showLabel />
                  </div>
                  <button className="self-center p-2 bg-teal-50 rounded-full group-hover:bg-teal-100 transition-colors">
                    <Play className="text-teal-600" size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges - Only for authenticated users */}
      {isAuthenticated && (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Mes badges</h2>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-wrap gap-6 justify-center">
            {allBadges.map(badge => (
              <Badge
                key={badge.id}
                badge={badge}
                earned={earnedBadgeIds.has(badge.id)}
                showDetails
              />
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Completed Courses - Only for authenticated users */}
      {isAuthenticated && completedCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cours terminés</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedCourses.map(course => (
              <div key={course.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Trophy className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-500">Terminé</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingCourseId(null);
        }}
        onSuccess={handleAuthSuccess}
        defaultMode="signup"
      />
    </div>
  );
};
