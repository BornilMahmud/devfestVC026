import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TenderMetadata,
  DocumentRequirement,
  UploadedFile,
  DocumentMatch,
  Language,
} from './types';
import { sampleRequirements } from './data/sampleRequirements';
import { validateAllRequirements } from './utils/statusEngine';
import { getDuplicateGroups } from './utils/hashing';
import { generateAutoMatches } from './utils/autoMatch';
import { exportChecklistToCSV } from './utils/csvExport';
import { generateTenderPackagePDF, triggerBrowserDownload } from './utils/pdfGenerator';
import { t } from './utils/translations';

// Components
import { Sidebar, AppNavTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { OverviewView } from './components/OverviewView';
import { DocumentsView } from './components/DocumentsView';
import { MatchingView } from './components/MatchingView';
import { ValidationView } from './components/ValidationView';
import { PackagePreviewView } from './components/PackagePreviewView';
import { DesignSystemView } from './components/DesignSystemView';
import { LordIcon } from './components/LordIcon';
import { IntroCinematic } from './components/IntroCinematic';
import { Download, X, ShieldCheck } from 'lucide-react';

export function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<AppNavTab>('overview');
  const [tender, setTender] = useState<TenderMetadata>(sampleRequirements.tender);
  const [requirements, setRequirements] = useState<DocumentRequirement[]>(sampleRequirements.requirements);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [matches, setMatches] = useState<DocumentMatch[]>([]);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);

  // 3D Intro Animation State (respects reduced motion & session seen flag)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('tf_intro_seen')) {
      return false;
    }
    return true;
  });

  // PDF Generation State & Modal
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedResult, setGeneratedResult] = useState<{
    blob: Blob;
    filename: string;
    totalPages: number;
  } | null>(null);

  const [notification, setNotification] = useState<string | null>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  // Auto-clear notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Centralized Deterministic Validation Engine
  const { validations, readiness } = useMemo(() => {
    return validateAllRequirements(requirements, matches, uploadedFiles, tender);
  }, [requirements, matches, uploadedFiles, tender]);

  // Content Duplicate Groups
  const duplicateGroups = useMemo(() => {
    return getDuplicateGroups(uploadedFiles);
  }, [uploadedFiles]);

  // Auto-select first requirement if none selected
  useEffect(() => {
    if (!selectedReqId && requirements.length > 0) {
      setSelectedReqId(requirements[0].id);
    }
  }, [requirements, selectedReqId]);

  // Active validation for inspector
  const selectedValidation = useMemo(() => {
    return validations.find((v) => v.requirement.id === selectedReqId) || null;
  }, [validations, selectedReqId]);

  // Handler: Add new files
  const handleFilesAdded = (newFiles: UploadedFile[]) => {
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setNotification(`Uploaded ${newFiles.length} file(s).`);
  };

  // Handler: Remove file
  const handleFileRemoved = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setMatches((prev) => prev.filter((m) => m.fileId !== fileId));
    setNotification('File removed from repository.');
  };

  // Handler: Match file to requirement
  const handleMatchFile = (requirementId: string, fileId: string) => {
    setMatches((prev) => {
      const filtered = prev.filter(
        (m) => m.requirementId !== requirementId && m.fileId !== fileId
      );
      const existing = prev.find((m) => m.requirementId === requirementId);
      return [
        ...filtered,
        {
          requirementId,
          fileId,
          expiryDate: existing?.expiryDate,
        },
      ];
    });
  };

  // Handler: Remove match
  const handleUnmatchFile = (requirementId: string) => {
    setMatches((prev) => prev.filter((m) => m.requirementId !== requirementId));
  };

  // Handler: Set expiry date
  const handleSetExpiryDate = (requirementId: string, date: string) => {
    setMatches((prev) => {
      const existing = prev.find((m) => m.requirementId === requirementId);
      if (existing) {
        return prev.map((m) =>
          m.requirementId === requirementId ? { ...m, expiryDate: date } : m
        );
      } else {
        return [...prev, { requirementId, fileId: '', expiryDate: date }];
      }
    });
  };

  // Handler: Auto-Match suggestion bonus
  const handleAutoMatch = () => {
    const updatedMatches = generateAutoMatches(requirements, uploadedFiles, matches);
    const addedCount = updatedMatches.length - matches.length;
    setMatches(updatedMatches);
    if (addedCount > 0) {
      setNotification(lang === 'bn' ? `${addedCount}টি নথি স্বয়ংক্রিয়ভাবে মেলানো হয়েছে।` : `Smart matched ${addedCount} document(s).`);
    } else {
      setNotification(t(lang, 'noNewMatches'));
    }
  };

  // Handler: Export CSV bonus
  const handleExportCSV = () => {
    exportChecklistToCSV(tender, validations);
    setNotification(t(lang, 'exportedCsvNotification'));
  };

  // Handler: Save workspace to localStorage bonus
  const handleSaveWorkspace = () => {
    try {
      const stateToSave = {
        tender,
        requirements,
        matches,
      };
      localStorage.setItem('tenderforge_workspace', JSON.stringify(stateToSave));
      setNotification(t(lang, 'workspaceSaved'));
    } catch (e) {
      setNotification(t(lang, 'saveWorkspaceFailed'));
    }
  };

  // Handler: Load custom requirements.json file
  const handleLoadCustomJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.tender && Array.isArray(parsed.requirements)) {
          setTender(parsed.tender);
          setRequirements(parsed.requirements);
          setMatches([]);
          setSelectedReqId(parsed.requirements[0]?.id || null);
          setNotification(`${t(lang, 'loadedTenderPrefix')} ${parsed.tender.tender_id}`);
        } else {
          setNotification(t(lang, 'invalidJsonSchema'));
        }
      } catch (err) {
        setNotification(t(lang, 'parseJsonError'));
      }
    };
    reader.readAsText(file);
    if (jsonInputRef.current) jsonInputRef.current.value = '';
  };

  // Handler: Reset to sample tender
  const handleLoadSample = () => {
    setTender(sampleRequirements.tender);
    setRequirements(sampleRequirements.requirements);
    setMatches([]);
    setSelectedReqId(sampleRequirements.requirements[0].id);
    setNotification(t(lang, 'loadedSampleTender'));
  };

  // Handler: Final Package Generation with Elegant Modal
  const handleGeneratePackage = async () => {
    if (!readiness.isReady) {
      setActiveTab('validation');
      setNotification(t(lang, 'cannotGenerateBlockers'));
      return;
    }

    setIsGenerating(true);
    setGenerationStep(lang === 'bn' ? 'নথিসমূহ যাচাই করা হচ্ছে...' : 'Validating source documents...');
    setGeneratedResult(null);

    try {
      const result = await generateTenderPackagePDF(
        tender,
        validations,
        true, // include index page bonus
        (prog) => setGenerationStep(prog.step)
      );

      setGeneratedResult(result);
      triggerBrowserDownload(result.blob, result.filename);
      setNotification(
        lang === 'bn'
          ? `${t(lang, 'packageCreatedSuccess')} (${result.totalPages} ${t(lang, 'pagesUnit')})।`
          : `${t(lang, 'packageCreatedSuccess')} (${result.totalPages} ${t(lang, 'pagesUnit')}).`
      );
    } catch (err: any) {
      console.error(err);
      setNotification(`${t(lang, 'packageCreatedFailed')} ${err?.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Jump to specific requirement inspection
  const handleInspectRequirement = (reqId: string) => {
    setSelectedReqId(reqId);
    setActiveTab('matching');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex antialiased font-sans">
      {/* Hidden file input for custom JSON */}
      <input
        ref={jsonInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleLoadCustomJSON}
        className="hidden"
      />

      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        blockerCount={readiness.blockers.length}
        lang={lang}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <TopHeader
          tender={tender}
          lang={lang}
          onLanguageChange={setLang}
          onLoadRequirementsClick={() => jsonInputRef.current?.click()}
          onLoadSampleTender={handleLoadSample}
          onReplayIntro={() => setShowIntro(true)}
        />

        {/* Workspace Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewView
              tender={tender}
              validations={validations}
              readiness={readiness}
              lang={lang}
              onGenerate={handleGeneratePackage}
              onAutoMatch={handleAutoMatch}
              onExportCSV={handleExportCSV}
              onReviewIssues={() => setActiveTab('validation')}
              onSelectRequirement={handleInspectRequirement}
              isGenerating={isGenerating}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsView
              files={uploadedFiles}
              duplicateGroups={duplicateGroups}
              requirements={requirements}
              matches={matches}
              onFilesAdded={handleFilesAdded}
              onFileRemoved={handleFileRemoved}
              lang={lang}
            />
          )}

          {activeTab === 'matching' && (
            <MatchingView
              validations={validations}
              uploadedFiles={uploadedFiles}
              tender={tender}
              selectedReqId={selectedReqId}
              onSelectReq={(id) => setSelectedReqId(id)}
              onMatchFile={handleMatchFile}
              onUnmatchFile={handleUnmatchFile}
              onSetExpiryDate={handleSetExpiryDate}
              onNavigateToValidation={() => setActiveTab('validation')}
              lang={lang}
            />
          )}

          {activeTab === 'validation' && (
            <ValidationView
              validations={validations}
              tender={tender}
              onReviewRequirement={handleInspectRequirement}
              lang={lang}
            />
          )}

          {activeTab === 'package' && (
            <PackagePreviewView
              tender={tender}
              validations={validations}
              readiness={readiness}
              lang={lang}
              onGenerate={handleGeneratePackage}
              isGenerating={isGenerating}
              generationStep={generationStep}
            />
          )}

          {activeTab === 'design-system' && <DesignSystemView lang={lang} />}
        </main>
      </div>

      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-mono flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Package Generation / Ready Modal */}
      {(isGenerating || generatedResult) && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-tf-fade-in">
          <div className="bg-[#FFFFFF] border border-[#DEE4EC] rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 text-[#18263B] animate-tf-fade-up">
            {isGenerating ? (
              <div className="text-center py-6 space-y-3">
                <div className="flex justify-center">
                  <LordIcon name="refresh" size={44} trigger="loop" colors="primary:#245CC6,secondary:#5C6B7E" />
                </div>
                <h3 className="text-sm font-bold tracking-wider text-[#18263B] uppercase">
                  {t(lang, 'preparingPackage')}
                </h3>
                <p className="text-xs text-[#5C6B7E] font-mono">
                  {generationStep || (lang === 'bn' ? 'নথি সংকলন ও সূচিপত্র তৈরি হচ্ছে...' : 'Validating, indexing & compiling PDF package...')}
                </p>
                <div className="w-48 h-1 bg-[#F4F6F9] rounded-full mx-auto overflow-hidden">
                  <div className="w-full h-full bg-[#245CC6] animate-pulse" />
                </div>
              </div>
            ) : (
              generatedResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DEE4EC]">
                    <div className="flex items-center space-x-2 text-[#21714C] font-bold text-sm">
                      <LordIcon name="check" size={24} trigger="in" colors="primary:#21714C,secondary:#18263B" />
                      <span>{t(lang, 'packageReadyModal')}</span>
                    </div>
                    <button
                      onClick={() => setGeneratedResult(null)}
                      className="text-[#5C6B7E] hover:text-[#18263B] p-1 rounded hover:bg-[#F4F6F9] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DEE4EC] text-xs space-y-2">
                    <div className="font-bold text-[#245CC6] text-sm break-all font-mono">
                      {generatedResult.filename}
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DEE4EC] text-[11px] text-[#5C6B7E]">
                      <div>
                        <span className="font-semibold text-[#18263B]">{t(lang, 'docCountLabel')} </span>
                        <span>{validations.filter((v) => v.matchedFile).length} {lang === 'bn' ? 'যাচাইকৃত' : 'verified'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#18263B]">{t(lang, 'pageCountLabel')} </span>
                        <span>{generatedResult.totalPages} {lang === 'bn' ? 'পৃষ্ঠা' : 'pages'}</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-[#5C6B7E] italic pt-1">
                      {lang === 'bn'
                        ? 'অফিসিয়াল কভার পৃষ্ঠা ও সংবিধিবদ্ধ সূচিপত্র অন্তর্ভুক্ত'
                        : 'Includes Official Cover Page & Statutory Table of Contents Index'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => triggerBrowserDownload(generatedResult.blob, generatedResult.filename)}
                      className="btn-tf-success btn-hover-icon flex-1 !py-2.5 !text-xs cursor-pointer"
                    >
                      <LordIcon name="download" size={16} trigger="hover" colors="primary:#ffffff,secondary:#ffffff" />
                      <span>{t(lang, 'downloadPackage')}</span>
                    </button>
                    <button
                      onClick={() => setGeneratedResult(null)}
                      className="btn-tf-secondary !py-2.5 !px-4 !text-xs cursor-pointer"
                    >
                      {t(lang, 'closeBtn')}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* 3D Intro Cinematic (Opens on first session load or manual replay) */}
      {showIntro && (
        <IntroCinematic onComplete={() => setShowIntro(false)} lang={lang} />
      )}
    </div>
  );
}
