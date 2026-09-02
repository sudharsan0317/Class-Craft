import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Target,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useLessonStore } from '../../store/useLessonStore';
import { generateLessonPlan, fetchConfig } from '../../services/api';
import FileUploader from './FileUploader';

export default function TeacherInputForm({ onGenerateSuccess }) {
  const [gradeOptions, setGradeOptions] = useState([]);
  const [durationOptions, setDurationOptions] = useState([]);

  useEffect(() => {
    fetchConfig().then(config => {
      setGradeOptions(config.grades || []);
      setDurationOptions(config.durations.map(d => ({ label: `${d} Minutes`, value: d })) || []);
    }).catch(console.error);
  }, []);
  const classContext = useLessonStore((state) => state.classContext);
  const generatorForm = useLessonStore((state) => state.generatorForm);
  const setGeneratorForm = useLessonStore((state) => state.setGeneratorForm);
  const setLessonData = useLessonStore((state) => state.setLessonData);
  const isLoading = useLessonStore((state) => state.isLoading);
  const setIsLoading = useLessonStore((state) => state.setIsLoading);
  const setErrorInStore = useLessonStore((state) => state.setError);

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGeneratorForm({ [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (file) => {
    setGeneratorForm({ file });
  };

  const validate = () => {
    const newErrors = {};
    if (!generatorForm.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }
    if (!generatorForm.learningObjective.trim()) {
      newErrors.learningObjective = 'Learning Objective is required.';
    } else if (generatorForm.learningObjective.trim().length < 5) {
      newErrors.learningObjective = 'Please provide a more descriptive learning objective (min 5 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    if (setIsLoading) setIsLoading(true);
    if (setErrorInStore) setErrorInStore(null);

    try {
      const payload = new FormData();
      payload.append('subject', generatorForm.subject.trim());
      payload.append('gradeLevel', generatorForm.gradeLevel);
      payload.append('objectives', JSON.stringify([generatorForm.learningObjective.trim()]));
      payload.append('duration', Number(generatorForm.duration) || 45);
      
      if (generatorForm.sourceMaterialText) {
        payload.append('sourceMaterial', generatorForm.sourceMaterialText.trim());
      }
      if (classContext) {
        payload.append('classContext', JSON.stringify(classContext));
      }
      if (generatorForm.file) {
        payload.append('file', generatorForm.file);
      }

      const lessonPlan = await generateLessonPlan(payload);
      setLessonData(lessonPlan);
      setSuccessMessage('Lesson plan generated successfully!');
      if (onGenerateSuccess) {
        onGenerateSuccess(lessonPlan);
      }
    } catch (err) {
      const msg = err.message || 'Failed to generate lesson plan. Please try again.';
      setGeneralError(msg);
      if (setErrorInStore) setErrorInStore(msg);
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Lesson Generator</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-gray-400">
          Configure lesson goals and source materials to build structured classroom plans.
        </p>
      </div>

      {generalError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="subject" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
            <span>Subject <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={generatorForm.subject}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="e.g., Biology, World History, Algebra II"
            className={`w-full px-3.5 py-2 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-900 border rounded-lg shadow-2xs placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
              errors.subject
                ? 'border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900 focus:border-rose-500'
                : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-500 hover:border-slate-400 dark:hover:border-slate-600'
            } ${isLoading ? 'opacity-60 bg-slate-50 dark:bg-slate-800 cursor-not-allowed' : ''}`}
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.subject}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="gradeLevel" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
              <span>Grade Level</span>
            </label>
            <select
              id="gradeLevel"
              name="gradeLevel"
              value={generatorForm.gradeLevel}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xs hover:border-slate-400 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-500 transition-colors ${
                isLoading ? 'opacity-60 bg-slate-50 dark:bg-slate-800 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade} className="dark:bg-slate-900 dark:text-white">
                  {grade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
              <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
              <span>Target Duration</span>
            </label>
            <select
              id="duration"
              name="duration"
              value={generatorForm.duration}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xs hover:border-slate-400 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-500 transition-colors ${
                isLoading ? 'opacity-60 bg-slate-50 dark:bg-slate-800 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {durationOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="dark:bg-slate-900 dark:text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="learningObjective" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
            <Target className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
            <span>Learning Objective <span className="text-rose-500">*</span></span>
          </label>
          <textarea
            id="learningObjective"
            name="learningObjective"
            rows={3}
            value={generatorForm.learningObjective}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="e.g., Explain the Calvin cycle and inputs/outputs of cellular energy conversion."
            className={`w-full px-3.5 py-2 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-900 border rounded-lg shadow-2xs placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors resize-y ${
              errors.learningObjective
                ? 'border-rose-400 focus:ring-rose-200 dark:focus:ring-rose-900 focus:border-rose-500'
                : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-500 hover:border-slate-400 dark:hover:border-slate-600'
            } ${isLoading ? 'opacity-60 bg-slate-50 dark:bg-slate-800 cursor-not-allowed' : ''}`}
          />
          {errors.learningObjective && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.learningObjective}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="sourceMaterialText" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
            <span>Source Material (Optional)</span>
          </label>
          <textarea
            id="sourceMaterialText"
            name="sourceMaterialText"
            rows={3}
            value={generatorForm.sourceMaterialText}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Paste textbook excerpts, curriculum guides, or reference notes..."
            className={`w-full px-3.5 py-2 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xs placeholder:text-slate-400 dark:placeholder-gray-500 hover:border-slate-400 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-500 transition-colors resize-y ${
              isLoading ? 'opacity-60 bg-slate-50 dark:bg-slate-800 cursor-not-allowed' : ''
            }`}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
            Or Attach Reference Document
          </label>
          <FileUploader
            file={generatorForm.file}
            onFileChange={handleFileChange}
            disabled={isLoading}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-all duration-150 ${
              isLoading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer shadow-indigo-200 dark:shadow-none'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generating Lesson Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Lesson Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
