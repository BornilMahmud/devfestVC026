import React, { useState, useRef } from 'react';
import { UploadedFile, DuplicateGroup, Language } from '../types';
import { computeSHA256 } from '../utils/hashing';
import { inspectPDF } from '../utils/pdfParser';
import { t } from '../utils/translations';
import { LordIcon } from './LordIcon';
import {
  UploadCloud,
  File,
  Trash2,
  AlertTriangle,
  Copy,
  CheckCircle,
  FileText,
} from 'lucide-react';

interface FileUploaderProps {
  files: UploadedFile[];
  duplicateGroups: Map<string, UploadedFile[]>;
  onFilesAdded: (newFiles: UploadedFile[]) => void;
  onFileRemoved: (fileId: string) => void;
  lang: Language;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  duplicateGroups,
  onFilesAdded,
  onFileRemoved,
  lang,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFileList = async (incomingFiles: FileList | File[]) => {
    setUploadError(null);
    setProcessing(true);

    const fileArray = Array.from(incomingFiles);

    // Rule: Maximum 30 files total
    if (files.length + fileArray.length > 30) {
      setUploadError(t(lang, 'tooManyFilesError'));
      setProcessing(false);
      return;
    }

    // Rule: Maximum 50 MB total
    const existingBytes = files.reduce((acc, f) => acc + f.size, 0);
    const newBytes = fileArray.reduce((acc, f) => acc + f.size, 0);
    if (existingBytes + newBytes > 50 * 1024 * 1024) {
      setUploadError(t(lang, 'maxSizeError'));
      setProcessing(false);
      return;
    }

    const processed: UploadedFile[] = [];

    for (const f of fileArray) {
      // Check for PDF extension or MIME type
      if (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf') {
        setUploadError(`"${f.name}": ${t(lang, 'nonPdfError')}`);
        continue;
      }

      try {
        const arrayBuffer = await f.arrayBuffer();
        const hash = await computeSHA256(arrayBuffer);
        const inspection = await inspectPDF(arrayBuffer);

        processed.push({
          id: `${f.name}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          file: f,
          name: f.name,
          size: f.size,
          pages: inspection.pages,
          hash,
          isEncrypted: inspection.isEncrypted,
          isCorrupt: inspection.isCorrupt,
          error: inspection.error,
          arrayBuffer,
        });
      } catch (err: any) {
        processed.push({
          id: `${f.name}_${Date.now()}`,
          file: f,
          name: f.name,
          size: f.size,
          pages: 0,
          hash: '',
          isCorrupt: true,
          error: err?.message || 'Failed to read file',
          arrayBuffer: new ArrayBuffer(0),
        });
      }
    }

    if (processed.length > 0) {
      onFilesAdded(processed);
    }
    setProcessing(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFileList(e.dataTransfer.files);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFileList(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/30'
            : 'border-slate-700/80 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="mb-2">
          <LordIcon name="upload" size={36} trigger="hover" colors="primary:#38bdf8,secondary:#94a3b8" />
        </div>
        <h4 className="text-sm font-mono font-semibold text-slate-200">
          {processing ? 'Reading PDFs & computing content fingerprints...' : t(lang, 'uploadDocuments')}
        </h4>
        <p className="text-xs text-slate-400 mt-1">{t(lang, 'dragDropText')}</p>
        <span className="text-[11px] font-mono text-cyan-500/80 mt-2">
          {t(lang, 'uploadLimitNotice')}
        </span>
      </div>

      {/* Error alert */}
      {uploadError && (
        <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg text-xs font-mono text-red-300 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Duplicate warning banner */}
      {duplicateGroups.size > 0 && (
        <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-lg text-xs font-mono text-amber-300 space-y-1">
          <div className="flex items-center space-x-2 font-bold text-amber-200">
            <Copy className="w-4 h-4" />
            <span>Duplicate Content Detected</span>
          </div>
          <p className="text-[11px] text-amber-300/80">
            Files with identical byte content cannot be matched to conflicting requirements.
          </p>
          <ul className="list-disc pl-5 text-[11px] space-y-0.5">
            {Array.from(duplicateGroups.entries()).map(([hash, group]) => (
              <li key={hash}>
                Identical files: <span className="font-semibold text-amber-200">{group.map((f) => f.name).join(' ↔ ')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>Uploaded Files ({files.length}/30)</span>
            <span>Total: {(files.reduce((a, b) => a + b.size, 0) / (1024 * 1024)).toFixed(2)} MB / 50 MB</span>
          </div>

          <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
            {files.map((file) => {
              const isDuplicate = duplicateGroups.has(file.hash);

              return (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-colors ${
                    file.isCorrupt
                      ? 'bg-red-950/30 border-red-800/50 text-red-300'
                      : isDuplicate
                      ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                      : 'bg-slate-900/70 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate max-w-[70%]">
                    <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="truncate">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                        <span>{file.pages} {file.pages === 1 ? 'page' : 'pages'}</span>
                        <span>&bull;</span>
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                        {isDuplicate && (
                          <>
                            <span>&bull;</span>
                            <span className="text-amber-400 font-semibold">[Duplicate Content]</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onFileRemoved(file.id)}
                      className="p-1 rounded hover:bg-red-950 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
