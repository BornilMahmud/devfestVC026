import React, { useState } from 'react';
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
  Unlink,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  AlertOctagon,
  AlertTriangle,
  Eye,
  FileSearch,
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
  const [showPreview, setShowPreview] = useState(false);

  if (!selectedValidation) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-slate-800 rounded-xl bg-slate-900/60 text-slate-500 h-full min-h-[300px]">
        <Layers className="w-10 h-10 text-slate-700 mb-2" />
        <h4 className="text-sm font-mono text-slate-400 font-semibold mb-1">
          Document Inspector
        </h4>
        <p className="text-xs text-center max-w-xs text-slate-500">
          Select a requirement from the checklist to review its compliance, attach files, or set statutory expiration dates.
        </p>
      </div>
    );
  }

  const { requirement, status, matchedFile, expiryDate, message_en, message_bn } = selectedValidation;
  const displayTitle = lang === 'bn' ? requirement.title_bn : requirement.title_en;

  // Status configuration
  const statusStyles = {
    OK: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    MISSING: 'bg-red-950/60 text-red-300 border-red-500/40',
    EXPIRY_NEEDED: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    EXPIRED: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
    NOT_PROVIDED: 'bg-slate-800/60 text-slate-400 border-slate-700',
  }[status];

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 text-xs font-mono">
      {/* Header Info */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-xs font-bold bg-slate-800 text-blue-400 border border-slate-700 rounded">
              {requirement.id}
            </span>
            <span className="text-slate-400">Order #{requirement.order}</span>
            {requirement.mandatory ? (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-950 text-red-400 border border-red-800/60 rounded">
                Mandatory
              </span>
            ) : (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 rounded">
                Optional
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-slate-100 mt-1.5 font-sans">{displayTitle}</h3>
        </div>

        {/* Status Badge */}
        <div className={`px-2.5 py-1 rounded border flex items-center space-x-1.5 font-bold ${statusStyles}`}>
          {status === 'OK' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          {(status === 'MISSING' || status === 'EXPIRED') && <AlertOctagon className="w-3.5 h-3.5 text-red-400" />}
          {status === 'EXPIRY_NEEDED' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
          <span>{status}</span>
        </div>
      </div>

      {/* Compliance Message Banner */}
      <div
        className={`px-3 py-2.5 rounded-lg border leading-relaxed ${
          status === 'OK'
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : status === 'NOT_PROVIDED'
            ? 'bg-slate-950 border-slate-800 text-slate-400'
            : 'bg-red-950/20 border-red-500/30 text-red-300'
        }`}
      >
        <span className="font-semibold block mb-0.5">Audit Status:</span>
        <span>{lang === 'bn' ? message_bn : message_en}</span>
      </div>

      {/* Matched File Specifications Card */}
      {matchedFile ? (
        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 block uppercase text-[10px]">Attached Document</span>
            <span className="font-bold text-blue-400">{matchedFile.pages} Pages</span>
          </div>

          <div className="text-sm font-semibold text-slate-100 truncate" title={matchedFile.name}>
            {matchedFile.name}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <div>
              <span className="text-slate-500">File Size:</span>{' '}
              <span>{(matchedFile.size / 1024).toFixed(1)} KB</span>
            </div>
            <div>
              <span className="text-slate-500">Fingerprint:</span>{' '}
              <span className="font-mono text-slate-400">{matchedFile.hash.substring(0, 10)}...</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded flex items-center justify-center space-x-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>{showPreview ? 'Hide Preview' : 'Preview Document'}</span>
            </button>

            <button
              onClick={() => onUnmatchFile(requirement.id)}
              className="py-1.5 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 rounded flex items-center space-x-1 transition-colors"
              title="Detach this file from requirement"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>Detach</span>
            </button>
          </div>
        </div>
      ) : (
        /* Document Match Dropdown if no file attached */
        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-lg space-y-2">
          <span className="text-slate-500 block uppercase text-[10px]">Attach Uploaded Document</span>
          <select
            onChange={(e) => {
              if (e.target.value) onMatchFile(requirement.id, e.target.value);
            }}
            defaultValue=""
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md p-2 focus:outline-none focus:border-blue-500"
          >
            <option value="" disabled>
              Select an uploaded PDF file...
            </option>
            {uploadedFiles.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.pages} pages &bull; {(f.size / 1024).toFixed(0)} KB)
              </option>
            ))}
          </select>
          {uploadedFiles.length === 0 && (
            <p className="text-[11px] text-slate-500 italic">
              No PDF files uploaded yet. Drop files in the upload area below to match.
            </p>
          )}
        </div>
      )}

      {/* Statutory Expiry Date Control (if requirement has expiry) */}
      {requirement.has_expiry && (
        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Statutory Expiration Date</span>
            </span>
            <span className="text-[10px] text-slate-500">
              Deadline: {tender.submission_deadline}
            </span>
          </div>

          <input
            type="date"
            value={expiryDate || ''}
            onChange={(e) => onSetExpiryDate(requirement.id, e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md p-2 focus:outline-none focus:border-blue-500"
          />

          <p className="text-[10px] text-slate-500">
            Rules: Must not expire before the tender submission deadline ({tender.submission_deadline}).
          </p>
        </div>
      )}

      {/* Live PDF Preview Drawer */}
      {showPreview && matchedFile && (
        <div className="pt-2 border-t border-slate-800">
          <PDFPreviewPanel file={matchedFile} lang={lang} />
        </div>
      )}
    </div>
  );
};
