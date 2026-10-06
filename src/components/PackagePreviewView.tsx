import React from 'react';
import { RequirementValidation, TenderMetadata, ReadinessSummary, Language } from '../types';
import { t } from '../utils/translations';
import { LordIcon } from './LordIcon';
import {
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Building,
  User,
  Hash,
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
  // Ordered documents included in package (Page 1 = Cover, Page 2 = Index, followed by matched docs)
  const includedDocs = validations
    .filter((v) => v.matchedFile)
    .sort((a, b) => a.requirement.order - b.requirement.order);

  // Calculate starting page numbers
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
      {/* Top Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
            <LordIcon name="box" size={30} trigger="hover" colors="primary:#38bdf8,secondary:#10b981" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 tracking-wide uppercase font-mono">
              Compilation Manifest & Package Preview
            </h2>
            <p className="text-xs text-slate-400">
              Audit-grade package structure to be compiled into {tender.tender_id}_Package.pdf
            </p>
          </div>
        </div>

        {/* Big Action Button */}
        <button
          onClick={onGenerate}
          disabled={!readiness.isReady || isGenerating}
          className={`px-5 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-lg ${
            readiness.isReady && !isGenerating
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-cyan-500/25 cursor-pointer active:scale-95'
              : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>{generationStep || 'Compiling...'}</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>{t(lang, 'generatePackage')}</span>
            </span>
          )}
        </button>
      </div>

      {/* Package Specs Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
          <span className="text-[10px] text-slate-500 block uppercase">Total Estimated Pages</span>
          <span className="text-lg font-bold text-cyan-400">{totalPages} Pages</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Cover + Index + {totalPages - 2} doc pages</span>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
          <span className="text-[10px] text-slate-500 block uppercase">Included Attachments</span>
          <span className="text-lg font-bold text-emerald-400">{includedDocs.length} Documents</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{validations.length - includedDocs.length} optional skipped</span>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
          <span className="text-[10px] text-slate-500 block uppercase">Submission Deadline</span>
          <span className="text-sm font-bold text-amber-400 mt-1 block">{tender.submission_deadline}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">All certifications valid</span>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
          <span className="text-[10px] text-slate-500 block uppercase">Package Status</span>
          <span
            className={`text-sm font-bold mt-1 block ${
              readiness.isReady ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {readiness.isReady ? 'PACKAGE READY' : 'PACKAGE LOCKED'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {readiness.blockers.length} active blockers
          </span>
        </div>
      </div>

      {/* Tender Metadata Details */}
      <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-3 text-xs font-mono text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-500 block">Procuring Entity:</span>
            <span className="font-semibold text-slate-200">{tender.procuring_entity}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-500 block">Bidder Name:</span>
            <span className="font-semibold text-slate-200">{tender.bidder}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Hash className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-500 block">Package Output Name:</span>
            <span className="font-semibold text-slate-200">{tender.tender_id}_Package.pdf</span>
          </div>
        </div>
      </div>

      {/* Assembly Order Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-slate-300">
            Physical Document Assembly Order
          </span>
          <span>Footers stamped as &quot;{tender.tender_id} | Page X of {totalPages}&quot;</span>
        </div>

        <div className="border border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400">
                <th className="py-2.5 px-3 w-16 text-center">Section</th>
                <th className="py-2.5 px-3">Title / Document Description</th>
                <th className="py-2.5 px-3">Attached File</th>
                <th className="py-2.5 px-3 text-center">Pages</th>
                <th className="py-2.5 px-3 text-right">Page Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {/* Row 1: Cover Page */}
              <tr className="bg-cyan-950/20">
                <td className="py-2.5 px-3 text-center font-bold text-cyan-400">01</td>
                <td className="py-2.5 px-3 font-semibold text-slate-200">
                  Official Tender Package Cover Page (English)
                </td>
                <td className="py-2.5 px-3 text-slate-400 italic">System Generated</td>
                <td className="py-2.5 px-3 text-center text-slate-300">1</td>
                <td className="py-2.5 px-3 text-right font-bold text-cyan-400">Page 1</td>
              </tr>

              {/* Row 2: Table of Contents Index */}
              <tr className="bg-teal-950/20">
                <td className="py-2.5 px-3 text-center font-bold text-teal-400">02</td>
                <td className="py-2.5 px-3 font-semibold text-slate-200">
                  Table of Contents & Statutory Compliance Index
                </td>
                <td className="py-2.5 px-3 text-slate-400 italic">System Generated</td>
                <td className="py-2.5 px-3 text-center text-slate-300">1</td>
                <td className="py-2.5 px-3 text-right font-bold text-teal-400">Page 2</td>
              </tr>

              {/* Matched Documents */}
              {manifest.map((item, idx) => {
                const docNum = (idx + 3).toString().padStart(2, '0');
                const title = lang === 'bn' ? item.requirement.title_bn : item.requirement.title_en;
                const endPage = item.startPage + item.pageCount - 1;

                return (
                  <tr key={item.requirement.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-400">{docNum}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-200">
                      {item.requirement.id}: {title}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300/90 truncate max-w-[200px]">
                      {item.matchedFile?.name}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-300">{item.pageCount}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300 font-mono">
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
    </div>
  );
};
