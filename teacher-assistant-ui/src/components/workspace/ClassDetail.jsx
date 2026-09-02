import React, { useState } from 'react';
import {
  GraduationCap,
  Download,
  BookOpen,
  Zap,
  Folder,
  ArrowLeft,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';
import TeacherInputForm from './TeacherInputForm';
import LessonPlanEditor from '../editor/LessonPlanEditor';

export default function ClassDetail() {
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'quiz' | 'materials'
  const classProfiles = useLessonStore((state) => state.classProfiles);
  const selectedClassId = useLessonStore((state) => state.selectedClassId);
  const setActiveTool = useLessonStore((state) => state.setActiveTool);
  const editedLesson = useLessonStore((state) => state.editedLesson);

  const currentClass = (classProfiles || []).find((c) => c.id === selectedClassId) || classProfiles?.[0];

  const handleExport = () => {
    alert(`Exporting PDF/Word materials for ${currentClass?.name || 'Class'}...`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Class Header with Export PDF/Word Button */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTool('class')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Back to All Classes"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {currentClass?.name || 'Active Class Cohort'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {currentClass?.gradeLevel || currentClass?.grade || 'Grade 10'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>{currentClass?.subject || 'Subject'}</span>
              <span>•</span>
              <span>{currentClass?.studentsCount || 25} Learners</span>
              <span>•</span>
              <span className="italic">{currentClass?.notes || 'Pedagogically aligned'}</span>
            </p>
          </div>
        </div>

        {/* Export PDF/Word Button */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-gray-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600 dark:text-gray-300" />
            <span>Export PDF/Word</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Navigation Tab Bar */}
      <div className="border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 bg-white dark:bg-slate-800 px-4 rounded-xl shadow-2xs transition-colors">
        <button
          type="button"
          onClick={() => setActiveTab('plan')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'plan'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Plan the Lesson</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Generate Quiz</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'materials'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>Saved Materials</span>
        </button>
      </div>

      {/* 3. Tab Content Area */}
      <div>
        {activeTab === 'plan' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs transition-colors">
              <TeacherInputForm />
            </div>
            <div className="lg:col-span-7">
              <LessonPlanEditor />
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-2xs text-center space-y-4 max-w-xl mx-auto transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Diagnostic Quiz Generator</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Generate formative assessments, multiple-choice items, and answer keys tailored specifically for {currentClass?.name}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('plan')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
            >
              <span>Build Quizzes in Lesson Plan Editor</span>
            </button>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-2xs transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Active Lesson Materials</span>
                <FileText className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">{editedLesson?.title || 'Interactive Lesson Workspace'}</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Configured for {currentClass?.name}</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-2xs transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Aligned Curricula</span>
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">CBSE & NCERT Taxonomy Pack</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Verified standards alignment</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
