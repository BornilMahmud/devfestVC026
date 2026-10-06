import React, { useState } from 'react';
import {
  TenderMetadata,
  RequirementValidation,
  ReadinessSummary,
  Language,
} from '../types';
import { StatusBadge } from './StatusBadge';
import { LordIcon } from './LordIcon';
import { t } from '../utils/translations';
import {
  Building,
  User,
  Calendar,
  Download,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface OverviewViewProps {
  tender: TenderMetadata;
  validations: RequirementValidation[];
  readiness: ReadinessSummary;
  lang: Language;
  onGenerate: () => void;
  onAutoMatch: () => void;
  onExportCSV: () => void;
  onReviewIssues: () => void;
  onSelectRequirement: (reqId: string) => void;
  isGenerating: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  tender,
  validations,
  readiness,
  lang,
  onGenerate,
  onAutoMatch,
  onExportCSV,
  onReviewIssues,
  onSelectRequirement,
  isGenerating,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'required' | 'optional'>('all');

  const { percentage, isReady, blockers, mandatoryCount, readyCount } = readiness;

  const totalIncludedDocs = validations.filter((v) => v.matchedFile).length;
  const sourcePages = validations.reduce((sum, v) => sum + (v.matchedFile?.pages || 0), 0);
  const totalPages = sourcePages + 1; // + 1 cover page

  const filtered = validations.filter((v) => {
    const title = lang === 'bn' ? v.requirement.title_bn : v.requirement.title_en;
    const matchSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.matchedFile?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    if (filterType === 'required') return matchSearch && v.requirement.mandatory;
    if (filterType === 'optional') return matchSearch && !v.requirement.mandatory;
    return matchSearch;
  });

  return (
    <div className="space-y-5 animate-tf-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-tf-fade-up">
        <div>
          <h2 className="text-xl font-bold text-[#18263B] tracking-tight">
            {lang === 'bn' ? 'সারসংক্ষেপ' : 'Overview'}
          </h2>
          <p className="text-xs text-[#5C6B7E]">
            {tender.title} &bull; {lang === 'bn' ? 'আপনার জমাদানের প্যাকেজ চূড়ান্ত পর্যালোচনার জন্য প্রস্তুত।' : 'Your submission is ready for final review.'}
          </p>
        </div>

        <button
          onClick={onReviewIssues}
          className="btn-tf-secondary btn-hover-icon self-start sm:self-auto"
        >
          <span>{isReady ? (lang === 'bn' ? 'প্যাকেজ পর্যালোচনা করুন' : 'REVIEW PACKAGE') : (lang === 'bn' ? 'সমস্যা পর্যালোচনা করুন' : 'REVIEW ISSUES')}</span>
          <ArrowRight className="w-3.5 h-3.5 btn-icon-right" />
        </button>
      </div>

      {/* Tender Information Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#DEE4EC] rounded-xl p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#5C6B7E] block tracking-wider">{t(lang, 'tenderId')}</span>
            <span className="font-bold text-[#245CC6] text-sm mt-0.5 block">{tender.tender_id}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#5C6B7E] block tracking-wider">{t(lang, 'procuringEntity')}</span>
            <span className="font-semibold text-[#18263B] mt-0.5 block truncate" title={tender.procuring_entity}>
              {tender.procuring_entity}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#5C6B7E] block tracking-wider">{t(lang, 'bidder')}</span>
            <span className="font-semibold text-[#18263B] mt-0.5 block truncate" title={tender.bidder}>
              {tender.bidder}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#5C6B7E] block tracking-wider">{t(lang, 'submissionDeadline')}</span>
            <span className="font-semibold text-[#926009] mt-0.5 block">
              {tender.submission_deadline} &bull; 3:00 PM
            </span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-[#DEE4EC] flex items-center justify-between text-[11px] text-[#5C6B7E]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#21714C]" />
            <span>
              {lang === 'bn'
                ? `requirements.json • ১০টি প্রয়োজনীয়তা লোডকৃত (${mandatoryCount} প্রয়োজনীয় / ${validations.length - mandatoryCount} ঐচ্ছিক)`
                : `requirements.json • Loaded 10 requirements (${mandatoryCount} required / ${validations.length - mandatoryCount} optional)`}
            </span>
          </div>
          <button
            onClick={onExportCSV}
            className="text-[#245CC6] hover:underline font-medium"
          >
            {t(lang, 'exportCsv')}
          </button>
        </div>
      </div>

      {/* Submission Readiness KPI Dashboard (Exact Figma Layout) */}
      <div className="bg-[#FFFFFF] border border-[#DEE4EC] rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#5C6B7E] block tracking-wider">
                {t(lang, 'submissionReadiness')}
              </span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className={`text-2xl font-bold font-mono ${isReady ? 'text-[#21714C]' : 'text-[#B23A3A]'}`}>
                  {percentage}%
                </span>
                <span className={`text-xs font-bold uppercase ${isReady ? 'text-[#21714C]' : 'text-[#B23A3A]'}`}>
                  {isReady ? t(lang, 'packageReady') : t(lang, 'packageLocked')}
                </span>
              </div>
            </div>

            <div className="hidden sm:grid grid-cols-4 gap-4 border-l border-[#DEE4EC] pl-6 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#5C6B7E] block uppercase font-bold">{t(lang, 'readyCount')}</span>
                <span className="font-bold text-[#18263B] text-sm">{readyCount} / {mandatoryCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#5C6B7E] block uppercase font-bold">{t(lang, 'duplicateConflicts')}</span>
                <span className="font-bold text-[#18263B] text-sm">0</span>
              </div>
              <div>
                <span className="text-[10px] text-[#5C6B7E] block uppercase font-bold">{t(lang, 'expiryIssues')}</span>
                <span className={`font-bold text-sm ${validations.some(v => v.status === 'EXPIRED') ? 'text-[#B23A3A]' : 'text-[#18263B]'}`}>
                  {validations.filter(v => v.status === 'EXPIRED' || v.status === 'EXPIRY_NEEDED').length}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#5C6B7E] block uppercase font-bold">{t(lang, 'blockersCount')}</span>
                <span className={`font-bold text-sm ${blockers.length > 0 ? 'text-[#B23A3A]' : 'text-[#21714C]'}`}>
                  {blockers.length}
                </span>
              </div>
            </div>
          </div>

          {/* Dominant Generate Button */}
          <div>
            <button
              onClick={onGenerate}
              disabled={!isReady || isGenerating}
              className={`w-full lg:w-auto px-6 py-2.5 rounded-lg text-xs font-bold font-mono tracking-wide flex items-center justify-center space-x-2 transition-all shadow-sm ${
                isReady && !isGenerating
                  ? 'btn-tf-primary btn-hover-icon'
                  : 'bg-[#F4F6F9] text-[#5C6B7E] border border-[#DEE4EC] cursor-not-allowed opacity-60'
              }`}
            >
              {isGenerating ? (
                <LordIcon name="refresh" size={16} trigger="loop" colors="primary:#ffffff,secondary:#bed2fa" />
              ) : (
                <Download className="w-4 h-4 btn-icon-up" />
              )}
              <span>{isGenerating ? t(lang, 'generating') : t(lang, 'generatePackage')}</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-[#5C6B7E] pt-2 border-t border-[#DEE4EC]">
          {isReady
            ? (lang === 'bn'
                ? `সকল ${mandatoryCount}টি প্রয়োজনীয় নথি যাচাইকৃত · ${validations.length - totalIncludedDocs}টি ঐচ্ছিক নথি বাদ দেওয়া হয়েছে · ${totalIncludedDocs}টি সংযুক্তি + প্রস্তুতকৃত কভার = ${totalPages} পৃষ্ঠা`
                : `All ${mandatoryCount} required documents verified · ${validations.length - totalIncludedDocs} optional documents omitted · ${totalIncludedDocs} attachments + generated cover = ${totalPages} pages`)
            : (lang === 'bn'
                ? `${blockers.length}টি বাধা সমস্যার সমাধান প্রয়োজন। সকল প্রয়োজনীয় নথি বৈধ না হওয়া পর্যন্ত প্যাকেজ তৈরি লক থাকবে।`
                : `${blockers.length} blocking issues require attention. Package generation is locked until all required documents are valid.`)}
        </div>
      </div>

      {/* Requirements Checklist Table (Exact 58px recipe from Figma) */}
      <div className="bg-[#FFFFFF] border border-[#DEE4EC] rounded-xl overflow-hidden shadow-2xs">
        {/* Table Toolbar */}
        <div className="p-3.5 border-b border-[#DEE4EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-xs font-bold text-[#18263B] uppercase tracking-wider">
              {t(lang, 'checklistTitle')}
            </h3>
            <span className="text-[11px] text-[#5C6B7E]">
              ({totalIncludedDocs} {lang === 'bn' ? 'সংযুক্ত' : 'attached'} &bull; {sourcePages} {lang === 'bn' ? 'মূল পৃষ্ঠা' : 'source pages'})
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#5C6B7E] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t(lang, 'searchDocs')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-2.5 py-1 bg-[#F4F6F9] border border-[#DEE4EC] rounded text-xs text-[#18263B] placeholder-[#5C6B7E] focus:outline-none focus:border-[#245CC6] transition-colors"
              />
            </div>

            <div className="flex items-center bg-[#F4F6F9] rounded border border-[#DEE4EC] p-0.5">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${filterType === 'all' ? 'bg-[#FFFFFF] text-[#245CC6] font-bold shadow-2xs' : 'text-[#5C6B7E]'}`}
              >
                {t(lang, 'allFilter')}
              </button>
              <button
                onClick={() => setFilterType('required')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${filterType === 'required' ? 'bg-[#FFFFFF] text-[#245CC6] font-bold shadow-2xs' : 'text-[#5C6B7E]'}`}
              >
                {t(lang, 'requiredFilter')}
              </button>
              <button
                onClick={() => setFilterType('optional')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${filterType === 'optional' ? 'bg-[#FFFFFF] text-[#245CC6] font-bold shadow-2xs' : 'text-[#5C6B7E]'}`}
              >
                {t(lang, 'optionalFilter')}
              </button>
            </div>
          </div>
        </div>

        {/* Table Rows (58px height recipe) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F4F6F9] border-b border-[#DEE4EC] text-[#5C6B7E] font-semibold text-[11px]">
                <th className="py-2.5 px-4 w-12 text-center">#</th>
                <th className="py-2.5 px-4">{lang === 'bn' ? 'প্রয়োজনীয় নথি' : 'Requirement'}</th>
                <th className="py-2.5 px-4">{lang === 'bn' ? 'মিলানো ফাইল' : 'Matched file'}</th>
                <th className="py-2.5 px-4 text-center w-16">{lang === 'bn' ? 'পৃষ্ঠা' : 'Pages'}</th>
                <th className="py-2.5 px-4 w-28">{lang === 'bn' ? 'মেয়াদ' : 'Expiry'}</th>
                <th className="py-2.5 px-4 text-center w-40">{lang === 'bn' ? 'অবস্থা' : 'Status'}</th>
                <th className="py-2.5 px-4 text-center w-24">{lang === 'bn' ? 'কাজ' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DEE4EC]">
              {filtered.map((val) => {
                const { requirement, status, matchedFile, expiryDate } = val;
                const displayTitle = lang === 'bn' ? requirement.title_bn : requirement.title_en;

                return (
                  <tr
                    key={requirement.id}
                    onClick={() => onSelectRequirement(requirement.id)}
                    className="h-[58px] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <td className="px-4 text-center font-bold text-[#5C6B7E]">
                      {requirement.order.toString().padStart(2, '0')}
                    </td>
                    <td className="px-4 text-[#18263B]">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{displayTitle}</span>
                        <span className="text-[10px] text-[#5C6B7E]">
                          {requirement.mandatory
                            ? (lang === 'bn' ? `প্রয়োজনীয় · ${requirement.id}` : `Required · ${requirement.id}`)
                            : (lang === 'bn' ? `ঐচ্ছিক · ${requirement.id}` : `Optional · ${requirement.id}`)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4">
                      {matchedFile ? (
                        <span className="text-[#245CC6] font-medium truncate max-w-[200px] block" title={matchedFile.name}>
                          {matchedFile.name}
                        </span>
                      ) : (
                        <span className="text-[#5C6B7E] italic">
                          {requirement.mandatory ? t(lang, 'noDocumentMatched') : t(lang, 'omittedOptional')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 text-center text-[#5C6B7E]">
                      {matchedFile ? matchedFile.pages : '—'}
                    </td>
                    <td className="px-4 text-[#5C6B7E] font-mono text-[11px]">
                      {requirement.has_expiry ? (
                        expiryDate || <span className="text-[#926009] font-semibold">{t(lang, 'needed')}</span>
                      ) : (
                        <span>{t(lang, 'notApplicable')}</span>
                      )}
                    </td>
                    <td className="px-4 text-center">
                      <StatusBadge status={status} lang={lang} />
                    </td>
                    <td className="px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRequirement(requirement.id);
                        }}
                        className="text-xs font-semibold text-[#245CC6] hover:underline cursor-pointer"
                      >
                        {t(lang, 'reviewDoc')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
