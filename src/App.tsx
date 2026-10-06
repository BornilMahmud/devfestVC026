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
import { PackageScene3D } from './components/PackageScene3D';
import { ReadinessHeader } from './components/ReadinessHeader';
import { ChecklistTable } from './components/ChecklistTable';
import { DocumentInspector } from './components/DocumentInspector';
import { FileUploader } from './components/FileUploader';
import { IssueCenter } from './components/IssueCenter';
import { PackagePreviewView } from './components/PackagePreviewView';
import { LordIcon } from './components/LordIcon';
import {
  AlertTriangle,
  FileText,
  Calendar,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [tender, setTender] = useState<TenderMetadata>(sampleRequirements.tender);
  const [requirements, setRequirements] = useState<DocumentRequirement[]>(sampleRequirements.requirements);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [matches, setMatches] = useState<DocumentMatch[]>([]);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);

  // PDF Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
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

  // Handler: Final Package Generation (Subtle, dignified, zero confetti)
  const handleGeneratePackage = async () => {
    if (!readiness.isReady) {
      setNotification('Cannot generate package: Blocking issues exist.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep('Starting document compilation...');

    try {
      const result = await generateTenderPackagePDF(
        tender,
        validations,
        true, // include index page bonus
        (prog) => setGenerationStep(prog.step)
      );

      triggerBrowserDownload(result.blob, result.filename);
      setNotification(`Tender Package created successfully (${result.totalPages} pages).`);
    } catch (err: any) {
      console.error(err);
      setNotification(`Failed to generate package: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Jump from Issue Center directly to inspector in documents tab
  const handleReviewFromIssue = (reqId: string) => {
    setSelectedReqId(reqId);
    setActiveTab('documents');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Hidden file input for custom JSON */}
      <input
        ref={jsonInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleLoadCustomJSON}
        className="hidden"
      />

      {/* Top Navigation with Primary View Tabs */}
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

      {/* Toast Notification Banner (Dignified enterprise badge, no bounce) */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-lg shadow-2xl text-xs font-mono flex items-center space-x-2 transition-opacity">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Readiness Meter & Action Command Center */}
        <ReadinessHeader
          readiness={readiness}
          lang={lang}
          onGenerate={handleGeneratePackage}
          onAutoMatch={handleAutoMatch}
          onExportCSV={handleExportCSV}
          onSaveWorkspace={handleSaveWorkspace}
          isGenerating={isGenerating}
          generationStep={generationStep}
        />

        {/* Tab 1: OVERVIEW (3D Digital Twin Centerpiece & High-level Status) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 3D Package Assembly Workspace */}
            <section aria-label="3D Package Assembly">
              <PackageScene3D
                validations={validations}
                selectedReqId={selectedReqId}
                onSelectReq={(id) => setSelectedReqId(id)}
                lang={lang}
                isReady={readiness.isReady}
              />
            </section>

            {/* Procurement Status Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>DOCUMENT INVENTORY</span>
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-100">
                  {validations.filter((v) => v.matchedFile).length} / {validations.length}
                </div>
                <p className="text-xs text-slate-400">
                  {readiness.readyCount} of {readiness.mandatoryCount} mandatory documents attached.
                </p>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="mt-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <span>Open Documents Checklist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>STATUTORY VALIDATION</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono">
                  {readiness.blockers.length === 0 ? (
                    <span className="text-emerald-400">0 Blockers</span>
                  ) : (
                    <span className="text-amber-400">{readiness.blockers.length} Blockers</span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {readiness.isReady
                    ? 'All requirements satisfied through deadline.'
                    : 'Action required before package can be generated.'}
                </p>
                <button
                  onClick={() => setActiveTab('validation')}
                  className="mt-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <span>Open Issue Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>PACKAGE COMPILATION</span>
                  <Building2 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-100">
                  {tender.tender_id}
                </div>
                <p className="text-xs text-slate-400">
                  Submission Deadline: <span className="text-amber-400 font-semibold">{tender.submission_deadline}</span>
                </p>
                <button
                  onClick={() => setActiveTab('package')}
                  className="mt-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <span>Inspect Manifest & Preview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: DOCUMENTS (Checklist Table + File Uploader + Document Inspector) */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (7 cols): Checklist Table + File Uploader */}
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

            {/* Right Column (5 cols): Selected Document Inspector & Live Preview */}
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

        {/* Tab 3: VALIDATION (Compliance Issue Center) */}
        {activeTab === 'validation' && (
          <IssueCenter
            validations={validations}
            tender={tender}
            lang={lang}
            onReviewRequirement={handleReviewFromIssue}
          />
        )}

        {/* Tab 4: PACKAGE PREVIEW (Final Manifest & Generator) */}
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

      {/* Engineering Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs font-mono text-slate-500">
        <p>
          TENDERFORGE &bull; Daffodil International University AI DevFest 2026 &bull; Strict Browser-Only Architecture
        </p>
      </footer>
    </div>
  );
}
