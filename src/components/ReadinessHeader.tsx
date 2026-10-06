import React from 'react';
import { ReadinessSummary, Language, TenderMetadata, RequirementValidation } from '../types';
import { t } from '../utils/translations';
import { LordIcon } from './LordIcon';
import {
  Download,
  FileSpreadsheet,
  Wand2,
  AlertOctagon,
  Save,
  CheckCircle2,
  Clock,
  Layers,
  FileCheck,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface ReadinessHeaderProps {
  tender: TenderMetadata;
  validations: RequirementValidation[];
  readiness: ReadinessSummary;
  lang: Language;
  onGenerate: () => void;
  onAutoMatch: () => void;
  onExportCSV: () => void;
  onSaveWorkspace: () => void;
  onReviewIssues: () => void;
  isGenerating: boolean;
  generationStep: string;
}

export const ReadinessHeader: React.FC<ReadinessHeaderProps> = ({
  tender,
  validations,
  readiness,
  lang,
  onGenerate,
  onAutoMatch,
  onExportCSV,
  onSaveWorkspace,
  onReviewIssues,
  isGenerating,
  generationStep,
}) => {
  const { percentage, isReady, blockers, mandatoryCount, readyCount } = readiness;

  const totalIncludedDocs = validations.filter((v) => v.matchedFile).length;
  const estimatedPages = 2 + validations.reduce((sum, v) => sum + (v.matchedFile?.pages || 0), 0); // Cover + Index + docs

  const hasDuplicateConflicts = Array.from(
    validations.reduce((map, v) => {
      if (v.matchedFile) {
        map.set(v.matchedFile.hash, (map.get(v.matchedFile.hash) || 0) + 1);
      }
      return map;
    }, new Map<string, number>()).values()
  ).some((count) => count > 1);

  const hasExpiryFailures = validations.some(
    (v) => v.status === 'EXPIRED' || v.status === 'EXPIRY_NEEDED'
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 text-slate-200">
      {/* Top Section: Tender Headline + Readiness Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="font-bold text-blue-400">{tender.tender_id}</span>
            <span>&bull;</span>
            <span className="text-slate-300 truncate max-w-md">{tender.title}</span>
            <span>&bull;</span>
            <span className="text-amber-400 font-semibold">Deadline: {tender.submission_deadline}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight mt-0.5">
            Tender Package Compliance & Assembly Console
          </h2>
        </div>

        {/* Primary Status Banner & Dominant Action */}
        <div className="flex items-center space-x-3">
          <div
            className={`px-3.5 py-2 rounded-lg border font-mono text-xs font-semibold flex items-center space-x-2 ${
              isReady
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                : 'bg-red-950/40 text-red-300 border-red-500/40'
            }`}
          >
            {isReady ? (
              <>
                <LordIcon name="check" size={16} trigger="hover" colors="primary:#10b981,secondary:#34d399" />
                <span>PACKAGE READY</span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span>PACKAGE LOCKED ({blockers.length} {blockers.length === 1 ? 'ISSUE' : 'ISSUES'})</span>
              </>
            )}
          </div>

          {/* Primary Action Button */}
          {isReady ? (
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-md flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? generationStep || 'GENERATING...' : 'GENERATE PACKAGE'}</span>
            </button>
          ) : (
            <button
              onClick={onReviewIssues}
              className="px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-red-900/60 hover:bg-red-900 text-red-200 border border-red-700/60 shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <span>REVIEW ISSUES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Middle Section: Preflight Audit Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
        {/* Metric 1: Readiness % */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span>SUBMISSION READINESS</span>
            <span className={`font-bold ${isReady ? 'text-emerald-400' : 'text-amber-400'}`}>
              {percentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isReady ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {isReady ? 'All mandatory rules verified' : `${blockers.length} blocking issues remaining`}
          </span>
        </div>

        {/* Metric 2: Required Documents */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
          <span className="text-slate-400 block">REQUIRED DOCUMENTS</span>
          <div className="text-base font-bold text-slate-100 mt-1">
            {readyCount} <span className="text-xs text-slate-500 font-normal">of {mandatoryCount} Attached</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {mandatoryCount - readyCount === 0 ? '✓ Complete' : `! ${mandatoryCount - readyCount} missing`}
          </span>
        </div>

        {/* Metric 3: Included Files & Pages */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
          <span className="text-slate-400 block">TOTAL ESTIMATED PAGES</span>
          <div className="text-base font-bold text-blue-400 mt-1">
            {estimatedPages} Pages
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {totalIncludedDocs} documents + Cover + Index
          </span>
        </div>

        {/* Metric 4: Compliance Status */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
          <span className="text-slate-400 block">STATUTORY AUDIT</span>
          <div className="text-xs font-semibold mt-1 space-y-0.5">
            <div className={`flex items-center space-x-1.5 ${hasExpiryFailures ? 'text-rose-400' : 'text-emerald-400'}`}>
              <span>{hasExpiryFailures ? '✕' : '✓'}</span>
              <span>Expiry validation</span>
            </div>
            <div className={`flex items-center space-x-1.5 ${hasDuplicateConflicts ? 'text-rose-400' : 'text-emerald-400'}`}>
              <span>{hasDuplicateConflicts ? '✕' : '✓'}</span>
              <span>Content deduplication</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Professional Tooling Actions */}
      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800 text-xs font-mono gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onAutoMatch}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center space-x-1.5 transition-colors"
            title="Auto-match filenames to requirements"
          >
            <Wand2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Smart Auto-Match</span>
          </button>

          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center space-x-1.5 transition-colors"
            title="Export checklist to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onSaveWorkspace}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md flex items-center space-x-1.5 transition-colors"
            title="Save workspace locally"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>Save Workspace</span>
          </button>
        </div>

        {/* Quick Review Issues Link */}
        {blockers.length > 0 && (
          <button
            onClick={onReviewIssues}
            className="text-red-400 hover:text-red-300 text-xs flex items-center space-x-1 font-semibold transition-colors"
          >
            <span>{blockers.length} issues blocking generation</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
