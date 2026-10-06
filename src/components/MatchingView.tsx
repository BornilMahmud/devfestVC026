import React, { useState } from 'react';
import {
  DocumentRequirement,
  UploadedFile,
  RequirementValidation,
  TenderMetadata,
  Language,
} from '../types';
import { StatusBadge } from './StatusBadge';
import { PDFPreviewPanel } from './PDFPreviewPanel';
import {
  GitMerge,
  Calendar,
  Eye,
  Unlink,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface MatchingViewProps {
  validations: RequirementValidation[];
  uploadedFiles: UploadedFile[];
  tender: TenderMetadata;
  selectedReqId: string | null;
  onSelectReq: (reqId: string) => void;
  onMatchFile: (requirementId: string, fileId: string) => void;
  onUnmatchFile: (requirementId: string) => void;
  onSetExpiryDate: (requirementId: string, date: string) => void;
  lang: Language;
}

export const MatchingView: React.FC<MatchingViewProps> = ({
  validations,
  uploadedFiles,
  tender,
  selectedReqId,
  onSelectReq,
  onMatchFile,
  onUnmatchFile,
  onSetExpiryDate,
  lang,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const selectedVal = validations.find((v) => v.requirement.id === selectedReqId) || validations[0] || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Matching & Document Inspector</h2>
        <p className="text-xs text-slate-500">
          Assign uploaded files to tender requirements and verify statutory validity.
        </p>
      </div>

      {/* Split Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): Requirements List */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col h-[700px]">
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Tender Requirements ({validations.length})
            </span>
            <span className="text-xs text-slate-500 font-medium">Click to select & inspect</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {validations.map((val) => {
              const { requirement, status, matchedFile } = val;
              const isSelected = selectedVal?.requirement.id === requirement.id;
              const displayTitle = lang === 'bn' ? requirement.title_bn : requirement.title_en;

              return (
                <div
                  key={requirement.id}
                  onClick={() => onSelectReq(requirement.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-300 shadow-2xs'
                      : 'hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5 text-xs">
                      <span className="font-bold text-blue-700">{requirement.id}</span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="font-semibold text-slate-800">{displayTitle}</span>
                    </div>
                    <StatusBadge status={status} lang={lang} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span className="truncate max-w-[260px]">
                      {matchedFile ? (
                        <span className="text-slate-700 font-medium">Attached: {matchedFile.name}</span>
                      ) : (
                        <span className="italic text-slate-400">No file attached</span>
                      )}
                    </span>
                    <span className="text-slate-400">
                      {requirement.mandatory ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (6 cols): Selected Document Inspector & Assignment Panel */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col h-[700px] overflow-y-auto space-y-4 text-xs">
          {selectedVal ? (
            <>
              {/* Requirement Header */}
              <div className="pb-3 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {selectedVal.requirement.id}
                    </span>
                    <span className="text-slate-400">Order #{selectedVal.requirement.order}</span>
                    {selectedVal.requirement.mandatory ? (
                      <span className="px-1.5 py-0.2 rounded font-bold text-[10px] bg-red-50 text-red-600 border border-red-200">
                        Mandatory
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded font-medium text-[10px] bg-slate-100 text-slate-600">
                        Optional
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">
                    {lang === 'bn' ? selectedVal.requirement.title_bn : selectedVal.requirement.title_en}
                  </h3>
                </div>

                <StatusBadge status={selectedVal.status} lang={lang} />
              </div>

              {/* Status Explanation Banner */}
              <div
                className={`p-3 rounded-lg border leading-relaxed ${
                  selectedVal.status === 'OK'
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                    : selectedVal.status === 'NOT_PROVIDED'
                    ? 'bg-slate-50 border-slate-200 text-slate-600'
                    : 'bg-red-50/60 border-red-200 text-red-800'
                }`}
              >
                <span className="font-semibold block mb-0.5">Compliance Status:</span>
                <span>{lang === 'bn' ? selectedVal.message_bn : selectedVal.message_en}</span>
              </div>

              {/* Assign / Change Attached File */}
              <div className="space-y-2 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Assign Uploaded PDF
                </span>

                <select
                  value={selectedVal.matchedFile?.id || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      onMatchFile(selectedVal.requirement.id, e.target.value);
                    }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                >
                  <option value="" disabled>
                    Choose an uploaded PDF file...
                  </option>
                  {uploadedFiles.map((file) => (
                    <option key={file.id} value={file.id}>
                      {file.name} ({file.pages} pages &bull; {(file.size / 1024).toFixed(0)} KB)
                    </option>
                  ))}
                </select>

                {selectedVal.matchedFile && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-slate-600 text-[11px]">
                      <span className="font-semibold text-slate-800">{selectedVal.matchedFile.pages} Pages</span> &bull;{' '}
                      {(selectedVal.matchedFile.size / 1024).toFixed(0)} KB
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-blue-700 border border-slate-200 rounded text-xs font-semibold flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{showPreview ? 'Hide' : 'Preview'}</span>
                      </button>
                      <button
                        onClick={() => onUnmatchFile(selectedVal.requirement.id)}
                        className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-600 border border-slate-200 rounded text-xs font-semibold flex items-center space-x-1"
                      >
                        <Unlink className="w-3 h-3" />
                        <span>Detach</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Expiry Date Setting (if requirement requires expiry) */}
              {selectedVal.requirement.has_expiry && (
                <div className="space-y-2 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Statutory Expiration Date
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Tender Deadline: <strong>{tender.submission_deadline}</strong>
                    </span>
                  </div>

                  <input
                    type="date"
                    value={selectedVal.expiryDate || ''}
                    onChange={(e) => onSetExpiryDate(selectedVal.requirement.id, e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    Rule: Certificate expiration date must be on or after {tender.submission_deadline}.
                  </p>
                </div>
              )}

              {/* PDF Preview Drawer */}
              {showPreview && selectedVal.matchedFile && (
                <div className="pt-2 border-t border-slate-200">
                  <PDFPreviewPanel file={selectedVal.matchedFile} lang={lang} />
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-slate-400">
              Select a requirement on the left to inspect and assign.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
