import React from 'react';
import { RequirementValidation, TenderMetadata, ReadinessSummary, Language } from '../types';
import {
  Download,
  Building,
  User,
  Hash,
  Calendar,
  Layers,
  FileCheck,
  CheckCircle2,
  FileText,
  AlertOctagon,
  ShieldCheck,
} from 'lucide-react';

interface PackagePreviewViewProps {
  tender: TenderMetadata;
  validations: RequirementValidation[];
  readiness: ReadinessSummary;
  lang: Language;
  onGenerate: () => void;
  isGenerating: boolean;
  generationStep: string;
}

export const PackagePreviewView: React.FC<PackagePreviewViewProps> = ({
  tender,
  validations,
  readiness,
  lang,
  onGenerate,
  isGenerating,
  generationStep,
}) => {
  const includedDocs = validations
    .filter((v) => v.matchedFile)
    .sort((a, b) => a.requirement.order - b.requirement.order);

  const omittedDocs = validations
    .filter((v) => !v.matchedFile)
    .sort((a, b) => a.requirement.order - b.requirement.order);

  let currentPage = 3; // Page 1 = Cover, Page 2 = Index
  const manifest = includedDocs.map((doc) => {
    const startPage = currentPage;
    const pageCount = doc.matchedFile?.pages || 0;
    currentPage += pageCount;
    return {
      ...doc,
      startPage,
      pageCount,
    };
  });

  const totalPages = currentPage - 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Package Preview & Compilation Review</h2>
          <p className="text-xs text-slate-500">
            Final document sequence and page numbers before generating {tender.tender_id}_Package.pdf.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onGenerate}
          disabled={!readiness.isReady || isGenerating}
          className={`px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm ${
            readiness.isReady && !isGenerating
              ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>{isGenerating ? generationStep || 'COMPILING PACKAGE...' : 'GENERATE PACKAGE'}</span>
        </button>
      </div>

      {/* Package Specs Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">Total Compiled Pages</span>
          <span className="text-2xl font-bold text-blue-700 mt-0.5 block">{totalPages}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Cover + Index + {totalPages - 2} doc pages</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">Included Documents</span>
          <span className="text-2xl font-bold text-emerald-600 mt-0.5 block">{includedDocs.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">{omittedDocs.length} optional omitted</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">Submission Deadline</span>
          <span className="text-sm font-bold text-amber-600 mt-2 block">{tender.submission_deadline}</span>
          <span className="text-[11px] text-slate-500 block mt-1">All dates verified</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">Package State</span>
          <span
            className={`text-sm font-bold mt-2 block ${
              readiness.isReady ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {readiness.isReady ? 'PACKAGE READY' : 'PACKAGE LOCKED'}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            {readiness.blockers.length === 0 ? '0 issues remaining' : `${readiness.blockers.length} blockers`}
          </span>
        </div>
      </div>

      {/* Tender Metadata Details Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <Building className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Procuring Entity</span>
            <span className="font-semibold text-slate-800">{tender.procuring_entity}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2.5">
          <User className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Bidder Name</span>
            <span className="font-semibold text-slate-800">{tender.bidder}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2.5">
          <Hash className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Output Filename</span>
            <span className="font-semibold text-blue-700">{tender.tender_id}_Package.pdf</span>
          </div>
        </div>
      </div>

      {/* Ordered Contents List Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold uppercase tracking-wider text-slate-800">
            Document Compilation Sequence
          </span>
          <span>Every page stamped with &quot;{tender.tender_id} | Page X of {totalPages}&quot;</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <th className="py-2.5 px-4 w-16 text-center">Section</th>
                <th className="py-2.5 px-4">Document Title</th>
                <th className="py-2.5 px-4">Attached Source File</th>
                <th className="py-2.5 px-4 text-center w-20">Pages</th>
                <th className="py-2.5 px-4 text-right w-36">Compiled Pages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Row 1: Cover Page */}
              <tr className="bg-blue-50/40">
                <td className="py-2.5 px-4 text-center font-bold text-blue-700">01</td>
                <td className="py-2.5 px-4 font-semibold text-slate-900">
                  Official Tender Package Cover Page (English)
                </td>
                <td className="py-2.5 px-4 text-slate-500 italic">System Generated</td>
                <td className="py-2.5 px-4 text-center text-slate-600">1</td>
                <td className="py-2.5 px-4 text-right font-bold text-blue-700">Page 1</td>
              </tr>

              {/* Row 2: Table of Contents Index */}
              <tr className="bg-slate-50/60">
                <td className="py-2.5 px-4 text-center font-bold text-slate-700">02</td>
                <td className="py-2.5 px-4 font-semibold text-slate-900">
                  Table of Contents & Statutory Compliance Index
                </td>
                <td className="py-2.5 px-4 text-slate-500 italic">System Generated</td>
                <td className="py-2.5 px-4 text-center text-slate-600">1</td>
                <td className="py-2.5 px-4 text-right font-bold text-slate-700">Page 2</td>
              </tr>

              {/* Matched Documents */}
              {manifest.map((item, idx) => {
                const docNum = (idx + 3).toString().padStart(2, '0');
                const title = lang === 'bn' ? item.requirement.title_bn : item.requirement.title_en;
                const endPage = item.startPage + item.pageCount - 1;

                return (
                  <tr key={item.requirement.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 text-center font-bold text-slate-400">{docNum}</td>
                    <td className="py-2.5 px-4 font-medium text-slate-800">
                      {item.requirement.id}: {title}
                    </td>
                    <td className="py-2.5 px-4 text-blue-700 font-medium truncate max-w-[220px]">
                      {item.matchedFile?.name}
                    </td>
                    <td className="py-2.5 px-4 text-center text-slate-600">{item.pageCount}</td>
                    <td className="py-2.5 px-4 text-right text-slate-700 font-mono text-[11px]">
                      {item.pageCount === 1
                        ? `Page ${item.startPage}`
                        : `Pages ${item.startPage} – ${endPage}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Omitted Optional Documents Notice */}
      {omittedDocs.length > 0 && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1.5 shadow-2xs">
          <span className="font-semibold block text-slate-700">Optional Documents Omitted from Package:</span>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {omittedDocs.map((doc) => (
              <span key={doc.requirement.id} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600">
                {doc.requirement.id}: {lang === 'bn' ? doc.requirement.title_bn : doc.requirement.title_en}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
