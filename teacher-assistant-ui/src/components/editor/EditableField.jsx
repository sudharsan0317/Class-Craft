import React, { useState, useEffect } from 'react';

export default function EditableField({
  value = '',
  onChange,
  onBlur,
  placeholder = 'Click to edit...',
  multiline = false,
  rows = 3,
  className = '',
  inputClassName = '',
  label,
  type = 'text',
  min,
  max,
  disabled = false
}) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value ?? '');
  }, [value]);

  const handleInputChange = (e) => {
    const nextVal = type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value;
    setInternalValue(nextVal);
    if (onChange) {
      onChange(nextVal);
    }
  };

  const handleInputBlur = () => {
    if (onBlur) {
      onBlur(internalValue);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
          {label}
        </label>
      )}

      {multiline ? (
        <textarea
          rows={rows}
          value={internalValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-3 py-2 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-y leading-relaxed ${disabled ? 'bg-slate-50 dark:bg-slate-800 opacity-70 cursor-not-allowed' : ''} ${inputClassName}`}
        />
      ) : (
        <input
          type={type}
          min={min}
          max={max}
          value={internalValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-3 py-2 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 placeholder:text-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${disabled ? 'bg-slate-50 dark:bg-slate-800 opacity-70 cursor-not-allowed' : ''} ${inputClassName}`}
        />
      )}
    </div>
  );
}
