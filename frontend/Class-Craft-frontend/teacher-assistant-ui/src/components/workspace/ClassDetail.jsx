import React, { useState } from 'react';
import {
  GraduationCap,
  Download,
  BookOpen,
  Zap,
  Folder,
  ArrowLeft,
  FileText,
  CheckCircle2,
  BookText,
  Loader2
} from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';
import TeacherInputForm from './TeacherInputForm';
import LessonPlanEditor from '../editor/LessonPlanEditor';
import { generateStudyMaterials } from '../../services/api';

export default function ClassDetail() {
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'quiz' | 'study' | 'materials'
  const [isGeneratingStudy, setIsGeneratingStudy] = useState(false);
  const classProfiles = useLessonStore((state) => state.classProfiles);
  const selectedClassId = useLessonStore((state) => state.selectedClassId);
  const setActiveTool = useLessonStore((state) => state.setActiveTool);
  const editedLesson = useLessonStore((state) => state.editedLesson);
  const setStudyMaterials = useLessonStore((state) => state.setStudyMaterials);

  const currentClass = (classProfiles || []).find((c) => c.id === selectedClassId) || classProfiles?.[0];

  const handleGenerateStudy = async () => {
    setIsGeneratingStudy(true);
    try {
      const topic = editedLesson?.title || currentClass?.subject || 'General Study';
      const context = `Grade Level: ${editedLesson?.gradeLevel || currentClass?.gradeLevel || 'Grade 10'}. Objectives: ${(editedLesson?.objectives || []).join(', ')}`;
      const data = await generateStudyMaterials({ topic, context });
      setStudyMaterials(data);
    } catch (err) {
      alert("Failed to generate study materials: " + err.message);
    } finally {
      setIsGeneratingStudy(false);
    }
  };

  const handleExport = () => {
    if (!editedLesson) {
      alert("No active lesson plan to export.");
      return;
    }

    let exportTitle = editedLesson.title || 'Export';
    let bodyContent = '';

    if (activeTab === 'plan') {
      exportTitle = `${editedLesson.title || 'Lesson_Plan'}`;
      bodyContent = `
        <h1>${editedLesson.title || 'Lesson Plan'}</h1>
        <p><strong>Subject:</strong> ${editedLesson.subject || 'N/A'}</p>
        <p><strong>Grade Level:</strong> ${editedLesson.gradeLevel || 'N/A'}</p>
        <p><strong>Duration:</strong> ${editedLesson.duration || 0} minutes</p>
        
        <h2>Objectives</h2>
        <ul>
          ${(editedLesson.objectives || []).map(obj => `<li>${obj}</li>`).join('')}
        </ul>
        
        <h2>Lesson Phases</h2>
        ${(editedLesson.phases || []).map(phase => `
          <div class="phase">
            <h3>${phase.title || 'Phase'} (${phase.duration || 0} mins)</h3>
            <p>${phase.instructions || ''}</p>
            ${phase.questions && phase.questions.length > 0 ? `
              <h4>Quiz Questions:</h4>
              ${phase.questions.map(q => `
                <div class="question">
                  <p><strong>Q:</strong> ${q.question}</p>
                  <ul>
                    ${(q.options || []).map((opt, i) => `<li style="${q.correctAnswer === i ? 'font-weight: bold; color: green;' : ''}">${opt}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            ` : ''}
          </div>
        `).join('')}
      `;
    } else if (activeTab === 'quiz') {
      exportTitle = `${editedLesson.title || 'Lesson'}_Quiz`;
      const allQuestions = (editedLesson.phases || []).flatMap(p => p.questions || []);
      
      if (allQuestions.length === 0) {
        alert("No quiz questions found in this lesson plan.");
        return;
      }

      bodyContent = `
        <h1>Quiz: ${editedLesson.title || 'Lesson'}</h1>
        ${allQuestions.map((q, idx) => `
          <div class="question" style="margin-bottom: 20px;">
            <p><strong>${idx + 1}. ${q.question}</strong></p>
            <ul style="list-style-type: none; padding-left: 10px;">
              ${(q.options || []).map((opt, i) => `<li style="margin-bottom: 5px; ${q.correctAnswer === i ? 'font-weight: bold; color: green;' : ''}">[ ${q.correctAnswer === i ? 'X' : ' '} ] ${opt}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      `;
    } else if (activeTab === 'study' || activeTab === 'materials') {
      if (!editedLesson.studyMaterials) {
        alert("No study materials generated yet to export.");
        return;
      }
      
      const sm = editedLesson.studyMaterials;
      exportTitle = `${sm.title || 'Study_Materials'}`;
      
      bodyContent = `
        <h1>${sm.title}</h1>
        <p><em>${sm.summary}</em></p>
        
        ${sm.key_vocabulary && sm.key_vocabulary.length > 0 ? `
          <h2>Key Vocabulary</h2>
          <ul>
            ${sm.key_vocabulary.map(v => `<li><strong>${v.term}:</strong> ${v.definition}</li>`).join('')}
          </ul>
        ` : ''}
        
        <h2>Study Notes</h2>
        <pre style="white-space: pre-wrap; font-family: inherit; font-size: 14px;">${sm.study_notes}</pre>
      `;
    } else {
      alert("Unsupported tab for export.");
      return;
    }

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${exportTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          h1 { color: #4F46E5; }
          h2 { color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px; margin-top: 20px; }
          .phase { margin-bottom: 20px; padding: 15px; border: 1px solid #E5E7EB; background: #F9FAFB; }
          .question { margin-left: 20px; color: #4B5563; }
        </style>
      </head>
      <body>
        ${bodyContent}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exportTitle.replace(/[^a-z0-9]/gi, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          onClick={() => setActiveTab('study')}
          className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'study'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
          }`}
        >
          <BookText className="w-4 h-4" />
          <span>Study Materials</span>
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

        {activeTab === 'study' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-2xs max-w-4xl mx-auto transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <BookText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">Student Study Materials</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Generate printable notes and vocabulary for your class.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGenerateStudy}
                disabled={isGeneratingStudy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingStudy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>{isGeneratingStudy ? 'Generating...' : 'Generate Study Guide'}</span>
              </button>
            </div>

            {editedLesson?.studyMaterials ? (
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{editedLesson.studyMaterials.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{editedLesson.studyMaterials.summary}</p>
                </div>

                {editedLesson.studyMaterials.key_vocabulary?.length > 0 && (
                  <div>
                    <h5 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500" /> Key Vocabulary
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {editedLesson.studyMaterials.key_vocabulary.map((vocab, i) => (
                        <div key={i} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                          <span className="font-bold text-slate-900 dark:text-white block text-sm mb-1">{vocab.term}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{vocab.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" /> Study Notes
                  </h5>
                  <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300">
                      {editedLesson.studyMaterials.study_notes}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                <BookText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No study materials generated yet.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Click the generate button to create notes for this lesson.</p>
              </div>
            )}
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
