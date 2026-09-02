import React, { useState } from 'react';
import { Sparkles, Circle, LogOut, User } from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useLessonStore((state) => state.user);
  const userName = useLessonStore((state) => state.userName);
  const logout = useLessonStore((state) => state.logout);
  const setActiveTool = useLessonStore((state) => state.setActiveTool);

  const handleManageAccount = () => {
    setActiveTool('manage_account');
    setIsProfileOpen(false);
  };

  return (
    <header className="h-16 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white px-6 flex items-center justify-between shadow-2xs z-30 transition-colors duration-150">
      {/* App Title & Branding */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-100 dark:shadow-none">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            ClassCraft Validator
          </h1>
          <p className="text-[11px] text-gray-600 dark:text-gray-300 hidden sm:block">AI Teacher Workspace • Lesson & Assessment Studio</p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Active Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
          <span>Active</span>
        </div>

        {/* User profile dropdown wrapper */}
        <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title={user?.email || 'Teacher Account'}
          >
            <User className="w-4 h-4" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-gray-100 dark:border-slate-700 z-50 py-1 transition-colors">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{userName || user?.name || 'Educator'}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user?.email || 'teacher@classcraft.edu'}</p>
              </div>

              {/* Manage Account Button */}
              <button
                type="button"
                onClick={handleManageAccount}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2 cursor-pointer border-b border-slate-100 dark:border-slate-700"
              >
                <User size={16} className="text-gray-600 dark:text-gray-300" />
                <span>Manage Account</span>
              </button>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-slate-700/60 flex items-center gap-2 cursor-pointer"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
