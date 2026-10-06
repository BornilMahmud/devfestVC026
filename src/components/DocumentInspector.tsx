import React from 'react';
import {
  RequirementValidation,
  UploadedFile,
  TenderMetadata,
  Language,
} from '../types';
import { t } from '../utils/translations';
import { PDFPreviewPanel } from './PDFPreviewPanel';
import {
  Calendar,
  FileCheck,
  AlertTriangle,
  Unlink,
  CheckCircle2,
  Clock,
  Layers,
  Hash,
} from 'lucide-react';

interface DocumentInspectorProps {
  selectedValidation: RequirementValidation | null;
  uploadedFiles: UploadedFile[];
  tender: TenderMetadata;
  lang: Language;
  onMatchFile: (requirementId: string, fileId: string) => void;
  onUnmatchFile: (requirementId: string) => void;
  onSetExpiryDate: (requirementId: string, date: string) => void;
}

export const DocumentInspector: React.FC<DocumentInspectorProps> = ({
  selectedValidation,
  uploadedFiles,
  tender,
  lang,
  onMatchFile,
  onUnmatchFile,
  onSetExpiryDate,
}) => {
  if (!selectedValidation) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-slate-800 rounded-xl bg-slate-900/60 text-slate-500 h-full min-h-[300px]">
        <Layers className="w-12 h-12 text-slate-700 mb-3" />
        <h4 className="text-sm font-mono text-slate-400 font-semibold mb-1">
          {t(lang, 'inspectorTitle')}
        </h4>
        <p className="text-xs text-center max-w-xs text-slate-500">
          {t(lang, 'noDocumentSelected')}
        </p>
      </div>
    );
  }

  const { requirement, status, matchedFile, expiryDate, message_en, message_bn } = selectedValidation;
  const displayTitle = lang === 'bn' ? requirement.title_bn : requirement.title_en;

  // Status badge colors
  const statusStyles = {
    OK: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    MISSING: 'bg-red-500/20 text-red-300 border-red-500/40',
    EXPIRY_NEEDED: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    EXPIRED: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    NOT_PROVIDED: 'bg-slate-700/40 text-slate-400 border-slate-700',
  }[status];

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header Info */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
              {requirement.id}
            </span>
            <span className="text-xs font-mono text-slate-400">Order #{requirement.order}</span>
            {requirement.mandatory ? (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-950 text-red-400 border border-red-800/60 rounded">
                {t(lang, 'mandatory')}
              </span>
            ) : (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 rounded">
                {t(lang, 'optional')}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1">{displayTitle}</h3>
        </div>

        {/* Status Badge */}
        <div className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md border flex items-center space-x-1.5 ${statusStyles}`}>
          {status === 'OK' && <CheckCircle2 className="w-3.5 h-3.5" />}
          {(status === 'MISSING' || status === 'EXPIRED') && <AlertTriangle className="w-3.5 h-3.5" />}
          {status === 'EXPIRY_NEEDED' && <Clock className="w-3.5 h-3.5" />}
          <span>{status}</span>
        </div>
      </div>

      {/* Validation Message Banner */}
      <div
        className={`px-3 py-2 rounded-lg text-xs font-mono border ${
          status === 'OK'
            ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800/40'
            : status === 'NOT_PROVIDED'
            ? 'bg-slate-800/50 text-slate-400 border-slate-700'
            : 'bg-amber-950/30 text-amber-300 border-amber-800/40'
        }`}
      >
        {lang === 'bn' ? message_bn : message_en}
      </div>

      {/* Document Matching Controls */}
      <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-3">
        <label className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
          <span>{t(lang, 'matchedFile')}</span>
          {matchedFile && (
            <button
              onClick={() => onUnmatchFile(requirement.id)}
              className="text-red-400 hover:text-red-300 text-[11px] font-mono flex items-center space-x-1 transition-colors"
            >
              <Unlink className="w-3 h-3" />
              <span>{t(lang, 'unmatch')}</span>
            </button>
          )}
        </label>

        {/* Dropdown selector */}
        <select
          value={matchedFile?.id || ''}
          onChange={(e) => {
            if (e.target.value) {
              onMatchFile(requirement.id, e.target.value);
            } else {
              onUnmatchFile(requirement.id);
            }
          }}
          className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          <option value="">{t(lang, 'selectFileToMatch')}</option>
          {uploadedFiles.map((file) => (
            <option key={file.id} value={file.id}>
              {file.name} ({file.pages} p, {(file.size / 1024).toFixed(1)} KB)
            </option>
          ))}
        </select>

        {matchedFile && (
          <div className="text-[11px] font-mono text-slate-400 space-y-1 bg-slate-900/80 p-2.5 rounded border border-slate-800">
            <div className="flex justify-between">
              <span>Pages:</span>
              <span className="text-slate-200 font-semibold">{matchedFile.pages}</span>
            </div>
            <div className="flex justify-between">
              <span>File Size:</span>
              <span className="text-slate-200">{(matchedFile.size / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
              <span className="flex items-center space-x-1">
                <Hash className="w-3 h-3 text-cyan-400" />
                <span>SHA-256:</span>
              </span>
              <span className="truncate max-w-[170px] text-slate-400 font-mono">
                {matchedFile.hash.substring(0, 16)}...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Expiry Date Configuration (if required) */}
      {requirement.has_expiry && (
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-slate-300 font-semibold flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{t(lang, 'expiry')}</span>
            </label>
            <span className="text-[10px] font-mono text-slate-400">
              Deadline: {tender.submission_deadline}
            </span>
          </div>

          <input
            type="date"
            value={expiryDate || ''}
            onChange={(e) => onSetExpiryDate(requirement.id, e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
          />

          {expiryDate && (
            <div className="text-[11px] font-mono">
              {expiryDate < tender.submission_deadline ? (
                <span className="text-red-400 font-semibold flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Expired before deadline ({expiryDate} &lt; {tender.submission_deadline})</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <FileCheck className="w-3 h-3" />
                  <span>Valid through submission deadline ({expiryDate} &gt;= {tender.submission_deadline})</span>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Inline PDF Preview */}
      <div className="flex-1 min-h-[220px]">
        <PDFPreviewPanel file={matchedFile || null} lang={lang} />
      </div>
    </div>
  );
};
