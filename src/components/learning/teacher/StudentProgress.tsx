import React, { useState, useEffect } from 'react';
import { Users, Search, ChevronDown, ChevronRight, CheckCircle, Clock, XCircle, FileText, Trophy, Target } from 'lucide-react';
import { supabase, Course, Profile, CourseEnrollment, StepProgress, LearningPath, LearningStep } from '../../../lib/supabase';
import { ProgressBar } from '../common/ProgressBar';

interface StudentProgressProps {
  course: Course;
  onBack: () => void;
}

interface StudentData {
  profile: Profile;
  enrollment: CourseEnrollment;
  stepsProgress: StepProgress[];
  qcmResults: {
    total: number;
    correct: number;
    avgScore: number;
  };
}

interface PathWithSteps extends LearningPath {
  steps: LearningStep[];
}

export const StudentProgress: React.FC<StudentProgressProps> = ({ course, onBack }) => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [paths, setPaths] = useState<PathWithSteps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'qcm' | 'exercises'>('overview');

  useEffect(() => {
    fetchData();
  }, [course.id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch course paths and steps
      const { data: pathsData } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('course_id', course.id)
        .order('order_index');

      const pathsWithSteps = await Promise.all(
        (pathsData || []).map(async (path) => {
          const { data: steps } = await supabase
            .from('learning_steps')
            .select('*')
            .eq('path_id', path.id)
            .order('order_index');
          return { ...path, steps: steps || [] };
        })
      );
      setPaths(pathsWithSteps);

      // Fetch enrollments
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('course_id', course.id)
        .order('enrolled_at', { ascending: false });

      // Fetch student data for each enrollment
      const studentsData = await Promise.all(
        (enrollments || []).map(async (enrollment) => {
          // Get profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', enrollment.user_id)
            .single();

          // Get step progress
          const allStepIds = pathsWithSteps.flatMap((p: PathWithSteps) => p.steps.map((s: LearningStep) => s.id));
          const { data: stepsProgress } = await supabase
            .from('step_progress')
            .select('*')
            .eq('user_id', enrollment.user_id)
            .in('step_id', allStepIds.length > 0 ? allStepIds : ['none']);

          // Get QCM results
          const qcmStepIds = pathsWithSteps
            .flatMap((p: PathWithSteps) => p.steps.filter((s: LearningStep) => s.step_type === 'qcm').map((s: LearningStep) => s.id));
          
          let qcmResults = { total: 0, correct: 0, avgScore: 0 };
          
          if (qcmStepIds.length > 0) {
            const { data: qcmQuestions } = await supabase
              .from('qcm_questions')
              .select('id')
              .in('step_id', qcmStepIds);

            if (qcmQuestions && qcmQuestions.length > 0) {
              const { data: answers } = await supabase
                .from('qcm_answers')
                .select('*')
                .eq('user_id', enrollment.user_id)
                .in('question_id', qcmQuestions.map(q => q.id));

              if (answers) {
                qcmResults = {
                  total: answers.length,
                  correct: answers.filter(a => a.is_correct).length,
                  avgScore: answers.length > 0 
                    ? Math.round((answers.filter(a => a.is_correct).length / answers.length) * 100)
                    : 0,
                };
              }
            }
          }

          return {
            profile: profile || { id: enrollment.user_id, full_name: 'Utilisateur inconnu' } as Profile,
            enrollment,
            stepsProgress: stepsProgress || [],
            qcmResults,
          };
        })
      );

      setStudents(studentsData);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.profile.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSteps = paths.reduce((sum, p) => sum + p.steps.length, 0);

  const getStudentStats = (student: StudentData) => {
    const completedSteps = student.stepsProgress.filter(sp => sp.status === 'completed').length;
    const inProgressSteps = student.stepsProgress.filter(sp => sp.status === 'in_progress').length;
    return { completedSteps, inProgressSteps };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 text-sm mb-2"
          >
            ← Retour aux cours
          </button>
          <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
          <p className="text-gray-500">Suivi des {students.length} étudiant(s)</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              <p className="text-sm text-gray-500">Inscrits</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter(s => s.enrollment.progress_percentage === 100).length}
              </p>
              <p className="text-sm text-gray-500">Terminé</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter(s => s.enrollment.progress_percentage > 0 && s.enrollment.progress_percentage < 100).length}
              </p>
              <p className="text-sm text-gray-500">En cours</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Trophy className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {students.length > 0 
                  ? Math.round(students.reduce((sum, s) => sum + s.qcmResults.avgScore, 0) / students.length)
                  : 0}%
              </p>
              <p className="text-sm text-gray-500">Score QCM moyen</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: Target },
          { id: 'qcm', label: 'Résultats QCM', icon: FileText },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedView(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === id
                ? 'bg-teal-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher un étudiant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun étudiant</h3>
          <p className="text-gray-600">Aucun étudiant n'est inscrit à ce cours</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((student) => {
            const stats = getStudentStats(student);
            const isExpanded = expandedStudent === student.profile.id;

            return (
              <div key={student.profile.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Student Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedStudent(isExpanded ? null : student.profile.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {student.profile.avatar_url ? (
                        <img src={student.profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-teal-600 font-semibold text-lg">
                          {student.profile.full_name?.charAt(0) || '?'}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{student.profile.full_name || 'Utilisateur'}</h4>
                        {student.enrollment.progress_percentage === 100 && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Terminé
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{student.profile.email}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{student.enrollment.progress_percentage}%</p>
                        <p className="text-gray-500">Progression</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{stats.completedSteps}/{totalSteps}</p>
                        <p className="text-gray-500">Étapes</p>
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold ${
                          student.qcmResults.avgScore >= 80 ? 'text-green-600' :
                          student.qcmResults.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {student.qcmResults.avgScore}%
                        </p>
                        <p className="text-gray-500">Score QCM</p>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="text-gray-400">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <ProgressBar progress={student.enrollment.progress_percentage} size="sm" />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    {selectedView === 'overview' && (
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-700">Progression par parcours</h5>
                        {paths.map((path) => {
                          const pathSteps = path.steps;
                          const completedInPath = student.stepsProgress
                            .filter(sp => pathSteps.some(s => s.id === sp.step_id) && sp.status === 'completed')
                            .length;
                          const pathProgress = pathSteps.length > 0 
                            ? Math.round((completedInPath / pathSteps.length) * 100)
                            : 0;

                          return (
                            <div key={path.id} className="bg-white p-3 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-900">{path.title}</span>
                                <span className="text-sm text-gray-500">{completedInPath}/{pathSteps.length} étapes</span>
                              </div>
                              <ProgressBar progress={pathProgress} size="sm" color="blue" />
                              
                              {/* Steps detail */}
                              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                                {pathSteps.map((step) => {
                                  const stepProgress = student.stepsProgress.find(sp => sp.step_id === step.id);
                                  const status = stepProgress?.status || 'not_started';
                                  
                                  return (
                                    <div
                                      key={step.id}
                                      className={`p-2 rounded text-xs flex items-center gap-1 ${
                                        status === 'completed' ? 'bg-green-50 text-green-700' :
                                        status === 'in_progress' ? 'bg-yellow-50 text-yellow-700' :
                                        'bg-gray-100 text-gray-500'
                                      }`}
                                    >
                                      {status === 'completed' ? <CheckCircle size={12} /> :
                                       status === 'in_progress' ? <Clock size={12} /> :
                                       <XCircle size={12} />}
                                      <span className="truncate">{step.title}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {selectedView === 'qcm' && (
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-700">Résultats aux QCM</h5>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-gray-900">{student.qcmResults.total}</p>
                              <p className="text-sm text-gray-500">Questions répondues</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-green-600">{student.qcmResults.correct}</p>
                              <p className="text-sm text-gray-500">Réponses correctes</p>
                            </div>
                            <div>
                              <p className={`text-2xl font-bold ${
                                student.qcmResults.avgScore >= 80 ? 'text-green-600' :
                                student.qcmResults.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {student.qcmResults.avgScore}%
                              </p>
                              <p className="text-sm text-gray-500">Score moyen</p>
                            </div>
                          </div>
                          
                          {/* Visual Score Bar */}
                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>0%</span>
                              <span>100%</span>
                            </div>
                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  student.qcmResults.avgScore >= 80 ? 'bg-green-500' :
                                  student.qcmResults.avgScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${student.qcmResults.avgScore}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="mt-4 pt-4 border-t flex gap-6 text-xs text-gray-500">
                      <span>
                        Inscrit le {new Date(student.enrollment.enrolled_at).toLocaleDateString('fr-FR')}
                      </span>
                      <span>
                        Dernière activité: {new Date(student.enrollment.last_accessed_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
