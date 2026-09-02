import React from 'react';
import { Plus, Trash2, HelpCircle, Check } from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';
import EditableField from './EditableField';

export default function QuizBuilder({ phaseId, questions = [] }) {
  const updateQuestion = useLessonStore((state) => state.updateQuestion);
  const setCorrectAnswer = useLessonStore((state) => state.setCorrectAnswer);
  const addQuestion = useLessonStore((state) => state.addQuestion);
  const deleteQuestion = useLessonStore((state) => state.deleteQuestion);

  const handleQuestionTextChange = (questionId, text) => {
    updateQuestion(phaseId, questionId, { question: text });
  };

  const handleOptionChange = (questionId, optionIndex, newText, currentOptions = []) => {
    const updated = [...currentOptions];
    updated[optionIndex] = newText;
    updateQuestion(phaseId, questionId, { options: updated });
  };

  const handleToggleCorrect = (questionId, optionIndex) => {
    setCorrectAnswer(phaseId, questionId, optionIndex);
  };

  const handleAddQuestion = () => {
    addQuestion(phaseId);
  };

  const handleDeleteQuestion = (questionId) => {
    deleteQuestion(phaseId, questionId);
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
            Formative Assessment / Quiz Questions ({questions.length})
          </h4>
        </div>

        <button
          type="button"
          onClick={handleAddQuestion}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Question</span>
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs text-slate-500 dark:text-gray-400">
            No quiz questions created for this phase yet. Click &quot;Add Question&quot; to build interactive checks.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, qIndex) => {
            const options = q.options && q.options.length === 4
              ? q.options
              : [
                  q.options?.[0] || 'Option A',
                  q.options?.[1] || 'Option B',
                  q.options?.[2] || 'Option C',
                  q.options?.[3] || 'Option D'
                ];
            const correctIndex = Number(q.correctAnswer ?? q.correct_answer_index ?? 0);

            return (
              <div
                key={q.id || qIndex}
                className="bg-slate-50/70 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <EditableField
                      label={`Question ${qIndex + 1}`}
                      value={q.question || q.prompt || ''}
                      onChange={(val) => handleQuestionTextChange(q.id, val)}
                      placeholder="e.g., Which pigment absorbs blue and red wavelengths of light during photosynthesis?"
                      inputClassName="font-medium text-slate-800 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    title="Delete Question"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-100 transition-colors shrink-0 cursor-pointer mt-5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                    Answer Options (Select the correct answer button)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {options.map((optionText, optIndex) => {
                      const isCorrect = correctIndex === optIndex;

                      return (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all ${
                            isCorrect
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-400/30'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleCorrect(q.id, optIndex)}
                            title={isCorrect ? 'Correct Answer' : 'Mark as Correct Answer'}
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                              isCorrect
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-400 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={optionText}
                              onChange={(e) =>
                                handleOptionChange(q.id, optIndex, e.target.value, options)
                              }
                              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                              className={`w-full px-2 py-1 text-xs rounded border-none focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-transparent ${
                                isCorrect
                                  ? 'font-medium text-emerald-950 dark:text-emerald-300 placeholder:text-emerald-700/50'
                                  : 'text-slate-700 dark:text-gray-200 placeholder:text-slate-400 dark:placeholder-gray-500'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
