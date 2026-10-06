import React from 'react';
import { TenderMetadata, Language } from '../types';
import { FolderOpen, FileCode, Play, CheckCircle2 } from 'lucide-react';
import { LordIcon } from './LordIcon';

interface TopHeaderProps {
  tender: TenderMetadata | null;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onLoadRequirementsClick: () => void;
  onLoadSampleTender: () => void;
  onReplayIntro?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  tender,
  lang,
  onLanguageChange,
  onLoadRequirementsClick,
  onLoadSampleTender,
  onReplayIntro,
}) => {
  return (
    <header className="h-14 bg-[#FFFFFF] border-b border-[#DEE4EC] px-6 flex items-center justify-between shrink-0 select-none animate-tf-fade-up">
      {/* Tender Metadata */}
      <div className="flex items-center space-x-3 text-xs">
        {tender ? (
          <div className="flex items-center space-x-2 text-[#18263B]">
            <span className="font-bold text-[#245CC6] bg-[#EDF3FF] px-2 py-0.5 rounded border border-[#BED2FA]">
              {tender.tender_id}
            </span>
            <span className="text-[#5C6B7E]">&bull;</span>
            <span className="font-semibold text-[#18263B] truncate max-w-xs md:max-w-md" title={tender.title}>
              {tender.title}
            </span>
            <span className="text-[#5C6B7E]">&bull;</span>
            <div className="flex items-center space-x-1 text-[#5C6B7E]">
              <span className="uppercase text-[10px] font-bold text-[#5C6B7E]">
                {lang === 'bn' ? 'জমাদানের শেষ সময়' : 'SUBMISSION DEADLINE'}
              </span>
              <span className="font-semibold text-[#18263B] ml-1">
                {tender.submission_deadline}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-[#5C6B7E] italic">
            {lang === 'bn' ? 'কোন দরপত্র লোড করা হয়নি' : 'No tender loaded'}
          </span>
        )}
      </div>

      {/* Global Status, Controls & Language Switcher */}
      <div className="flex items-center space-x-2.5 text-xs">
        {/* System Online Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 text-[#21714C] text-[11px] font-semibold bg-[#EDF7F1] px-2 py-0.5 rounded border border-[#B7E2CD]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#21714C]" />
          <span>{lang === 'bn' ? '✓ সিস্টেম সচল' : '✓ System online'}</span>
        </div>

        {/* Load JSON Action */}
        <button
          onClick={onLoadRequirementsClick}
          className="btn-tf-secondary !py-1 !px-2.5 !text-xs"
          title="Load arbitrary requirements.json"
        >
          <FolderOpen className="w-3.5 h-3.5 text-[#5C6B7E] btn-icon-up" />
          <span>{lang === 'bn' ? 'লোড JSON' : 'Load JSON'}</span>
        </button>

        {/* Load Sample Action */}
        <button
          onClick={onLoadSampleTender}
          className="btn-tf-secondary !py-1 !px-2.5 !text-xs"
          title="Load official sample pack"
        >
          <FileCode className="w-3.5 h-3.5 text-[#5C6B7E] btn-icon-up" />
          <span>{lang === 'bn' ? 'নমুনা প্যাক' : 'Sample Pack'}</span>
        </button>

        {/* Replay 3D Intro Button */}
        {onReplayIntro && (
          <button
            onClick={onReplayIntro}
            className="btn-tf-secondary !py-1 !px-2.5 !text-xs !text-[#245CC6] !bg-[#EDF3FF] !border-[#BED2FA]"
            title="Replay 3D Intro Experience"
          >
            <Play className="w-3 h-3 text-[#245CC6] fill-[#245CC6]" />
            <span className="font-semibold">3D Intro</span>
          </button>
        )}

        {/* Language Switcher */}
        <div className="flex items-center bg-[#F4F6F9] rounded p-0.5 text-xs border border-[#DEE4EC]">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              lang === 'en'
                ? 'bg-[#FFFFFF] text-[#245CC6] font-bold shadow-2xs'
                : 'text-[#5C6B7E] hover:text-[#18263B]'
            }`}
          >
            EN
          </button>
          <span className="text-[#DEE4EC] px-0.5">|</span>
          <button
            onClick={() => onLanguageChange('bn')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              lang === 'bn'
                ? 'bg-[#FFFFFF] text-[#245CC6] font-bold shadow-2xs'
                : 'text-[#5C6B7E] hover:text-[#18263B]'
            }`}
          >
            বাংলা
          </button>
        </div>
      </div>
    </header>
  );
};
