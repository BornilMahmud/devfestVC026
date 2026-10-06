import React from 'react';
import { TenderMetadata, Language } from '../types';
import { t } from '../utils/translations';
import { FileCode, Globe, Shield, Sparkles, FolderOpen } from 'lucide-react';

interface TopNavProps {
  tender: TenderMetadata | null;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onLoadRequirementsClick: () => void;
  onLoadSampleTender: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  tender,
  lang,
  onLanguageChange,
  onLoadRequirementsClick,
  onLoadSampleTender,
}) => {
  return (
    <header className="border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black tracking-wider text-slate-100 font-mono">
                {t(lang, 'appTitle')}
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-700/60 rounded">
                v2.6 CONTEST
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight">
              {t(lang, 'appSubtitle')}
            </p>
          </div>
        </div>

        {/* Tender metadata pills */}
        {tender && (
          <div className="hidden lg:flex items-center space-x-3 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-cyan-400 font-bold">{tender.tender_id}</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-300 truncate max-w-[220px]" title={tender.title}>
              {tender.title}
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-amber-400/90 text-[11px]">Due: {tender.submission_deadline}</span>
          </div>
        )}

        {/* Action Controls & Language Switcher */}
        <div className="flex items-center space-x-2">
          {/* Load Custom JSON Button */}
          <button
            onClick={onLoadRequirementsClick}
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-md text-xs font-mono flex items-center space-x-1.5 transition-colors shadow-sm"
            title="Upload arbitrary requirements.json"
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t(lang, 'loadRequirements')}</span>
          </button>

          {/* Load Sample Tender Button */}
          <button
            onClick={onLoadSampleTender}
            className="px-2.5 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 rounded-md text-xs font-mono flex items-center space-x-1.5 transition-colors shadow-sm"
            title="Load sample tender T-2026-0417"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t(lang, 'loadSampleTender')}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 rounded-md border border-slate-700/80 p-0.5 text-xs font-mono">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded transition-colors ${
                lang === 'en'
                  ? 'bg-cyan-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('bn')}
              className={`px-2 py-1 rounded transition-colors ${
                lang === 'bn'
                  ? 'bg-cyan-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              বাং
            </button>
          </div>

          {/* Security Indicator */}
          <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Browser-Only</span>
          </div>
        </div>
      </div>
    </header>
  );
};
