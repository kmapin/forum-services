import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, BookOpen, Video, Headphones, ClipboardList, FileText } from 'lucide-react';
import { supabase, Course, LearningPath, LearningStep } from '../../../lib/supabase';
import { QCMPlayer } from './QCMPlayer';
import ReactMarkdown from 'react-markdown';

interface CoursePlayerProps {
  courseId: string;
  onBack: () => void;
}

interface PathWithSteps extends LearningPath {
  steps: LearningStep[];
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ courseId, onBack }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [paths, setPaths] = useState<PathWithSteps[]>([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch course
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      setCourse(courseData);

      // Fetch paths with steps
      const { data: pathsData } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (pathsData) {
        const pathsWithSteps = await Promise.all(
          pathsData.map(async (path) => {
            const { data: stepsData } = await supabase
              .from('learning_steps')
              .select('*')
              .eq('path_id', path.id)
              .order('order_index', { ascending: true });
            return { ...path, steps: stepsData || [] };
          })
        );
        setPaths(pathsWithSteps);
      }

      // Fetch completed steps
      const { data: progressData } = await supabase
        .from('step_progress')
        .select('step_id')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      if (progressData) {
        setCompletedSteps(new Set(progressData.map(p => p.step_id)));
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentPath = paths[currentPathIndex];
  const currentStep = currentPath?.steps[currentStepIndex];

  const handleStepComplete = async (score?: number) => {
    if (!currentStep) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mark step as completed
      const { error } = await supabase
        .from('step_progress')
        .upsert({
          user_id: user.id,
          step_id: currentStep.id,
          status: 'completed',
          score: score || 0,
          completed_at: new Date().toISOString(),
        });

      if (!error) {
        setCompletedSteps(prev => new Set([...prev, currentStep.id]));
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const goToNextStep = () => {
    if (!currentPath) return;

    if (currentStepIndex < currentPath.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else if (currentPathIndex < paths.length - 1) {
      setCurrentPathIndex(prev => prev + 1);
      setCurrentStepIndex(0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (currentPathIndex > 0) {
      setCurrentPathIndex(prev => prev - 1);
      const prevPath = paths[currentPathIndex - 1];
      setCurrentStepIndex(prevPath.steps.length - 1);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText size={20} />;
      case 'video': return <Video size={20} />;
      case 'audio': return <Headphones size={20} />;
      case 'qcm': return <ClipboardList size={20} />;
      case 'exercise': return <BookOpen size={20} />;
      default: return <FileText size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!course || !currentPath || !currentStep) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <p className="text-gray-600">Aucun contenu disponible</p>
        <button onClick={onBack} className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg">
          Retour
        </button>
      </div>
    );
  }

  const isStepCompleted = completedSteps.has(currentStep.id);
  const canGoNext = currentPathIndex < paths.length - 1 || currentStepIndex < currentPath.steps.length - 1;
  const canGoPrev = currentPathIndex > 0 || currentStepIndex > 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour au cours
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Parcours {currentPathIndex + 1}/{paths.length}</span>
          <span>•</span>
          <span>Étape {currentStepIndex + 1}/{currentPath.steps.length}</span>
        </div>
      </div>

      {/* Sidebar with steps */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">Parcours</h3>
            <div className="space-y-2">
              {paths.map((path, pathIdx) => (
                <div key={path.id}>
                  <button
                    onClick={() => {
                      setCurrentPathIndex(pathIdx);
                      setCurrentStepIndex(0);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathIdx === currentPathIndex
                        ? 'bg-teal-100 text-teal-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {path.title}
                  </button>
                  {pathIdx === currentPathIndex && (
                    <div className="ml-4 mt-2 space-y-1">
                      {path.steps.map((step, stepIdx) => (
                        <button
                          key={step.id}
                          onClick={() => setCurrentStepIndex(stepIdx)}
                          className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center gap-2 transition-colors ${
                            stepIdx === currentStepIndex
                              ? 'bg-teal-50 text-teal-700'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {getStepIcon(step.step_type)}
                          <span className="flex-1 truncate">{step.title}</span>
                          {completedSteps.has(step.id) && (
                            <CheckCircle size={14} className="text-green-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                {getStepIcon(currentStep.step_type)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{currentStep.title}</h2>
                <p className="text-sm text-gray-500">{currentPath.title}</p>
              </div>
              {isStepCompleted && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">Terminé</span>
                </div>
              )}
            </div>

            {/* Step content */}
            <div className="prose max-w-none">
              {currentStep.step_type === 'qcm' ? (
                <QCMPlayer
                  stepId={currentStep.id}
                  onComplete={(score) => {
                    handleStepComplete(score);
                  }}
                />
              ) : currentStep.step_type === 'text' && (currentStep.content as any)?.body ? (
                <ReactMarkdown>{(currentStep.content as any).body}</ReactMarkdown>
              ) : currentStep.step_type === 'video' && (currentStep.content as any)?.video_url ? (
                <div>
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <Video className="text-gray-400" size={48} />
                  </div>
                  {(currentStep.content as any).description && (
                    <p className="text-sm text-gray-600 mb-2">{(currentStep.content as any).description}</p>
                  )}
                  <a
                    href={(currentStep.content as any).video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline"
                  >
                    Ouvrir la vidéo
                  </a>
                </div>
              ) : currentStep.step_type === 'exercise' && (currentStep.content as any)?.instructions ? (
                <div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
                    <ReactMarkdown>{(currentStep.content as any).instructions}</ReactMarkdown>
                  </div>
                  <textarea
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Écrivez votre réponse ici..."
                  />
                  <button
                    onClick={() => handleStepComplete()}
                    className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                  >
                    Soumettre
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">Contenu non disponible</p>
              )}
            </div>

            {/* Navigation */}
            {currentStep.step_type !== 'qcm' && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <button
                  onClick={goToPreviousStep}
                  disabled={!canGoPrev}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                  Précédent
                </button>
                <button
                  onClick={() => {
                    if (!isStepCompleted) handleStepComplete();
                    goToNextStep();
                  }}
                  disabled={!canGoNext}
                  className="flex items-center gap-2 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
