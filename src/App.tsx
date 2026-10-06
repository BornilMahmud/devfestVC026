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
import { Download, X, ShieldCheck } from 'lucide-react';

export function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<AppNavTab>('overview');
  const [tender, setTender] = useState<TenderMetadata>(sampleRequirements.tender);
  const [requirements, setRequirements] = useState<DocumentRequirement[]>(sampleRequirements.requirements);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [matches, setMatches] = useState<DocumentMatch[]>([]);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);

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
      setNotification(`Smart matched ${addedCount} document(s).`);
    } else {
      setNotification('No new automatic matches found.');
    }
  };

  // Handler: Export CSV bonus
  const handleExportCSV = () => {
    exportChecklistToCSV(tender, validations);
    setNotification('Exported compliance checklist as CSV.');
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
      setNotification('Failed to save workspace locally.');
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
          setNotification(`Loaded tender: ${parsed.tender.tender_id}`);
        } else {
          setNotification('Invalid requirements.json schema.');
        }
      } catch (err) {
        setNotification('Could not parse requirements JSON file.');
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
    setNotification('Loaded official sample tender T-2026-0417.');
  };

  // Handler: Final Package Generation with Elegant Modal
  const handleGeneratePackage = async () => {
    if (!readiness.isReady) {
      setActiveTab('validation');
      setNotification('Cannot generate package: Blocking issues exist.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep('Validating source documents...');
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
      setNotification(`Tender Package created successfully (${result.totalPages} pages).`);
    } catch (err: any) {
      console.error(err);
      setNotification(`Failed to generate package: ${err?.message || 'Unknown error'}`);
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

          {activeTab === 'design-system' && <DesignSystemView />}
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 text-slate-800">
            {isGenerating ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">Compiling Tender Package</h3>
                <p className="text-xs text-slate-500">{generationStep || 'Building PDF document...'}</p>
              </div>
            ) : (
              generatedResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5" />
                      <span>Package Ready</span>
                    </div>
                    <button
                      onClick={() => setGeneratedResult(null)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="font-bold text-blue-700 text-sm">{generatedResult.filename}</div>
                    <div className="text-slate-500 text-[11px]">
                      {generatedResult.totalPages} pages &bull; Official Cover & Table of Contents included
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => triggerBrowserDownload(generatedResult.blob, generatedResult.filename)}
                      className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow-2xs transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Package</span>
                    </button>
                    <button
                      onClick={() => setGeneratedResult(null)}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
