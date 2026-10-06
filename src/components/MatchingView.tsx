import React, { useState, useMemo } from 'react';
import {
  RequirementValidation,
  UploadedFile,
  TenderMetadata,
  Language,
} from '../types';
import { StatusBadge } from './StatusBadge';
import { PDFPreviewPanel } from './PDFPreviewPanel';
import {
  Calendar,
  Eye,
  Unlink,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { t } from '../utils/translations';

interface MatchingViewProps {
  validations: RequirementValidation[];
  uploadedFiles: UploadedFile[];
  tender: TenderMetadata;
  selectedReqId: string | null;
  onSelectReq: (reqId: string) => void;
  onMatchFile: (requirementId: string, fileId: string) => void;
  onUnmatchFile: (requirementId: string) => void;
  onSetExpiryDate: (requirementId: string, date: string) => void;
  onNavigateToValidation?: () => void;
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
  onNavigateToValidation,
  lang,
}) => {
  const [showPreview, setShowPreview] = useState(true);
  const [ignoredSuggestions, setIgnoredSuggestions] = useState<Set<string>>(new Set());

  const selectedVal = validations.find((v) => v.requirement.id === selectedReqId) || validations[0] || null;

  // Simple, reliable auto-match candidate suggestion (Bonus Part H)
  const suggestedCandidate = useMemo(() => {
    if (!selectedVal || selectedVal.matchedFile || ignoredSuggestions.has(selectedVal.requirement.id)) {
      return null;
    }
    const reqWords = selectedVal.requirement.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    for (const file of uploadedFiles) {
      const fn = file.name.toLowerCase().replace(/[^a-z0-9]/g, ' ');
      const hasMatch = reqWords.some((w) => fn.includes(w));
      if (hasMatch) {
        return file;
      }
    }
    return null;
  }, [selectedVal, uploadedFiles, ignoredSuggestions]);

  return (
    <div className="space-y-5 animate-tf-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-tf-fade-up">
        <div>
          <h2 className="text-xl font-bold text-[#18263B] tracking-tight">
            {lang === 'bn' ? 'নথি মিলানো ও পরিদর্শন' : 'Match & inspect'}
          </h2>
          <p className="text-xs text-[#5C6B7E]">
            {tender.title} &bull;{' '}
            {lang === 'bn'
              ? 'প্রতিটি প্রয়োজনীয় নথির সাথে সঠিক ফাইল সংযুক্ত করুন এবং মেয়াদ যাচাই করুন।'
              : 'Connect each requirement to the right PDF and confirm expiry dates before validation.'}
          </p>
        </div>

        {onNavigateToValidation && (
          <button
            onClick={onNavigateToValidation}
            className="btn-tf-primary btn-hover-icon self-start sm:self-auto"
          >
            <span>{lang === 'bn' ? 'যাচাই করুন' : 'VALIDATE DOCUMENTS'}</span>
            <ArrowRight className="w-3.5 h-3.5 btn-icon-right" />
          </button>
        )}
      </div>

      {/* 3-Column / Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (4 cols): Requirements Checklist Sidebar */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#DEE4EC] rounded-xl overflow-hidden shadow-2xs flex flex-col h-[680px]">
          <div className="p-3.5 bg-[#F4F6F9] border-b border-[#DEE4EC] flex items-center justify-between text-xs font-semibold text-[#18263B]">
            <span>{lang === 'bn' ? 'প্রয়োজনীয় নথির তালিকা' : 'Requirements Checklist'}</span>
            <span className="text-[11px] text-[#5C6B7E]">
              {validations.filter((v) => v.matchedFile).length} / {validations.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#DEE4EC]">
            {validations.map((val) => {
              const { requirement, status, matchedFile } = val;
              const isSelected = selectedVal?.requirement.id === requirement.id;
              const displayTitle = lang === 'bn' ? requirement.title_bn : requirement.title_en;

              return (
                <div
                  key={requirement.id}
                  onClick={() => onSelectReq(requirement.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#EDF3FF] border-l-4 border-l-[#245CC6]'
                      : 'hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-[#18263B]">
                      {requirement.order.toString().padStart(2, '0')} {displayTitle}
                    </span>
                    {matchedFile && <Check className="w-3.5 h-3.5 text-[#21714C]" />}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#5C6B7E]">
                    <span className="truncate max-w-[180px]">
                      {matchedFile
                        ? matchedFile.name
                        : requirement.mandatory
                        ? t(lang, 'noDocumentMatched')
                        : t(lang, 'omittedOptional')}
                    </span>
                    <span className="text-[10px] font-mono">
                      {matchedFile ? `${matchedFile.pages}p` : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Column (5 cols): Live PDF Canvas / Document View */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#DEE4EC] rounded-xl p-4 shadow-2xs flex flex-col h-[680px]">
          <div className="pb-3 border-b border-[#DEE4EC] flex items-center justify-between text-xs">
            <span className="font-bold text-[#18263B] uppercase tracking-wider text-[10px]">
              {t(lang, 'pdfPreview')}
            </span>
            <span className="text-[#5C6B7E] text-[11px]">
              {selectedVal?.matchedFile
                ? `${selectedVal.matchedFile.name} · ${selectedVal.matchedFile.pages} ${lang === 'bn' ? 'পৃষ্ঠা' : 'pages'}`
                : lang === 'bn' ? 'কোন ফাইল নেই' : 'No file'}
            </span>
          </div>

          <div className="flex-1 mt-3 overflow-hidden rounded-lg bg-[#F4F6F9] border border-[#DEE4EC] flex flex-col items-center justify-center">
            {selectedVal?.matchedFile ? (
              <div className="w-full h-full overflow-y-auto p-2">
                <PDFPreviewPanel file={selectedVal.matchedFile} lang={lang} />
              </div>
            ) : (
              <div className="text-center p-8 space-y-2 text-[#5C6B7E]">
                <FileText className="w-10 h-10 mx-auto text-[#DEE4EC]" />
                <p className="text-xs font-medium">
                  {lang === 'bn' ? 'এই প্রয়োজনীয়তায় কোন নথি মিলানো হয়নি।' : 'No document matched to this requirement.'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'ডানদিকের পরিদর্শক থেকে একটি ফাইল সংযুক্ত করুন।' : 'Assign a file from the inspector on the right.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (3 cols): Document Inspector Panel */}
        <div className="lg:col-span-3 bg-[#FFFFFF] border border-[#DEE4EC] rounded-xl p-4 shadow-2xs flex flex-col h-[680px] overflow-y-auto space-y-4 text-xs">
          {selectedVal ? (
            <>
              {/* Header */}
              <div className="pb-2.5 border-b border-[#DEE4EC]">
                <span className="text-[10px] uppercase font-bold text-[#5C6B7E] block tracking-wider">
                  {t(lang, 'inspectorTitle')}
                </span>
                <h3 className="text-sm font-bold text-[#18263B] mt-1">
                  {lang === 'bn' ? selectedVal.requirement.title_bn : selectedVal.requirement.title_en}
                </h3>
                <div className="mt-1">
                  <StatusBadge status={selectedVal.status} lang={lang} />
                </div>
              </div>

              {/* Requirement Specs */}
              <div className="space-y-1.5 text-[11px] text-[#5C6B7E] bg-[#F4F6F9] p-3 rounded-lg border border-[#DEE4EC]">
                <div className="flex justify-between">
                  <span>{lang === 'bn' ? 'প্রয়োজনীয়তা:' : 'Requirement:'}</span>
                  <span className="font-semibold text-[#18263B]">
                    {selectedVal.requirement.id} · {selectedVal.requirement.mandatory ? (lang === 'bn' ? 'বাধ্যতামূলক' : 'Required') : (lang === 'bn' ? 'ঐচ্ছিক' : 'Optional')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'bn' ? 'ফাইলের আকার:' : 'File size:'}</span>
                  <span className="font-semibold text-[#18263B]">
                    {selectedVal.matchedFile ? `${(selectedVal.matchedFile.size / 1024).toFixed(1)} KB` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'bn' ? 'পৃষ্ঠা সংখ্যা:' : 'Page count:'}</span>
                  <span className="font-semibold text-[#18263B]">
                    {selectedVal.matchedFile ? `${selectedVal.matchedFile.pages} ${lang === 'bn' ? 'পৃষ্ঠা' : 'pages'}` : '—'}
                  </span>
                </div>
              </div>

              {/* Auto-Match Suggestion Banner (Part H) */}
              {suggestedCandidate && (
                <div className="bg-[#EDF3FF] border border-[#BED2FA] p-3 rounded-lg space-y-2 animate-tf-fade-in">
                  <div className="flex items-center space-x-1.5 text-[#245CC6] font-bold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'স্মার্ট প্রস্তাবিত ম্যাচ' : 'Suggested match'}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#18263B] truncate" title={suggestedCandidate.name}>
                    {suggestedCandidate.name} ({suggestedCandidate.pages}p)
                  </div>
                  <div className="flex items-center space-x-2 pt-0.5">
                    <button
                      onClick={() => onMatchFile(selectedVal.requirement.id, suggestedCandidate.id)}
                      className="btn-tf-primary !py-1 !px-2.5 !text-[11px]"
                    >
                      {lang === 'bn' ? 'গ্রহণ করুন' : 'ACCEPT'}
                    </button>
                    <button
                      onClick={() =>
                        setIgnoredSuggestions((prev) => new Set([...prev, selectedVal.requirement.id]))
                      }
                      className="btn-tf-secondary !py-1 !px-2.5 !text-[11px]"
                    >
                      {lang === 'bn' ? 'উপেক্ষা' : 'IGNORE'}
                    </button>
                  </div>
                </div>
              )}

              {/* Assign / Change Match Dropdown */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#5C6B7E] block tracking-wider">
                  {t(lang, 'matchedFile')}
                </span>
                <select
                  value={selectedVal.matchedFile?.id || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      onMatchFile(selectedVal.requirement.id, e.target.value);
                    }
                  }}
                  className="w-full bg-[#FFFFFF] border border-[#DEE4EC] rounded-md p-2 text-xs text-[#18263B] focus:outline-none focus:border-[#245CC6] shadow-2xs"
                >
                  <option value="" disabled>
                    {t(lang, 'selectFileToMatch')}
                  </option>
                  {uploadedFiles.map((file) => (
                    <option key={file.id} value={file.id}>
                      {file.name} ({file.pages}p)
                    </option>
                  ))}
                </select>

                {selectedVal.matchedFile && (
                  <button
                    onClick={() => onUnmatchFile(selectedVal.requirement.id)}
                    className="w-full py-1 text-xs text-[#B23A3A] hover:bg-[#FEF0F0] border border-[#F9CACA] rounded font-medium transition-colors cursor-pointer"
                  >
                    {t(lang, 'unmatch')}
                  </button>
                )}
              </div>

              {/* Expiry Date Section */}
              {selectedVal.requirement.has_expiry && (
                <div className="space-y-2 pt-2 border-t border-[#DEE4EC]">
                  <span className="text-[10px] uppercase font-bold text-[#5C6B7E] block tracking-wider">
                    {t(lang, 'expiry')}
                  </span>
                  <input
                    type="date"
                    value={selectedVal.expiryDate || ''}
                    onChange={(e) => onSetExpiryDate(selectedVal.requirement.id, e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#DEE4EC] rounded-md p-1.5 text-xs text-[#18263B] focus:outline-none focus:border-[#245CC6]"
                  />
                  <p className="text-[10px] text-[#5C6B7E]">
                    {lang === 'bn'
                      ? `${tender.submission_deadline} তারিখ পর্যন্ত বৈধ থাকতে হবে।`
                      : `Must be valid on ${tender.submission_deadline}.`}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-[#5C6B7E]">
              {t(lang, 'noDocumentSelected')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
