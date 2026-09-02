import React from 'react';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';
import { calculateTotalPhaseDuration, checkDurationMatch } from '../../utils/timeHelpers';

export default function PhaseManagerView() {
  const editedLesson = useLessonStore((state) => state.editedLesson);
  const generatorForm = useLessonStore((state) => state.generatorForm);
  const updatePhase = useLessonStore((state) => state.updatePhase);
  const addPhase = useLessonStore((state) => state.addPhase);
  const deletePhase = useLessonStore((state) => state.deletePhase);
  const movePhase = useLessonStore((state) => state.movePhase);
  const rebalancePhaseDurations = useLessonStore((state) => state.rebalancePhaseDurations);

  if (!editedLesson) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">No Active Lesson Plan to Structure</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 max-w-sm">
          Please switch to the Lesson Generator tool on the sidebar and create a plan to manage phases.
        </p>
      </div>
    );
  }

  const phases = editedLesson.phases || editedLesson.lessonPhases || [];
  const targetDuration = Number(generatorForm.duration) || Number(editedLesson.duration) || 45;
  const totalPhaseDuration = calculateTotalPhaseDuration(phases);
  const durationCheck = checkDurationMatch(totalPhaseDuration, targetDuration);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar with Rebalance Button */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Pedagogical Structure Studio
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Phase Manager & Timing Synchronizer
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Reorder lesson phases, add custom intervals, and balance class durations.
            </p>
          </div>

          {/* 3. Header Buttons with shrink-0 and gap-3 */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => rebalancePhaseDurations(targetDuration)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Rebalance Durations ({targetDuration} min)</span>
            </button>
            <button
              type="button"
              onClick={() => addPhase()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Phase</span>
            </button>
          </div>
        </div>

        {/* Real-time duration status */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
            durationCheck.isMatch
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
              : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {durationCheck.isMatch ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            )}
            <div>
              <p className="text-xs font-bold">
                {durationCheck.isMatch ? 'All Phase Durations Perfectly Synced' : 'Phase Durations Unbalanced'}
              </p>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                Current Sum: <strong>{totalPhaseDuration} min</strong> / Target: <strong>{targetDuration} min</strong>
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-200">
            {phases.length} Total Phases
          </span>
        </div>
      </div>

      {/* Phase List with Up/Down Controls */}
      <div className="space-y-3">
        {phases.map((phase, idx) => (
          <div
            key={phase.id || idx}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-between gap-4"
          >
            {/* Left side details */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => movePhase(phase.id, 'up')}
                  className="p-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-gray-300"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === phases.length - 1}
                  onClick={() => movePhase(phase.id, 'down')}
                  className="p-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-gray-300"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={phase.title}
                  onChange={(e) => updatePhase(phase.id, { title: e.target.value })}
                  className="w-full text-sm font-bold text-slate-800 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500 dark:text-gray-400 truncate mt-0.5">
                  {phase.instructions || phase.content || 'No instructions specified'}
                </p>
              </div>
            </div>

            {/* 2. Fixed Right-Side Duration Controls & Alignment */}
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500 shrink-0" />
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={phase.duration ?? ''}
                  onChange={(e) => updatePhase(phase.id, { duration: Number(e.target.value) || 0 })}
                  className="w-16 text-center bg-transparent border border-slate-300 dark:border-slate-700 rounded-md py-1 px-2 text-slate-800 dark:text-white dark:bg-slate-900 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-400 dark:text-gray-500 font-medium shrink-0">min</span>
              </div>

              <button
                type="button"
                onClick={() => deletePhase(phase.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
