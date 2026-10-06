import React from 'react';
import {
  TenderMetadata,
  RequirementValidation,
  ReadinessSummary,
  Language,
} from '../types';
import { StatusBadge } from './StatusBadge';
import {
  Building,
  User,
  Calendar,
  Layers,
  Download,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  FileText,
  Wand2,
  FileSpreadsheet,
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
  const { percentage, isReady, blockers, mandatoryCount, readyCount } = readiness;

  const totalIncludedDocs = validations.filter((v) => v.matchedFile).length;
  const totalPages = 2 + validations.reduce((sum, v) => sum + (v.matchedFile?.pages || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Overview</h2>
          <p className="text-xs text-slate-500">
            Real-time compliance monitoring and tender document package status.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onAutoMatch}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1.5 shadow-2xs transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Smart Match</span>
          </button>
          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1.5 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tender Information Banner Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Tender ID</span>
          <span className="font-bold text-blue-700 text-sm mt-0.5 block">{tender.tender_id}</span>
          <span className="text-slate-600 font-medium truncate block max-w-[200px]" title={tender.title}>
            {tender.title}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Procuring Entity</span>
          <div className="flex items-center space-x-1.5 mt-1 text-slate-700">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold truncate">{tender.procuring_entity}</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Bidder Name</span>
          <div className="flex items-center space-x-1.5 mt-1 text-slate-700">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold truncate">{tender.bidder}</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Submission Deadline</span>
          <div className="flex items-center space-x-1.5 mt-1 text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-amber-600">{tender.submission_deadline}</span>
          </div>
        </div>
      </div>

      {/* Compact KPI / Status Panels (Matching Reference Image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Submission Readiness */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Submission Readiness</span>
            <span className={`text-base font-bold ${isReady ? 'text-emerald-600' : 'text-blue-600'}`}>
              {percentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3 mb-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isReady ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400">
            {isReady ? 'Ready for package generation' : `${blockers.length} active blockers`}
          </span>
        </div>

        {/* KPI 2: Required Verified */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-500">Required Documents</div>
          <div className="my-2">
            <span className="text-2xl font-bold text-slate-900">{readyCount}</span>
            <span className="text-xs text-slate-400 font-medium"> / {mandatoryCount} Verified</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {mandatoryCount - readyCount === 0 ? '✓ Complete' : `${mandatoryCount - readyCount} missing`}
          </span>
        </div>

        {/* KPI 3: Blocking Issues */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-500">Blocking Issues</div>
          <div className="my-2">
            <span
              className={`text-2xl font-bold ${
                blockers.length === 0 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {blockers.length}
            </span>
            <span className="text-xs text-slate-400 font-medium"> Blockers</span>
          </div>
          {blockers.length > 0 ? (
            <button
              onClick={onReviewIssues}
              className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center space-x-1"
            >
              <span>Review Issues</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <span className="text-[11px] text-emerald-600 font-semibold">✓ No issues</span>
          )}
        </div>

        {/* KPI 4: Total Pages & Action */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-500">Total Compiled Pages</div>
          <div className="my-2">
            <span className="text-2xl font-bold text-slate-900">{totalPages}</span>
            <span className="text-xs text-slate-400 font-medium"> Pages</span>
          </div>
          {isReady ? (
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Compiling...' : 'Generate Package'}</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">Package Locked</span>
          )}
        </div>
      </div>

      {/* Requirements Checklist Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Requirements Checklist
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {validations.length} Items Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <th className="py-2.5 px-4 w-12 text-center">#</th>
                <th className="py-2.5 px-4">Requirement</th>
                <th className="py-2.5 px-4">Attached File</th>
                <th className="py-2.5 px-4 text-center w-16">Pages</th>
                <th className="py-2.5 px-4 w-28">Expiry</th>
                <th className="py-2.5 px-4 text-center w-40">Status</th>
                <th className="py-2.5 px-4 text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {validations.map((val) => {
                const { requirement, status, matchedFile, expiryDate } = val;
                const displayTitle = lang === 'bn' ? requirement.title_bn : requirement.title_en;

                return (
                  <tr
                    key={requirement.id}
                    onClick={() => onSelectRequirement(requirement.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-center font-bold text-slate-400">
                      {requirement.order.toString().padStart(2, '0')}
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900">{requirement.id}</span>
                        <span>&bull;</span>
                        <span>{displayTitle}</span>
                        {requirement.mandatory ? (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-red-50 text-red-600 border border-red-200">
                            Mandatory
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 text-[9px] font-medium rounded bg-slate-100 text-slate-500">
                            Optional
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {matchedFile ? (
                        <span className="text-blue-600 font-medium truncate max-w-[200px] block" title={matchedFile.name}>
                          {matchedFile.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {matchedFile ? matchedFile.pages : '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {requirement.has_expiry ? (
                        expiryDate || <span className="text-amber-600 font-semibold">Needed</span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={status} lang={lang} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRequirement(requirement.id);
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Inspect
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
