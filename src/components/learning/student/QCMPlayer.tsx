import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, Lightbulb } from 'lucide-react';
import { supabase, QCMQuestion, QCMOption } from '../../../lib/supabase';
import { ProgressBar } from '../common/ProgressBar';
import { ScoreDisplay } from '../common/ScoreDisplay';

interface QCMPlayerProps {
  stepId: string;
  onComplete: (score: number, totalPoints: number) => void;
  onBack?: () => void;
}

interface QuestionWithOptions extends QCMQuestion {
  options: QCMOption[];
}

export const QCMPlayer: React.FC<QCMPlayerProps> = ({ stepId, onComplete, onBack }) => {
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [stepId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching questions for step:', stepId);
      
      const { data: questionsData, error } = await supabase
        .from('qcm_questions')
        .select('*')
        .eq('step_id', stepId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('❌ Error fetching questions:', error);
        throw error;
      }

      console.log('📝 Questions found:', questionsData?.length || 0);

      const questionsWithOptions = await Promise.all(
        (questionsData || []).map(async (question) => {
          const { data: options, error: optionsError } = await supabase
            .from('qcm_options')
            .select('*')
            .eq('question_id', question.id)
            .order('order_index', { ascending: true });

          if (optionsError) {
            console.error('❌ Error fetching options for question:', question.id, optionsError);
          }

          console.log(`✅ Question "${question.question}" has ${options?.length || 0} options`);

          return { ...question, options: options || [] };
        })
      );

      console.log('✅ Total questions with options:', questionsWithOptions);
      setQuestions(questionsWithOptions);
      setTotalPoints(questionsWithOptions.reduce((sum, q) => sum + q.points, 0));
    } catch (err) {
      console.error('❌ Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100 : 0;

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;

    if (currentQuestion.question_type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const checkAnswer = async () => {
    if (selectedOptions.length === 0) return;

    const correctOptions = currentQuestion.options.filter(o => o.is_correct);
    const correctIds = new Set(correctOptions.map(o => o.id));
    const selectedIds = new Set(selectedOptions);

    let correct = false;
    if (currentQuestion.question_type === 'single') {
      correct = selectedOptions[0] === correctOptions[0]?.id;
    } else {
      correct = correctIds.size === selectedIds.size &&
        [...correctIds].every(id => selectedIds.has(id));
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setScore(prev => prev + currentQuestion.points);
    }

    // Sauvegarder la réponse
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('qcm_answers').insert({
        user_id: user.id,
        question_id: currentQuestion.id,
        selected_options: selectedOptions,
        is_correct: correct,
      });
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptions([]);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setShowResults(true);
      onComplete(score, totalPoints);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOptions([]);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucune question disponible</p>
      </div>
    );
  }

  if (showResults) {
    const percentage = (score / totalPoints) * 100;
    const isPerfect = percentage === 100;

    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className={`mb-6 ${isPerfect ? 'animate-bounce' : ''}`}>
          {isPerfect ? (
            <Trophy className="mx-auto text-yellow-500" size={64} />
          ) : percentage >= 60 ? (
            <CheckCircle className="mx-auto text-green-500" size={64} />
          ) : (
            <XCircle className="mx-auto text-red-500" size={64} />
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isPerfect ? '🎉 Parfait !' : percentage >= 60 ? 'Bien joué !' : 'Continuez vos efforts !'}
        </h2>

        <p className="text-gray-600 mb-6">
          Vous avez obtenu <span className="font-bold">{score}</span> points sur {totalPoints}
        </p>

        <div className="mb-8">
          <ScoreDisplay score={Math.round(percentage)} maxScore={100} size="lg" />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={restartQuiz}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={18} />
            Recommencer
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Continuer
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-500">
          Question {currentIndex + 1} / {questions.length}
        </span>
        <ScoreDisplay score={score} maxScore={totalPoints} size="sm" />
      </div>

      <ProgressBar progress={progress} size="sm" color="teal" />

      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h3>

        {currentQuestion.question_type === 'multiple' && (
          <p className="text-sm text-gray-500 mb-4">
            (Plusieurs réponses possibles)
          </p>
        )}

        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            const showCorrect = isAnswered && option.is_correct;
            const showIncorrect = isAnswered && isSelected && !option.is_correct;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={isAnswered}
                className={`
                  w-full p-4 text-left rounded-lg border-2 transition-all duration-200
                  ${!isAnswered && isSelected
                    ? 'border-teal-500 bg-teal-50'
                    : !isAnswered
                    ? 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                    : ''
                  }
                  ${showCorrect ? 'border-green-500 bg-green-50' : ''}
                  ${showIncorrect ? 'border-red-500 bg-red-50' : ''}
                  ${isAnswered ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className={`${showCorrect ? 'text-green-700' : showIncorrect ? 'text-red-700' : 'text-gray-700'}`}>
                    {option.option_text}
                  </span>
                  {showCorrect && <CheckCircle className="text-green-500" size={20} />}
                  {showIncorrect && <XCircle className="text-red-500" size={20} />}
                </div>
                {isAnswered && option.feedback && (
                  <p className="text-sm text-gray-500 mt-2">{option.feedback}</p>
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && currentQuestion.explanation && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Lightbulb className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-blue-800">Explication</p>
                <p className="text-sm text-blue-700 mt-1">{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          {!isAnswered ? (
            <button
              onClick={checkAnswer}
              disabled={selectedOptions.length === 0}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Valider
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              {currentIndex < questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
