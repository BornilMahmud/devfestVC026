import React from 'react';
import { TenderMetadata, Language } from '../types';
import { FolderOpen, FileCode, Globe, Calendar, Building } from 'lucide-react';

interface TopHeaderProps {
  tender: TenderMetadata | null;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onLoadRequirementsClick: () => void;
  onLoadSampleTender: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  tender,
  lang,
  onLanguageChange,
  onLoadRequirementsClick,
  onLoadSampleTender,
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
      {/* Tender Metadata Pills */}
      <div className="flex items-center space-x-3 text-xs">
        {tender ? (
          <div className="flex items-center space-x-2 text-slate-700">
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {tender.tender_id}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="font-semibold text-slate-800 truncate max-w-sm" title={tender.title}>
              {tender.title}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="flex items-center space-x-1 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Deadline: <strong className="text-slate-800">{tender.submission_deadline}</strong></span>
            </span>
          </div>
        ) : (
          <span className="text-slate-400 italic">No Tender Specifications Loaded</span>
        )}
      </div>

      {/* Action Controls & Language Switcher */}
      <div className="flex items-center space-x-2.5">
        {/* Load JSON File */}
        <button
          onClick={onLoadRequirementsClick}
          className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-2xs"
          title="Load arbitrary requirements.json"
        >
          <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
          <span>Load JSON</span>
        </button>

        {/* Load Official Sample Pack */}
        <button
          onClick={onLoadSampleTender}
          className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-2xs"
          title="Reset to official sample pack"
        >
          <FileCode className="w-3.5 h-3.5 text-slate-500" />
          <span>Sample Pack</span>
        </button>

        {/* Language Switcher */}
        <div className="flex items-center bg-slate-100 rounded-md p-0.5 text-xs border border-slate-200">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              lang === 'en'
                ? 'bg-white text-blue-700 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('bn')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              lang === 'bn'
                ? 'bg-white text-blue-700 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            বাং
          </button>
        </div>
      </div>
    </header>
  );
};
