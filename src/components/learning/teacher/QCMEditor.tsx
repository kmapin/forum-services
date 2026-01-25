import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Check, GripVertical, HelpCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface QCMQuestion {
  id: string;
  step_id: string;
  question: string;
  question_type: 'single' | 'multiple';
  explanation: string | null;
  points: number;
  order_index: number;
  options: QCMOption[];
}

interface QCMOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  feedback: string | null;
  order_index: number;
}

interface QCMEditorProps {
  stepId: string;
  stepTitle: string;
  onClose: () => void;
}

export const QCMEditor: React.FC<QCMEditorProps> = ({ stepId, stepTitle, onClose }) => {
  const [questions, setQuestions] = useState<QCMQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QCMQuestion | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [stepId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data: questionsData, error } = await supabase
        .from('qcm_questions')
        .select('*')
        .eq('step_id', stepId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      const questionsWithOptions = await Promise.all(
        (questionsData || []).map(async (q) => {
          const { data: options } = await supabase
            .from('qcm_options')
            .select('*')
            .eq('question_id', q.id)
            .order('order_index', { ascending: true });

          return { ...q, options: options || [] };
        })
      );

      setQuestions(questionsWithOptions);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async () => {
    try {
      const { data, error } = await supabase
        .from('qcm_questions')
        .insert({
          step_id: stepId,
          question: 'Nouvelle question',
          question_type: 'single',
          points: 10,
          order_index: questions.length,
        })
        .select()
        .single();

      if (error) throw error;

      // Ajouter 2 options par défaut
      const { data: options } = await supabase
        .from('qcm_options')
        .insert([
          { question_id: data.id, option_text: 'Option A', is_correct: true, order_index: 0 },
          { question_id: data.id, option_text: 'Option B', is_correct: false, order_index: 1 },
        ])
        .select();

      const newQuestion = { ...data, options: options || [] };
      setQuestions([...questions, newQuestion]);
      setEditingQuestion(newQuestion);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const updateQuestion = async (question: QCMQuestion) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('qcm_questions')
        .update({
          question: question.question,
          question_type: question.question_type,
          explanation: question.explanation,
          points: question.points,
        })
        .eq('id', question.id);

      if (error) throw error;

      // Mettre à jour les options
      for (const option of question.options) {
        await supabase
          .from('qcm_options')
          .update({
            option_text: option.option_text,
            is_correct: option.is_correct,
            feedback: option.feedback,
          })
          .eq('id', option.id);
      }

      setQuestions(questions.map(q => q.id === question.id ? question : q));
      setEditingQuestion(null);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Supprimer cette question ?')) return;
    
    try {
      const { error } = await supabase
        .from('qcm_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const addOption = async (question: QCMQuestion) => {
    try {
      const { data, error } = await supabase
        .from('qcm_options')
        .insert({
          question_id: question.id,
          option_text: `Option ${String.fromCharCode(65 + question.options.length)}`,
          is_correct: false,
          order_index: question.options.length,
        })
        .select()
        .single();

      if (error) throw error;

      const updatedQuestion = {
        ...question,
        options: [...question.options, data],
      };
      setQuestions(questions.map(q => q.id === question.id ? updatedQuestion : q));
      setEditingQuestion(updatedQuestion);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const deleteOption = async (question: QCMQuestion, optionId: string) => {
    if (question.options.length <= 2) {
      alert('Une question doit avoir au moins 2 options.');
      return;
    }

    try {
      const { error } = await supabase
        .from('qcm_options')
        .delete()
        .eq('id', optionId);

      if (error) throw error;

      const updatedQuestion = {
        ...question,
        options: question.options.filter(o => o.id !== optionId),
      };
      setQuestions(questions.map(q => q.id === question.id ? updatedQuestion : q));
      setEditingQuestion(updatedQuestion);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const toggleCorrectOption = (question: QCMQuestion, optionId: string) => {
    let updatedOptions: QCMOption[];

    if (question.question_type === 'single') {
      // Pour choix unique, désélectionner les autres
      updatedOptions = question.options.map(o => ({
        ...o,
        is_correct: o.id === optionId,
      }));
    } else {
      // Pour choix multiple, toggle
      updatedOptions = question.options.map(o => ({
        ...o,
        is_correct: o.id === optionId ? !o.is_correct : o.is_correct,
      }));
    }

    const updatedQuestion = { ...question, options: updatedOptions };
    setEditingQuestion(updatedQuestion);
  };

  const updateOptionText = (question: QCMQuestion, optionId: string, text: string) => {
    const updatedOptions = question.options.map(o => 
      o.id === optionId ? { ...o, option_text: text } : o
    );
    setEditingQuestion({ ...question, options: updatedOptions });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle size={24} />
              <div>
                <h2 className="text-xl font-bold">Éditeur de QCM</h2>
                <p className="text-green-100 text-sm">{stepTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune question</h3>
              <p className="text-gray-600 mb-4">Ajoutez des questions pour ce QCM</p>
              <button
                onClick={addQuestion}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus size={18} className="inline mr-2" />
                Ajouter une question
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className={`border rounded-xl overflow-hidden ${
                    editingQuestion?.id === question.id ? 'border-green-400 shadow-lg' : 'border-gray-200'
                  }`}
                >
                  {/* Question Header */}
                  <div className="p-4 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="text-gray-400" size={18} />
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-medium">
                        Q{index + 1}
                      </span>
                      <span className="text-sm text-gray-500">
                        {question.question_type === 'single' ? 'Choix unique' : 'Choix multiple'}
                      </span>
                      <span className="text-sm text-gray-500">
                        • {question.points} pts
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingQuestion?.id !== question.id && (
                        <>
                          <button
                            onClick={() => setEditingQuestion(question)}
                            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="p-4">
                    {editingQuestion?.id === question.id ? (
                      <div className="space-y-4">
                        {/* Question Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question
                          </label>
                          <textarea
                            value={editingQuestion.question}
                            onChange={(e) => setEditingQuestion({
                              ...editingQuestion,
                              question: e.target.value,
                            })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>

                        {/* Question Type & Points */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Type de réponse
                            </label>
                            <select
                              value={editingQuestion.question_type}
                              onChange={(e) => setEditingQuestion({
                                ...editingQuestion,
                                question_type: e.target.value as 'single' | 'multiple',
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                              <option value="single">Choix unique</option>
                              <option value="multiple">Choix multiple</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Points
                            </label>
                            <input
                              type="number"
                              value={editingQuestion.points}
                              onChange={(e) => setEditingQuestion({
                                ...editingQuestion,
                                points: parseInt(e.target.value) || 10,
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>

                        {/* Options */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Options de réponse
                            <span className="text-gray-400 font-normal ml-2">
                              (cliquez sur le cercle pour marquer comme correcte)
                            </span>
                          </label>
                          <div className="space-y-2">
                            {editingQuestion.options.map((option, optIndex) => (
                              <div key={option.id} className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleCorrectOption(editingQuestion, option.id)}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    option.is_correct
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-gray-300 hover:border-green-400'
                                  }`}
                                >
                                  {option.is_correct && <Check size={14} />}
                                </button>
                                <span className="text-gray-500 w-6">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <input
                                  type="text"
                                  value={option.option_text}
                                  onChange={(e) => updateOptionText(editingQuestion, option.id, e.target.value)}
                                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                                    option.is_correct ? 'border-green-300 bg-green-50' : 'border-gray-300'
                                  }`}
                                />
                                <button
                                  onClick={() => deleteOption(editingQuestion, option.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => addOption(editingQuestion)}
                            className="mt-2 text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                          >
                            <Plus size={16} />
                            Ajouter une option
                          </button>
                        </div>

                        {/* Explanation */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Explication (affichée après réponse)
                          </label>
                          <textarea
                            value={editingQuestion.explanation || ''}
                            onChange={(e) => setEditingQuestion({
                              ...editingQuestion,
                              explanation: e.target.value,
                            })}
                            rows={2}
                            placeholder="Expliquez pourquoi cette réponse est correcte..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            onClick={() => setEditingQuestion(null)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => updateQuestion(editingQuestion)}
                            disabled={saving}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                          >
                            {saving ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Enregistrement...
                              </>
                            ) : (
                              <>
                                <Save size={18} />
                                Enregistrer
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900 mb-3">{question.question}</p>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={option.id}
                              className={`flex items-center gap-2 p-2 rounded-lg ${
                                option.is_correct ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                option.is_correct
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300'
                              }`}>
                                {option.is_correct && <Check size={12} />}
                              </span>
                              <span className="text-gray-500">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              <span className={option.is_correct ? 'text-green-700 font-medium' : 'text-gray-700'}>
                                {option.option_text}
                              </span>
                            </div>
                          ))}
                        </div>
                        {question.explanation && (
                          <p className="mt-3 text-sm text-gray-500 italic">
                            💡 {question.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Question Button */}
              <button
                onClick={addQuestion}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Ajouter une question
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {questions.length} question{questions.length > 1 ? 's' : ''} • 
            {questions.reduce((sum, q) => sum + q.points, 0)} points total
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
