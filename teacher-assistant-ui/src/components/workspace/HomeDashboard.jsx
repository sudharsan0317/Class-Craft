import React from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Layers,
  Users,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';

export default function HomeDashboard() {
  const userName = useLessonStore((state) => state.userName);
  const classProfiles = useLessonStore((state) => state.classProfiles);
  const lastActiveClassId = useLessonStore((state) => state.lastActiveClassId);
  const setSelectedClassId = useLessonStore((state) => state.setSelectedClassId);
  const setLastActiveClassId = useLessonStore((state) => state.setLastActiveClassId);
  const setActiveTool = useLessonStore((state) => state.setActiveTool);

  const lastActiveClass = (classProfiles || []).find((c) => c.id === lastActiveClassId);

  const handleClassClick = (classId) => {
    // 1. Set this class as selectedClassId
    setSelectedClassId(classId);
    // 2. Set lastActiveClassId
    if (setLastActiveClassId) {
      setLastActiveClassId(classId);
    }
    // 3. Navigate to class detail view
    setActiveTool('class_detail');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* 1. Welcoming Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-lg shadow-indigo-100 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Teacher Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hey {userName || 'Teacher'}! 👋
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl font-normal">
            Welcome back to your AI Teacher Workspace. Select a class below to generate lesson plans, quizzes, and classroom resources.
          </p>
        </div>
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Total Classes Created */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-2xs flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Classes Created</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
              {(classProfiles || []).length} Cohorts
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Active curriculum profiles ready for instruction</p>
          </div>
        </div>

        {/* Card 2: Last Active Class */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-2xs flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Clock className="w-7 h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Last Active Class</p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5 truncate">
              {lastActiveClass ? lastActiveClass.name : 'None yet'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {lastActiveClass ? (lastActiveClass.gradeLevel || lastActiveClass.grade) + ' • ' + lastActiveClass.subject : 'Select a class below to begin'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Class List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Your Saved Class Profiles</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Click any class card to open its workspace and generate materials.</p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTool('class')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
          >
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(classProfiles || []).map((cls) => {
            const isLastActive = lastActiveClassId === cls.id;

            return (
              <div
                key={cls.id}
                onClick={() => handleClassClick(cls.id)}
                className={`bg-white dark:bg-slate-800 rounded-2xl border p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-4 group ${
                  isLastActive
                    ? 'border-indigo-300 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-gray-200 dark:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                      {cls.gradeLevel || cls.grade || 'Grade'}
                    </span>
                    {isLastActive && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Recent</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cls.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                    <span className="font-medium text-slate-700 dark:text-gray-300">{cls.subject}</span>
                    <span>•</span>
                    <span>{cls.studentsCount || 25} Learners</span>
                  </div>

                  {cls.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 line-clamp-2 italic">
                      {cls.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                  <span>Open Class Workspace</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
