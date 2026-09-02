import React from 'react';
import { Mail } from 'lucide-react';

const FAQS = [
  {
    q: 'How does the AI generation work?',
    a: 'Our AI utilizes strict validation schemas to ensure all lesson plans, time blocks, and quizzes align perfectly with your inputted pedagogical goals.'
  },
  {
    q: 'How do I export my materials?',
    a: 'Navigate to any specific Class Workspace. In the top right corner, click the "Export PDF/Word" button to download your finalized lesson plans and quizzes.'
  },
  {
    q: 'Can I edit the generated quiz questions?',
    a: 'Yes. The interactive workspace allows you to rewrite questions, modify multiple-choice options, and change the correct answer keys before finalizing.'
  },
  {
    q: 'Are my class profiles and generations saved?',
    a: 'Yes, your class cohorts and context preferences are saved to your workspace, allowing you to instantly generate new materials for the same students without re-entering their data.'
  }
];

export default function SupportView() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 w-full animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Help & Support
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          Need help navigating your workspace? We've got you covered.
        </p>
      </div>

      {/* 2. Contact Card */}
      <div className="mt-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex items-center gap-4 shadow-2xs transition-colors">
        <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 p-3 rounded-lg shrink-0">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">
            Direct Support
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
            For technical support or account inquiries, contact us at:{' '}
            <a
              href="mailto:class.craft@edu.in"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              class.craft@edu.in
            </a>
          </p>
        </div>
      </div>

      {/* 3. FAQ Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-12 mb-6 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-5 shadow-sm transition-colors"
            >
              <h4 className="text-gray-900 dark:text-white font-medium mb-2 text-sm sm:text-base">
                {faq.q}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
