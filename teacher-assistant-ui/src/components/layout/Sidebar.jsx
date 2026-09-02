import React from 'react';
import {
  Home,
  Grid,
  Folder,
  Users,
  HelpCircle,
  Settings
} from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'tools', label: 'All Tools', icon: Grid },
  { id: 'resource', label: 'My Resource', icon: Folder },
  { id: 'class', label: 'Class', icon: Users },
  { id: 'support', label: 'Support', icon: HelpCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const activeTool = useLessonStore((state) => state.activeTool);
  const setActiveTool = useLessonStore((state) => state.setActiveTool);

  return (
    <aside
      aria-label="Navigation Sidebar"
      className="w-24 shrink-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 py-4 flex flex-col items-center justify-between select-none shadow-2xs z-20 transition-colors duration-150"
    >
      <nav className="w-full flex flex-col items-center space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTool === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTool(item.id)}
              className={`w-[76px] h-[68px] flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold'
              }`}
            >
              <Icon size={24} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'} />
              <span
                className={`text-[10px] uppercase tracking-wider text-center leading-none ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-500 dark:text-gray-400 font-semibold'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Subtle indicator at bottom */}
      <div className="w-8 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
    </aside>
  );
}
