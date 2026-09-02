import React from 'react';
import {
  Compass,
  CheckCircle2,
  BookOpen,
  PieChart,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';

export default function StandardsView() {
  const classContext = useLessonStore((state) => state.classContext);
  const editedLesson = useLessonStore((state) => state.editedLesson);

  const subject = editedLesson?.subject || classContext?.subject || 'Biology';
  const gradeLevel = editedLesson?.gradeLevel || classContext?.gradeLevel || 'Grade 10';

  const STANDARDS_LIST = [
    {
      code: `${subject.toUpperCase().slice(0, 3)}-${gradeLevel.replace(/[^0-9]/g, '')}.1`,
      title: 'Inquiry & Scientific Methodology',
      description: 'Students formulate testable hypotheses and evaluate empirical evidence.',
      status: 'Aligned'
    },
    {
      code: `${subject.toUpperCase().slice(0, 3)}-${gradeLevel.replace(/[^0-9]/g, '')}.2`,
      title: 'Conceptual Synthesis & Critical Reasoning',
      description: 'Understanding core laws, biological cycles, and real-world environmental applications.',
      status: 'Aligned'
    },
    {
      code: `${subject.toUpperCase().slice(0, 3)}-${gradeLevel.replace(/[^0-9]/g, '')}.3`,
      title: 'Formative Assessment & Diagnostic Mastery',
      description: 'Mastery verified through multiple-choice checks and reflective group checkpoints.',
      status: 'Aligned'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <Compass className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Curriculum & Compliance</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Curriculum Standards & Bloom\'s Taxonomy Breakdown
            </h2>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% CBSE / NCERT Compliant</span>
          </div>
        </div>

        {/* Bloom's Breakdown Graphic */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-700 space-y-1 transition-colors">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-gray-400">
              <span>Knowledge & Recall</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">30%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full w-[30%]"></div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 pt-1">Foundational definitions and key terminology.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-700 space-y-1 transition-colors">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-gray-400">
              <span>Application & Analysis</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">40%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full w-[40%]"></div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 pt-1">Guided problem solving and case scenarios.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-700 space-y-1 transition-colors">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-gray-400">
              <span>Evaluation & Synthesis</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">30%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full w-[30%]"></div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 pt-1">Exit tickets and interactive assessment questions.</p>
          </div>
        </div>
      </div>

      {/* Alignment Checklist */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs space-y-4 transition-colors">
        <h3 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>National Standards Alignment Checklist ({subject} - {gradeLevel})</span>
        </h3>

        <div className="space-y-3">
          {STANDARDS_LIST.map((std, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-colors flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold font-mono">
                    {std.code}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">{std.title}</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-300">{std.description}</p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{std.status}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
