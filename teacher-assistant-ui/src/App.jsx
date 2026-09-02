import React from 'react';
import { useLessonStore } from './store/useLessonStore';
import Header from './components/layout/Header';
import SplitPaneLayout from './components/layout/SplitPaneLayout';
import LoginPage from './components/auth/LoginPage';

export default function App() {
  const isAuthenticated = useLessonStore((state) => state.isAuthenticated);
  const isDarkMode = useLessonStore((state) => state.isDarkMode);

  if (!isAuthenticated) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <LoginPage />
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
        {/* Top Header */}
        <Header />

        {/* Main Workspace with Slim Sidebar & Dynamic Content */}
        <div className="flex-1 flex overflow-hidden">
          <SplitPaneLayout />
        </div>
      </div>
    </div>
  );
}
