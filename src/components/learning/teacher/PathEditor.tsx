import React, { useState, useEffect } from 'react';
import { Plus, GripVertical, Edit2, Trash2, FileText, Video, Music, HelpCircle, PenTool, ChevronUp, ChevronDown, Save, X, Settings } from 'lucide-react';
import { supabase, LearningPath, LearningStep, StepType } from '../../../lib/supabase';
import { QCMEditor } from './QCMEditor';
import { RichTextEditor } from './RichTextEditor';
import { AudioRecorder } from './AudioRecorder';
import { MediaUploader } from './MediaUploader';

interface PathEditorProps {
  courseId: string;
  onBack: () => void;
}

const stepTypeConfig: Record<StepType, { icon: React.ReactNode; label: string; color: string }> = {
  text: { icon: <FileText size={18} />, label: 'Texte', color: 'bg-blue-100 text-blue-700' },
  video: { icon: <Video size={18} />, label: 'Vidéo', color: 'bg-red-100 text-red-700' },
  audio: { icon: <Music size={18} />, label: 'Audio', color: 'bg-purple-100 text-purple-700' },
  qcm: { icon: <HelpCircle size={18} />, label: 'QCM', color: 'bg-green-100 text-green-700' },
  exercise: { icon: <PenTool size={18} />, label: 'Exercice', color: 'bg-orange-100 text-orange-700' },
};

export const PathEditor: React.FC<PathEditorProps> = ({ courseId, onBack }) => {
  const [paths, setPaths] = useState<(LearningPath & { steps: LearningStep[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const [editingStep, setEditingStep] = useState<LearningStep | null>(null);
  const [showStepTypeModal, setShowStepTypeModal] = useState<string | null>(null);
  const [editingQCMStep, setEditingQCMStep] = useState<LearningStep | null>(null);

  useEffect(() => {
    fetchPaths();
  }, [courseId]);

  const fetchPaths = async () => {
    try {
      setLoading(true);
      const { data: pathsData, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      const pathsWithSteps = await Promise.all(
        (pathsData || []).map(async (path) => {
          const { data: steps } = await supabase
            .from('learning_steps')
            .select('*')
            .eq('path_id', path.id)
            .order('order_index', { ascending: true });

          return { ...path, steps: steps || [] };
        })
      );

      setPaths(pathsWithSteps);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const addPath = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .insert({
          course_id: courseId,
          title: 'Nouveau parcours',
          order_index: paths.length,
        })
        .select()
        .single();

      if (error) throw error;
      setPaths([...paths, { ...data, steps: [] }]);
      setEditingPath(data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const updatePath = async (path: LearningPath) => {
    try {
      const { error } = await supabase
        .from('learning_paths')
        .update({ title: path.title, description: path.description })
        .eq('id', path.id);

      if (error) throw error;
      setPaths(paths.map(p => p.id === path.id ? { ...p, ...path } : p));
      setEditingPath(null);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const deletePath = async (pathId: string) => {
    try {
      const { error } = await supabase
        .from('learning_paths')
        .delete()
        .eq('id', pathId);

      if (error) throw error;
      setPaths(paths.filter(p => p.id !== pathId));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const addStep = async (pathId: string, stepType: StepType) => {
    try {
      const path = paths.find(p => p.id === pathId);
      const { data, error } = await supabase
        .from('learning_steps')
        .insert({
          path_id: pathId,
          title: `Nouvelle étape ${stepTypeConfig[stepType].label}`,
          step_type: stepType,
          order_index: path?.steps.length || 0,
          content: {},
        })
        .select()
        .single();

      if (error) throw error;
      setPaths(paths.map(p => 
        p.id === pathId 
          ? { ...p, steps: [...p.steps, data] }
          : p
      ));
      setShowStepTypeModal(null);
      setEditingStep(data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const updateStep = async (step: LearningStep) => {
    try {
      const { error } = await supabase
        .from('learning_steps')
        .update({ 
          title: step.title, 
          content: step.content,
          estimated_duration: step.estimated_duration,
        })
        .eq('id', step.id);

      if (error) throw error;
      setPaths(paths.map(p => ({
        ...p,
        steps: p.steps.map(s => s.id === step.id ? step : s)
      })));
      setEditingStep(null);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const deleteStep = async (pathId: string, stepId: string) => {
    try {
      const { error } = await supabase
        .from('learning_steps')
        .delete()
        .eq('id', stepId);

      if (error) throw error;
      setPaths(paths.map(p => 
        p.id === pathId 
          ? { ...p, steps: p.steps.filter(s => s.id !== stepId) }
          : p
      ));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const moveStep = async (pathId: string, stepId: string, direction: 'up' | 'down') => {
    const path = paths.find(p => p.id === pathId);
    if (!path) return;

    const stepIndex = path.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return;
    if (direction === 'up' && stepIndex === 0) return;
    if (direction === 'down' && stepIndex === path.steps.length - 1) return;

    const newSteps = [...path.steps];
    const swapIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    [newSteps[stepIndex], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[stepIndex]];

    // Update order_index for both steps
    await supabase.from('learning_steps').update({ order_index: swapIndex }).eq('id', stepId);
    await supabase.from('learning_steps').update({ order_index: stepIndex }).eq('id', newSteps[stepIndex].id);

    setPaths(paths.map(p => p.id === pathId ? { ...p, steps: newSteps } : p));
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
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          ← Retour au cours
        </button>
        <button
          onClick={addPath}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          <Plus size={18} />
          Ajouter un parcours
        </button>
      </div>

      {paths.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun parcours</h3>
          <p className="text-gray-600 mb-4">Créez votre premier parcours pédagogique</p>
          <button
            onClick={addPath}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Créer un parcours
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {paths.map((path, pathIndex) => (
            <div key={path.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Path Header */}
              <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="text-gray-400 cursor-move" size={20} />
                  <span className="text-sm text-gray-500">Parcours {pathIndex + 1}</span>
                  {editingPath?.id === path.id ? (
                    <input
                      type="text"
                      value={editingPath.title}
                      onChange={(e) => setEditingPath({ ...editingPath, title: e.target.value })}
                      className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                      autoFocus
                    />
                  ) : (
                    <h3 className="font-semibold text-gray-900">{path.title}</h3>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingPath?.id === path.id ? (
                    <>
                      <button
                        onClick={() => updatePath(editingPath)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => setEditingPath(null)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingPath(path)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deletePath(path.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Steps */}
              <div className="p-4 space-y-2">
                {path.steps.map((step, stepIndex) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <GripVertical className="text-gray-400 cursor-move" size={16} />
                    <span className="text-sm text-gray-500 w-6">{stepIndex + 1}.</span>
                    <span className={`p-1.5 rounded ${stepTypeConfig[step.step_type].color}`}>
                      {stepTypeConfig[step.step_type].icon}
                    </span>
                    <span className="flex-1 text-gray-900">{step.title}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveStep(path.id, step.id, 'up')}
                        disabled={stepIndex === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => moveStep(path.id, step.id, 'down')}
                        disabled={stepIndex === path.steps.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        onClick={() => setEditingStep(step)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteStep(path.id, step.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Step Button */}
                <button
                  onClick={() => setShowStepTypeModal(path.id)}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Ajouter une étape
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step Type Modal */}
      {showStepTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Type d'étape</h3>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(stepTypeConfig) as StepType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => addStep(showStepTypeModal, type)}
                  className={`p-4 rounded-lg border-2 border-gray-200 hover:border-teal-400 transition-colors flex flex-col items-center gap-2`}
                >
                  <span className={`p-2 rounded-lg ${stepTypeConfig[type].color}`}>
                    {stepTypeConfig[type].icon}
                  </span>
                  <span className="font-medium text-gray-900">{stepTypeConfig[type].label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStepTypeModal(null)}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* QCM Editor */}
      {editingQCMStep && (
        <QCMEditor
          stepId={editingQCMStep.id}
          stepTitle={editingQCMStep.title}
          onClose={() => setEditingQCMStep(null)}
        />
      )}

      {/* Step Editor Modal */}
      {editingStep && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-[75vw] max-h-[90vh] overflow-y-auto sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[75vw]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Modifier l'étape
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={editingStep.title}
                  onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée estimée (min)</label>
                <input
                  type="number"
                  value={editingStep.estimated_duration}
                  onChange={(e) => setEditingStep({ ...editingStep, estimated_duration: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {editingStep.step_type === 'text' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contenu (Markdown enrichi)</label>
                    <RichTextEditor
                      value={(editingStep.content as any)?.body || ''}
                      onChange={(newValue) => setEditingStep({ 
                        ...editingStep, 
                        content: { ...(editingStep.content as any), body: newValue } as any
                      })}
                      onImageUpload={async (file) => {
                        return new Promise((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            try {
                              const timestamp = Date.now();
                              const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                              const filePath = `courses/${courseId}/images/${fileName}`;
                              
                              const { error } = await supabase.storage
                                .from('learning-content')
                                .upload(filePath, file);
                              
                              if (error) throw error;
                              
                              const { data: { publicUrl } } = supabase.storage
                                .from('learning-content')
                                .getPublicUrl(filePath);
                              
                              resolve(publicUrl);
                            } catch (err) {
                              reject(err);
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                      placeholder="# Titre\n\nCommencez à écrire votre contenu..."
                    />
                  </div>
                  
                  <div className="border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Narration audio (optionnel)
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Enregistrez votre voix pour accompagner le contenu écrit. L'audio sera lu automatiquement lors de la consultation de cette étape.
                    </p>
                    <AudioRecorder
                      existingAudioUrl={(editingStep.content as any)?.audio_url}
                      onRecordingComplete={async (audioBlob) => {
                        try {
                          const timestamp = Date.now();
                          const fileName = `${timestamp}_narration.webm`;
                          const filePath = `courses/${courseId}/audio/${fileName}`;
                          
                          const { error } = await supabase.storage
                            .from('learning-content')
                            .upload(filePath, audioBlob);
                          
                          if (error) throw error;
                          
                          const { data: { publicUrl } } = supabase.storage
                            .from('learning-content')
                            .getPublicUrl(filePath);
                          
                          setEditingStep({ 
                            ...editingStep, 
                            content: { ...(editingStep.content as any), audio_url: publicUrl } as any
                          });
                        } catch (err) {
                          console.error('Erreur upload audio:', err);
                          alert('Erreur lors de l\'enregistrement');
                        }
                      }}
                    />
                  </div>
                </div>
              )}
              {editingStep.step_type === 'video' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de la vidéo (YouTube, Vimeo, etc.)</label>
                    <input
                      type="url"
                      value={editingStep.content.video_url || ''}
                      onChange={(e) => setEditingStep({ 
                        ...editingStep, 
                        content: { ...editingStep.content, video_url: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ou télécharger une vidéo</label>
                    <MediaUploader
                      courseId={courseId}
                      acceptedTypes="video"
                      onUploadComplete={(url) => setEditingStep({ 
                        ...editingStep, 
                        content: { ...editingStep.content, video_url: url } 
                      })}
                      label="Télécharger une vidéo"
                    />
                  </div>
                </div>
              )}
              {editingStep.step_type === 'audio' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enregistrer votre voix</label>
                    <AudioRecorder
                      existingAudioUrl={editingStep.content.audio_url}
                      onRecordingComplete={async (audioBlob) => {
                        try {
                          const timestamp = Date.now();
                          const fileName = `${timestamp}_recording.webm`;
                          const filePath = `courses/${courseId}/audio/${fileName}`;
                          
                          const { error } = await supabase.storage
                            .from('learning-content')
                            .upload(filePath, audioBlob);
                          
                          if (error) throw error;
                          
                          const { data: { publicUrl } } = supabase.storage
                            .from('learning-content')
                            .getPublicUrl(filePath);
                          
                          setEditingStep({ 
                            ...editingStep, 
                            content: { ...editingStep.content, audio_url: publicUrl } 
                          });
                        } catch (err) {
                          console.error('Erreur upload audio:', err);
                          alert('Erreur lors de l\'enregistrement');
                        }
                      }}
                    />
                  </div>
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ou télécharger un fichier audio</label>
                    <MediaUploader
                      courseId={courseId}
                      acceptedTypes="audio"
                      onUploadComplete={(url) => setEditingStep({ 
                        ...editingStep, 
                        content: { ...editingStep.content, audio_url: url } 
                      })}
                      label="Télécharger un fichier audio"
                    />
                  </div>
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ou saisir une URL audio</label>
                    <input
                      type="url"
                      value={editingStep.content.audio_url || ''}
                      onChange={(e) => setEditingStep({ 
                        ...editingStep, 
                        content: { ...editingStep.content, audio_url: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}
              {editingStep.step_type === 'qcm' && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 mb-3">
                    Configurez les questions du QCM avec l'éditeur dédié.
                  </p>
                  <button
                    onClick={() => {
                      updateStep(editingStep);
                      setEditingQCMStep(editingStep);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Settings size={18} />
                    Ouvrir l'éditeur de QCM
                  </button>
                </div>
              )}
              {editingStep.step_type === 'exercise' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructions de l'exercice</label>
                  <textarea
                    value={editingStep.content.instructions || ''}
                    onChange={(e) => setEditingStep({ 
                      ...editingStep, 
                      content: { ...editingStep.content, instructions: e.target.value } 
                    })}
                    rows={4}
                    placeholder="Décrivez ce que l'étudiant doit faire..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingStep(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={() => updateStep(editingStep)}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
