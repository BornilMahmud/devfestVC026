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
  ShieldCheck,
} from 'lucide-react';
import { LordIcon } from './LordIcon';

export type NavTab = 'documents' | 'validation' | 'package';

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
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-30 shadow-sm">
      {/* Top Bar: Brand, Metadata, and Settings */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-900">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold tracking-tight text-slate-100 font-sans">
                TENDERFORGE
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Intelligent Tender Document Package Builder
            </p>
          </div>
        </div>

        {/* Tender Metadata Information */}
        {tender && (
          <div className="hidden lg:flex items-center space-x-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-blue-400 font-bold">{tender.tender_id}</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-300 truncate max-w-[240px]" title={tender.title}>
              {tender.title}
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-amber-400">Due: {tender.submission_deadline}</span>
          </div>
        )}

        {/* Global Actions & Language Switcher */}
        <div className="flex items-center space-x-2">
          {/* Load Custom JSON Button */}
          <button
            onClick={onLoadRequirementsClick}
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md text-xs font-mono flex items-center space-x-1.5 transition-colors"
            title="Upload custom requirements.json"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Load JSON</span>
          </button>

          {/* Reset to Sample Tender */}
          <button
            onClick={onLoadSampleTender}
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md text-xs font-mono flex items-center space-x-1.5 transition-colors"
            title="Reset to official sample tender pack"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            <span>Sample Pack</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 rounded-md border border-slate-700 p-0.5 text-xs font-mono">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded transition-colors ${
                lang === 'en'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('bn')}
              className={`px-2 py-0.5 rounded transition-colors ${
                lang === 'bn'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              বাং
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 sm:space-x-4 overflow-x-auto py-1">
        <button
          onClick={() => onTabChange('documents')}
          className={`py-2 px-3.5 text-xs font-mono font-semibold flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'documents'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
          }`}
        >
          <Files className="w-4 h-4" />
          <span>Documents & Checklist</span>
        </button>

        <button
          onClick={() => onTabChange('validation')}
          className={`py-2 px-3.5 text-xs font-mono font-semibold flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'validation'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Compliance Issues</span>
          {blockerCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] rounded bg-red-950 text-red-300 border border-red-800 font-bold">
              {blockerCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('package')}
          className={`py-2 px-3.5 text-xs font-mono font-semibold flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'package'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Package Preview & Manifest</span>
        </button>
      </div>
    </header>
  );
};
