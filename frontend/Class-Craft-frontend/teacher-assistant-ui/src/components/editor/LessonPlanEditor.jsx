import React from 'react';
import {
  Clock,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';
import { calculateTotalPhaseDuration, checkDurationMatch } from '../../utils/timeHelpers';
import EditableField from './EditableField';
import QuizBuilder from './QuizBuilder';

export function LessonPlanEditorSkeleton() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-2xs">
        <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded-md w-3/5"></div>
        <div className="flex flex-wrap gap-3">
          <div className="h-5 bg-slate-100 dark:bg-slate-700 rounded-full w-24"></div>
          <div className="h-5 bg-slate-100 dark:bg-slate-700 rounded-full w-20"></div>
          <div className="h-5 bg-slate-100 dark:bg-slate-700 rounded-full w-28"></div>
        </div>
        <div className="h-16 bg-slate-100 dark:bg-slate-700 rounded-lg w-full"></div>
      </div>

      <div className="h-12 bg-slate-200/80 dark:bg-slate-700/80 rounded-xl w-full"></div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-2xs">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
          </div>
          <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded-lg w-full"></div>
          <div className="h-28 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg w-full"></div>
        </div>
      ))}
    </div>
  );
}

export default function LessonPlanEditor() {
  const classProfiles = useLessonStore((state) => state.classProfiles);
  const selectedClassId = useLessonStore((state) => state.selectedClassId);
  const editedLesson = useLessonStore((state) => state.editedLesson);
  const generatorForm = useLessonStore((state) => state.generatorForm);
  const isLoading = useLessonStore((state) => state.isLoading);
  const updatePhase = useLessonStore((state) => state.updatePhase);

  // Find active profile from store state
  const activeProfile = (classProfiles || []).find((p) => p.id === selectedClassId);

  if (isLoading) {
    return <LessonPlanEditorSkeleton />;
  }

  if (!editedLesson) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">No Active Lesson Plan</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 max-w-sm mb-4">
          Fill in the generator form on the left pane and click &quot;Generate Lesson Plan&quot; to build and edit your interactive workspace.
        </p>
      </div>
    );
  }

  const phases = editedLesson.phases || editedLesson.lessonPhases || [];
  const targetDuration = Number(editedLesson?.targetDuration || editedLesson?.duration || generatorForm?.duration || 45);
  const totalPhaseDuration = calculateTotalPhaseDuration(phases);
  const durationCheck = checkDurationMatch(totalPhaseDuration, targetDuration);

  const handlePhaseTitleChange = (phaseId, newTitle) => {
    updatePhase(phaseId, { title: newTitle });
  };

  const handlePhaseDurationChange = (phaseId, newDuration) => {
    const num = Number(newDuration) || 0;
    updatePhase(phaseId, { duration: num });
  };

  const handlePhaseInstructionsChange = (phaseId, newInstructions) => {
    updatePhase(phaseId, { instructions: newInstructions });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Interactive Workspace
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
              {editedLesson.title || 'Untitled Lesson Plan'}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-slate-600">
              <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
              <span>{activeProfile?.subject || 'Subject'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-slate-600">
              <Layers className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
              <span>{activeProfile?.name || activeProfile?.gradeLevel || 'Grade'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Target: {editedLesson?.targetDuration || targetDuration || 45} min</span>
            </span>
          </div>
        </div>

        {editedLesson.objectives && editedLesson.objectives.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
              Core Learning Objectives
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-gray-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
              {editedLesson.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Dynamic Duration Warning Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs transition-colors ${
          durationCheck.isMatch
            ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
            : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {durationCheck.isMatch ? (
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {durationCheck.isMatch ? 'Duration Synchronized' : 'Duration Warning'}
              </p>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                  durationCheck.isMatch
                    ? 'bg-emerald-200/70 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100'
                    : 'bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100'
                }`}
              >
                {durationCheck.isMatch
                  ? 'Matched'
                  : `${durationCheck.difference} min ${durationCheck.status}`}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
              Total Phase Sum: <strong className="text-slate-800 dark:text-white">{totalPhaseDuration} min</strong> • Target Class Duration: <strong className="text-slate-800 dark:text-white">{targetDuration} min</strong>
            </p>
          </div>
        </div>

        {!durationCheck.isMatch && (
          <div className="text-xs font-semibold text-amber-800 dark:text-amber-200 bg-amber-100/60 dark:bg-amber-900/40 px-3 py-1.5 rounded-lg border border-amber-200/80 dark:border-amber-800">
            Adjust individual phase minutes below to balance target time.
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-600 dark:text-gray-400" />
            <span>Lesson Phases & Real-Time Editor ({phases.length})</span>
          </h3>
        </div>

        {phases.map((phase, index) => {
          const phaseQuestions = phase.questions || [];

          return (
            <section
              key={phase.id || index}
              aria-label={`Lesson Phase ${index + 1}`}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-2xs space-y-4 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <EditableField
                      label="Phase Title"
                      value={phase.title}
                      onChange={(val) => handlePhaseTitleChange(phase.id, val)}
                      placeholder="e.g., Warm-up, Guided Practice, Exit Ticket"
                      inputClassName="font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="w-full sm:w-36 shrink-0">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Duration (Min)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="240"
                      value={phase.duration ?? ''}
                      onChange={(e) => handlePhaseDurationChange(phase.id, e.target.value)}
                      className="w-full px-3 py-2 pr-10 text-sm font-semibold text-slate-800 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-gray-500 font-medium pointer-events-none">
                      min
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <EditableField
                  label="Phase Instructions & Activities"
                  multiline={true}
                  rows={3}
                  value={phase.instructions || phase.content || ''}
                  onChange={(val) => handlePhaseInstructionsChange(phase.id, val)}
                  placeholder="Describe the teacher prompts, student activities, and key discussion points for this phase..."
                />
              </div>

              <QuizBuilder
                phaseId={phase.id}
                questions={phaseQuestions}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
