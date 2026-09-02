import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';

export default function FileUploader({ onFileChange, file, disabled = false }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (selectedFile) => {
    if (!selectedFile) return;


    const MAX_SIZE = 10 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      setErrorMessage('File size exceeds 10MB limit.');
      return;
    }

   setErrorMessage(null);
    if (onFileChange) {
      onFileChange(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };


  const handleRemoveFile = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setErrorMessage(null);
    if (onFileChange) {
      onFileChange(null);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };


  return (
    <div className="w-full space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
        id="file-upload-input"
      />

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-200 ${disabled ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60' : dragActive ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-200' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'}`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-700">
                <span className="text-indigo-600 hover:underline">Click to upload</span> or drag & drop
              </p>
              <p className="text-[11px] text-slate-400">PDF, DOCX, TXT, or MD (up to 10MB)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-3 bg-white border border-slate-200 rounded-lg shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-medium text-slate-800 truncate">{file.name}</p>
              <p className="text-[10px] text-slate-400">{formatFileSize(file.size)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemoveFile}
            disabled={disabled}
            aria-label="Remove attached file"
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
