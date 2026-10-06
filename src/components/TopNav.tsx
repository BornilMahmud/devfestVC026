import React from 'react';
import { TenderMetadata, Language } from '../types';
import { t } from '../utils/translations';
import {
  FileCode,
  FolderOpen,
  LayoutDashboard,
  Files,
  AlertOctagon,
  PackageCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { LordIcon } from './LordIcon';

export type NavTab = 'overview' | 'documents' | 'validation' | 'package';

interface TopNavProps {
  tender: TenderMetadata | null;
  lang: Language;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  blockerCount: number;
  onLanguageChange: (lang: Language) => void;
  onLoadRequirementsClick: () => void;
  onLoadSampleTender: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  tender,
  lang,
  activeTab,
  onTabChange,
  blockerCount,
  onLanguageChange,
  onLoadRequirementsClick,
  onLoadSampleTender,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-30 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-900">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shadow-md">
            <LordIcon name="shield" size={20} trigger="hover" colors="primary:#38bdf8,secondary:#10b981" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black tracking-wider text-slate-100 font-mono">
                {t(lang, 'appTitle')}
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-slate-900 text-cyan-400 border border-slate-700 rounded">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight">
              {t(lang, 'appSubtitle')}
            </p>
          </div>
        </div>

        {/* Tender metadata pills */}
        {tender && (
          <div className="hidden lg:flex items-center space-x-3 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
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
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md text-xs font-mono flex items-center space-x-1.5 transition-colors shadow-sm"
            title="Upload arbitrary requirements.json"
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t(lang, 'loadRequirements')}</span>
          </button>

          {/* Load Sample Tender Button */}
          <button
            onClick={onLoadSampleTender}
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md text-xs font-mono flex items-center space-x-1.5 transition-colors shadow-sm"
            title="Load sample tender T-2026-0417"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            <span>{t(lang, 'loadSampleTender')}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 rounded-md border border-slate-700 p-0.5 text-xs font-mono">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded transition-colors ${
                lang === 'en'
                  ? 'bg-cyan-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('bn')}
              className={`px-2 py-0.5 rounded transition-colors ${
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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Strict Browser-Only</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 sm:space-x-3 overflow-x-auto py-1">
        <button
          onClick={() => onTabChange('overview')}
          className={`py-2 px-3 text-xs font-mono font-semibold flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => onTabChange('documents')}
          className={`py-2 px-3 text-xs font-mono font-semibold flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'documents'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Files className="w-4 h-4" />
          <span>Documents</span>
        </button>

        <button
          onClick={() => onTabChange('validation')}
          className={`py-2 px-3 text-xs font-mono font-semibold flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'validation'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Validation</span>
          {blockerCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-red-950 text-red-400 border border-red-800 font-bold">
              {blockerCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('package')}
          className={`py-2 px-3 text-xs font-mono font-semibold flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'package'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Package Preview</span>
        </button>
      </div>
    </header>
  );
};
