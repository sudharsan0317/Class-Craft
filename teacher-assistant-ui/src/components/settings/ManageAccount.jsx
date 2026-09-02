import React, { useState } from 'react';
import { User, CheckCircle2, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';

export default function ManageAccount() {
  const user = useLessonStore((state) => state.user);
  const userName = useLessonStore((state) => state.userName);
  const setUserNameInStore = useLessonStore((state) => state.setUserName);
  const [username, setUsername] = useState(userName || 'Siva Surya');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (setUserNameInStore) {
      setUserNameInStore(username);
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs space-y-1 transition-colors">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
          <User className="w-5 h-5" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Account Management</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-gray-400">
          Update your public educator profile, display name, and institutional contact information.
        </p>
      </div>

      {/* Success Toast / Alert */}
      {showSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 font-semibold shadow-xs animate-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-2xs space-y-5 transition-colors">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-700">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-100 dark:shadow-none shrink-0">
            {username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{username}</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">{user?.email || 'teacher@classcraft.edu'}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Educator Account</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Edit Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your full name or display name"
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-gray-400 mt-1">
              This name appears on exported lesson plans and student quiz rubrics.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={user?.email || 'teacher@classcraft.edu'}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-gray-400 cursor-not-allowed shadow-2xs"
              />
              <Mail className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-gray-400 mt-1">
              Managed through institutional SSO.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-sm shadow-indigo-200 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
