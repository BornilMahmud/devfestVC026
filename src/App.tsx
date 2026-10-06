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
import { TopNav, NavTab } from './components/TopNav';
import { ReadinessHeader } from './components/ReadinessHeader';
import { ChecklistTable } from './components/ChecklistTable';
import { DocumentInspector } from './components/DocumentInspector';
import { FileUploader } from './components/FileUploader';
import { IssueCenter } from './components/IssueCenter';
import { PackagePreviewView } from './components/PackagePreviewView';
import { LordIcon } from './components/LordIcon';
import {
  Download,
  CheckCircle2,
  X,
  FileCheck,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<NavTab>('documents');
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
    setNotification(`Added ${newFiles.length} document(s).`);
  };

  // Handler: Remove file
  const handleFileRemoved = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setMatches((prev) => prev.filter((m) => m.fileId !== fileId));
    setNotification('File removed.');
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
      setNotification(`Smart matched ${addedCount} document(s) based on filenames.`);
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
      // Auto-trigger browser download
      triggerBrowserDownload(result.blob, result.filename);
      setNotification(`Tender Package created successfully (${result.totalPages} pages).`);
    } catch (err: any) {
      console.error(err);
      setNotification(`Failed to generate package: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Jump from Issue Center directly to inspector in documents tab
  const handleReviewFromIssue = (reqId: string) => {
    setSelectedReqId(reqId);
    setActiveTab('documents');
  };

  const totalIncludedDocs = validations.filter((v) => v.matchedFile).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Hidden file input for custom JSON */}
      <input
        ref={jsonInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleLoadCustomJSON}
        className="hidden"
      />

      {/* Top Navigation */}
      <TopNav
        tender={tender}
        lang={lang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        blockerCount={readiness.blockers.length}
        onLanguageChange={setLang}
        onLoadRequirementsClick={() => jsonInputRef.current?.click()}
        onLoadSampleTender={handleLoadSample}
      />

      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-lg shadow-xl text-xs font-mono flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Main Summary & Preflight Compliance Header */}
        <ReadinessHeader
          tender={tender}
          validations={validations}
          readiness={readiness}
          lang={lang}
          onGenerate={handleGeneratePackage}
          onAutoMatch={handleAutoMatch}
          onExportCSV={handleExportCSV}
          onSaveWorkspace={handleSaveWorkspace}
          onReviewIssues={() => setActiveTab('validation')}
          isGenerating={isGenerating}
          generationStep={generationStep}
        />

        {/* Tab 1: DOCUMENTS WORKSPACE (Main Working Area: Checklist + Ingestion + Inspector) */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Area (7 cols): Checklist Table + File Uploader */}
            <div className="lg:col-span-7 space-y-6">
              <ChecklistTable
                validations={validations}
                selectedReqId={selectedReqId}
                onSelectReq={(id) => setSelectedReqId(id)}
                lang={lang}
              />

              <FileUploader
                files={uploadedFiles}
                duplicateGroups={duplicateGroups}
                onFilesAdded={handleFilesAdded}
                onFileRemoved={handleFileRemoved}
                lang={lang}
              />
            </div>

            {/* Right Area (5 cols): Selected Document Inspector */}
            <div className="lg:col-span-5">
              <DocumentInspector
                selectedValidation={selectedValidation}
                uploadedFiles={uploadedFiles}
                tender={tender}
                lang={lang}
                onMatchFile={handleMatchFile}
                onUnmatchFile={handleUnmatchFile}
                onSetExpiryDate={handleSetExpiryDate}
              />
            </div>
          </div>
        )}

        {/* Tab 2: COMPLIANCE ISSUE CENTER */}
        {activeTab === 'validation' && (
          <IssueCenter
            validations={validations}
            tender={tender}
            lang={lang}
            onReviewRequirement={handleReviewFromIssue}
          />
        )}

        {/* Tab 3: PACKAGE PREVIEW & COMPILATION MANIFEST */}
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
      </main>

      {/* Package Generation / Download Result Modal */}
      {(isGenerating || generatedResult) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-5 text-slate-200 font-mono">
            {isGenerating ? (
              <div className="text-center py-6 space-y-4">
                <div className="flex justify-center">
                  <LordIcon name="refresh" size={48} trigger="loop" colors="primary:#3b82f6,secondary:#10b981" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                  Compiling Tender Package
                </h3>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>{generationStep || 'Building PDF pages...'}</p>
                  <p className="text-[11px] text-slate-500">Stamping audit footers & compiling table of contents</p>
                </div>
              </div>
            ) : (
              generatedResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm font-bold text-slate-100">Package Ready</h3>
                    </div>
                    <button
                      onClick={() => setGeneratedResult(null)}
                      className="text-slate-400 hover:text-slate-200 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
                    <div className="text-sm font-bold text-blue-400">{generatedResult.filename}</div>
                    <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1 border-t border-slate-900">
                      <div>Total Pages: <span className="text-slate-200 font-semibold">{generatedResult.totalPages}</span></div>
                      <div>Attachments: <span className="text-slate-200 font-semibold">{totalIncludedDocs}</span></div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    The package includes an official English cover page, table of contents index, and persistent audit footers on every page.
                  </p>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      onClick={() => triggerBrowserDownload(generatedResult.blob, generatedResult.filename)}
                      className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>DOWNLOAD AGAIN</span>
                    </button>
                    <button
                      onClick={() => setGeneratedResult(null)}
                      className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Engineering Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-3.5 px-6 text-center text-xs font-mono text-slate-500">
        <p>
          TENDERFORGE &bull; Daffodil International University AI DevFest 2026 &bull; Strict Browser-Only Architecture
        </p>
      </footer>
    </div>
  );
}
