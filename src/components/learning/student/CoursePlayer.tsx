import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, BookOpen, Video, Headphones, ClipboardList, FileText } from 'lucide-react';
import { supabase, Course, LearningPath, LearningStep } from '../../../lib/supabase';
import { QCMPlayer } from './QCMPlayer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
            <div className="prose prose-lg max-w-none">
              {currentStep.step_type === 'qcm' ? (
                <QCMPlayer
                  stepId={currentStep.id}
                  onComplete={(score) => {
                    handleStepComplete(score);
                  }}
                />
              ) : currentStep.step_type === 'text' && (currentStep.content as any)?.body ? (
                <div className="space-y-4">
                  {/* Audio Narration */}
                  {(currentStep.content as any)?.audio_url && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <Headphones className="text-purple-600" size={20} />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900">Narration audio</h4>
                      </div>
                      <audio
                        src={(currentStep.content as any).audio_url}
                        controls
                        className="w-full"
                      >
                        Votre navigateur ne supporte pas la lecture audio.
                      </audio>
                    </div>
                  )}
                  
                  {/* Text Content */}
                  <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-em:text-gray-700 prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-a:text-teal-600 prose-img:rounded-lg prose-img:shadow-md prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-3 prose-th:font-semibold prose-td:border prose-td:border-gray-300 prose-td:p-3 prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:pl-4 prose-blockquote:italic">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        img: ({ node, ...props }) => (
                          <img {...props} className="rounded-lg shadow-md max-w-full h-auto" loading="lazy" />
                        ),
                        a: ({ node, ...props }) => (
                          <a {...props} className="text-teal-600 hover:text-teal-700 underline" target="_blank" rel="noopener noreferrer" />
                        ),
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-4">
                            <table {...props} className="min-w-full border-collapse" />
                          </div>
                        ),
                      }}
                    >
                      {(currentStep.content as any).body}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : currentStep.step_type === 'video' && (currentStep.content as any)?.video_url ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    {(currentStep.content as any).video_url.includes('youtube.com') || 
                     (currentStep.content as any).video_url.includes('youtu.be') ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${
                          (currentStep.content as any).video_url.includes('youtu.be')
                            ? (currentStep.content as any).video_url.split('youtu.be/')[1]
                            : new URLSearchParams(new URL((currentStep.content as any).video_url).search).get('v')
                        }`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (currentStep.content as any).video_url.includes('vimeo.com') ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${(currentStep.content as any).video_url.split('vimeo.com/')[1]}`}
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={(currentStep.content as any).video_url}
                        controls
                        className="w-full h-full"
                      >
                        Votre navigateur ne supporte pas la lecture vidéo.
                      </video>
                    )}
                  </div>
                  {(currentStep.content as any).description && (
                    <p className="text-sm text-gray-600">{(currentStep.content as any).description}</p>
                  )}
                </div>
              ) : currentStep.step_type === 'audio' && (currentStep.content as any)?.audio_url ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Headphones className="text-purple-600" size={24} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Contenu audio</h3>
                    </div>
                    <audio
                      src={(currentStep.content as any).audio_url}
                      controls
                      className="w-full"
                    >
                      Votre navigateur ne supporte pas la lecture audio.
                    </audio>
                  </div>
                  {(currentStep.content as any).description && (
                    <p className="text-sm text-gray-600">{(currentStep.content as any).description}</p>
                  )}
                </div>
              ) : currentStep.step_type === 'exercise' && (currentStep.content as any)?.instructions ? (
                <div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {(currentStep.content as any).instructions}
                      </ReactMarkdown>
                    </div>
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
