import React, { useState } from 'react';
import {
  Settings,
  Lock,
  ShieldCheck,
  Moon,
  Sun,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';

export default function SettingsView() {
  // Store Dark Mode State & Action
  const isDarkMode = useLessonStore((state) => state.isDarkMode);
  const toggleDarkMode = useLessonStore((state) => state.toggleDarkMode);

  // Section 1: Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Section 2: Two-Factor Authentication toggle
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      alert('Please check your passwords. New passwords must match.');
      return;
    }
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 shadow-2xs space-y-1 transition-colors">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
          <Settings className="w-5 h-5" />
          <h2 className="text-sm font-bold uppercase tracking-wider">Workspace Settings</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-gray-400">
          Manage your security preferences, authentication methods, and workspace visual themes.
        </p>
      </div>

      {/* SECTION 1: Change Password Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 shadow-2xs space-y-4 transition-colors">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-gray-700">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-gray-100">Change Password</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">Ensure your account uses a strong, random password.</p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Password updated successfully!</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-3.5 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-xl text-slate-800 dark:text-gray-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-xl text-slate-800 dark:text-gray-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-xl text-slate-800 dark:text-gray-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Update Password</span>
          </button>
        </form>
      </div>

      {/* SECTION 2: Two-Factor Authentication (iOS Toggle Switch) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 shadow-2xs flex items-center justify-between gap-4 transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-gray-100">Two-Factor Authentication (2FA)</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 max-w-md leading-relaxed">
              Add an extra layer of security to your educator account by requiring a verification code upon login.
            </p>
          </div>
        </div>

        {/* iOS style toggle switch */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={twoFactorEnabled}
            onChange={(e) => setTwoFactorEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-12 h-6 bg-slate-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
        </label>
      </div>

      {/* SECTION 3: Appearance (Dark Mode / Bright Mode Switch) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 shadow-2xs flex items-center justify-between gap-4 transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
            {isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-gray-100">Workspace Appearance</h3>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-300 bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {isDarkMode ? 'Dark Mode' : 'Bright Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 max-w-md leading-relaxed">
              Toggle between high-clarity Bright mode and eye-comfort Dark mode for late evening lesson planning.
            </p>
          </div>
        </div>

        {/* Appearance Switch wired to toggleDarkMode */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
            className="sr-only peer"
          />
          <div className="w-12 h-6 bg-slate-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
        </label>
      </div>
    </div>
  );
}
