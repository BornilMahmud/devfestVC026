import React, { useState } from 'react';
import { ReadinessSummary, Language } from '../types';
import { t } from '../utils/translations';
import {
  ShieldCheck,
  ShieldAlert,
  Download,
  FileSpreadsheet,
  Wand2,
  AlertCircle,
  Save,
  CheckCircle,
  Loader2,
} from 'lucide-react';

interface ReadinessHeaderProps {
  readiness: ReadinessSummary;
  lang: Language;
  onGenerate: () => void;
  onAutoMatch: () => void;
  onExportCSV: () => void;
  onSaveWorkspace: () => void;
  isGenerating: boolean;
  generationStep: string;
}

export const ReadinessHeader: React.FC<ReadinessHeaderProps> = ({
  readiness,
  lang,
  onGenerate,
  onAutoMatch,
  onExportCSV,
  onSaveWorkspace,
  isGenerating,
  generationStep,
}) => {
  const [showBlockers, setShowBlockers] = useState(false);

  const { percentage, isReady, blockers, mandatoryCount, readyCount } = readiness;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Top Banner: Readiness Status + Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Readiness Meter */}
        <div className="space-y-1.5 flex-1 max-w-lg">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold tracking-wider flex items-center space-x-1.5">
              {isReady ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              )}
              <span>{t(lang, 'submissionReadiness')}</span>
            </span>
            <span
              className={`font-mono font-bold text-sm ${
                isReady ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {percentage}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isReady
                  ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Mandatory Documents: {readyCount} / {mandatoryCount}</span>
            <span>Blockers: {blockers.length}</span>
          </div>
        </div>

        {/* State Badge */}
        <div className="flex items-center space-x-3">
          <div
            className={`px-3.5 py-2 rounded-lg border font-mono text-xs font-bold flex items-center space-x-2 shadow-md ${
              isReady
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/50'
                : 'bg-amber-950/40 text-amber-300 border-amber-500/50'
            }`}
          >
            {isReady ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{t(lang, 'packageReady')}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{t(lang, 'packageLocked')}</span>
              </>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={onGenerate}
            disabled={!isReady || isGenerating}
            className={`px-5 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-lg ${
              isReady && !isGenerating
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-cyan-500/25 cursor-pointer active:scale-95'
                : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>{generationStep || t(lang, 'generating')}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t(lang, 'generatePackage')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Auxiliary Action Bar (Bonus Tools) */}
      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onAutoMatch}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-md text-xs font-mono flex items-center space-x-1.5 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t(lang, 'autoMatch')}</span>
          </button>

          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-md text-xs font-mono flex items-center space-x-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t(lang, 'exportCsv')}</span>
          </button>

          <button
            onClick={onSaveWorkspace}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-md text-xs font-mono flex items-center space-x-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>{t(lang, 'saveWorkspace')}</span>
          </button>
        </div>

        {/* View Blockers toggle */}
        {blockers.length > 0 && (
          <button
            onClick={() => setShowBlockers(!showBlockers)}
            className="text-amber-400 hover:text-amber-300 text-xs font-mono flex items-center space-x-1 underline transition-colors"
          >
            <span>{showBlockers ? 'Hide Issues' : `Show ${blockers.length} Blocking Issues`}</span>
          </button>
        )}
      </div>

      {/* Expandable Blocking Issues Breakdown */}
      {showBlockers && blockers.length > 0 && (
        <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg text-xs font-mono text-red-300 space-y-1.5">
          <div className="font-bold text-red-200 flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{t(lang, 'blockingIssuesTitle')}:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-[11px] text-red-300/90">
            {blockers.map((b, idx) => (
              <li key={idx}>{lang === 'bn' ? b.bn : b.en}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
