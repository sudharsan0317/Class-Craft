import React, { useState } from 'react';
import { useLessonStore } from '../../store/useLessonStore';
import Sidebar from './Sidebar';
import NewClassModal from './NewClassModal';
import HomeDashboard from '../workspace/HomeDashboard';
import PhaseManagerView from '../workspace/PhaseManagerView';
import StandardsView from '../workspace/StandardsView';
import ClassView from '../workspace/ClassView';
import ClassDetail from '../workspace/ClassDetail';
import ManageAccount from '../settings/ManageAccount';
import SettingsView from '../settings/SettingsView';
import SupportView from '../support/SupportView';
import { Folder, FileText, CheckCircle2, Grid, Upload, FolderPlus } from 'lucide-react';

export default function SplitPaneLayout() {
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const activeTool = useLessonStore((state) => state.activeTool);
  const classProfiles = useLessonStore((state) => state.classProfiles);
  const selectedClassId = useLessonStore((state) => state.selectedClassId);
  const editedLesson = useLessonStore((state) => state.editedLesson);

  const currentClass = (classProfiles || []).find((c) => c.id === selectedClassId) || classProfiles?.[0];

  // Render All Tools view
  const renderToolsView = () => (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs transition-colors">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
          <Grid className="w-5 h-5" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">All Workspace Tools</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-gray-400">
          Access teaching assistants, phase managers, and curriculum compliance modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PhaseManagerView />
        <StandardsView />
      </div>
    </div>
  );

  // Render My Resource view
  const renderResourceView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <Folder className="w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">My Resource Library</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Archived lesson plans, question banks, and generated classroom materials.
          </p>
        </div>
        
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs">
            <FolderPlus className="w-4 h-4" />
            <span>New Folder</span>
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm">
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-2xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Lesson Archive</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">{editedLesson?.title || 'Photosynthesis Masterclass'}</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">Saved for {currentClass?.name || 'Grade 10 Biology'}</p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-2xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Question Bank</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Diagnostic Quizzes</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">Formative assessment items with keys</p>
        </div>
      </div>
    </div>
  );

  // Switch right pane content based on activeTool
  const renderContent = () => {
    switch (activeTool) {
      case 'tools':
        return renderToolsView();
      case 'resource':
        return renderResourceView();
      case 'class':
        return <ClassView />;
      case 'class_detail':
        return <ClassDetail />;
      case 'support':
        return <SupportView />;
      case 'settings':
        return <SettingsView />;
      case 'manage_account':
        return <ManageAccount />;
      case 'home':
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="flex-1 flex w-full h-full overflow-hidden">
      {/* Slim Icon-first Sidebar on far left */}
      <Sidebar />

      {/* Remaining Width: Dynamic view container (bg-slate-50 dark:bg-slate-950) */}
      <main className="flex-1 h-full overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-150">
        {renderContent()}
      </main>

      <NewClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
      />
    </div>
  );
}
