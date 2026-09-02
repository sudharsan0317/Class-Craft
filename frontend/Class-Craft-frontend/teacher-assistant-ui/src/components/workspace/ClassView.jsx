import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Plus,
  BookOpen,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';
import NewClassModal from '../layout/NewClassModal';

export default function ClassView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const classProfiles = useLessonStore((state) => state.classProfiles);
  const selectedClassId = useLessonStore((state) => state.selectedClassId);
  const setSelectedClassId = useLessonStore((state) => state.setSelectedClassId);
  const setLastActiveClassId = useLessonStore((state) => state.setLastActiveClassId);
  const setActiveTool = useLessonStore((state) => state.setActiveTool);

  const handleGoToClass = (classId) => {
    // 1. Set this class as selectedClassId
    setSelectedClassId(classId);
    // 2. Set lastActiveClassId
    if (setLastActiveClassId) {
      setLastActiveClassId(classId);
    }
    // 3. Transition activeTool to 'class_detail'
    setActiveTool('class_detail');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <Users className="w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Class Profile Directory</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Select a class cohort to manage lesson plans, generate diagnostic quizzes, or inspect curriculum assets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-sm shadow-indigo-200 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Class</span>
        </button>
      </div>

      {/* Class Profile Cards */}
      <div className="space-y-4">
        {(classProfiles || []).map((cls) => {
          const isSelected = selectedClassId === cls.id;

          return (
            <div
              key={cls.id}
              className={`bg-white dark:bg-slate-800 shadow-sm border p-5 rounded-xl transition-all ${
                isSelected
                  ? 'border-indigo-300 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-50/50 dark:shadow-none'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{cls.name}</h3>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            <CheckCircle2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                            <span>Active Context</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-gray-400 flex-wrap">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-gray-300">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cls.subject || 'General Subject'}</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-gray-300">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cls.gradeLevel || cls.grade || 'Grade 10'}</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-gray-300">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cls.studentsCount || 25} Students</span>
                        </span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-gray-300 text-[11px] font-semibold">
                          {cls.level || 'Intermediate'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {cls.notes && (
                    <div className="pt-1">
                      <p className="text-xs text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700 leading-relaxed">
                        <strong className="text-slate-700 dark:text-gray-200 font-semibold">Pedagogical Focus:</strong> {cls.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Go to Class Button */}
                <div className="flex items-center justify-end md:self-end shrink-0 pt-2 md:pt-0">
                  <button
                    type="button"
                    onClick={() => handleGoToClass(cls.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-200 cursor-pointer"
                  >
                    <span>Go to Class</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <NewClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
