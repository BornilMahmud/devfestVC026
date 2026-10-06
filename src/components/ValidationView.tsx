import React from 'react';
import { RequirementValidation, TenderMetadata, Language } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  FileQuestion,
  Info,
} from 'lucide-react';

interface ValidationViewProps {
  validations: RequirementValidation[];
  tender: TenderMetadata;
  onReviewRequirement: (reqId: string) => void;
  lang: Language;
}

export const ValidationView: React.FC<ValidationViewProps> = ({
  validations,
  tender,
  onReviewRequirement,
  lang,
}) => {
  const blockingIssues = validations.filter(
    (v) => v.status === 'MISSING' || v.status === 'EXPIRY_NEEDED' || v.status === 'EXPIRED'
  );

  const optionalUnprovided = validations.filter((v) => v.status === 'NOT_PROVIDED');
  const verifiedCount = validations.filter((v) => v.status === 'OK').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Validation & Compliance Auditor</h2>
          <p className="text-xs text-slate-500">
            Deterministic preflight verification against Submission Deadline ({tender.submission_deadline}).
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span
            className={`px-3 py-1 rounded-full font-bold border ${
              blockingIssues.length === 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {blockingIssues.length} Blocking Issue{blockingIssues.length === 1 ? '' : 's'}
          </span>
          <span className="px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            {verifiedCount} of {validations.length} Verified
          </span>
        </div>
      </div>

      {/* Zero Issues Verified State */}
      {blockingIssues.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center space-y-3 bg-white border border-emerald-200 rounded-xl shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">All Statutory Criteria Verified</h3>
          <p className="text-xs text-slate-500 max-w-md">
            No blocking issues detected. All mandatory tender documents are attached, non-duplicate, and valid through the submission deadline.
          </p>
        </div>
      ) : (
        /* List of Blocking Issues */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-red-700 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <span>BLOCKING ISSUES REQUIRING ATTENTION</span>
            </span>
            <span className="text-slate-400">Package compilation is locked until resolved</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blockingIssues.map((val) => {
              const { requirement, status, expiryDate } = val;
              const displayTitle = lang === 'bn' ? requirement.title_bn : requirement.title_en;
              const isExpired = status === 'EXPIRED';
              const isExpiryNeeded = status === 'EXPIRY_NEEDED';

              let whatIsWrong = '';
              let whyItMatters = '';
              let whatFixesIt = '';

              if (status === 'MISSING') {
                whatIsWrong = 'Mandatory document has no attached file.';
                whyItMatters = 'Public procurement rules disqualify submissions missing mandatory documents.';
                whatFixesIt = 'Upload and attach the required PDF file.';
              } else if (status === 'EXPIRED') {
                whatIsWrong = `Expired on ${expiryDate}, before the tender deadline (${tender.submission_deadline}).`;
                whyItMatters = 'Procurement evaluation requires all licenses and certificates to be valid at deadline.';
                whatFixesIt = 'Attach an updated renewal document or verify the entered expiry date.';
              } else if (status === 'EXPIRY_NEEDED') {
                whatIsWrong = 'Statutory expiration date has not been specified.';
                whyItMatters = 'Evaluation committees must verify certificate validity at submission deadline.';
                whatFixesIt = 'Enter the valid expiration date shown on the document.';
              }

              return (
                <div
                  key={requirement.id}
                  className="bg-white border border-red-200 hover:border-red-400 transition-all rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-2xs"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {requirement.id}
                        </span>
                        <span className="text-slate-400">Order #{requirement.order}</span>
                      </div>
                      <StatusBadge status={status} lang={lang} />
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {displayTitle}
                    </h4>

                    {/* Breakdown */}
                    <div className="text-xs space-y-1.5 text-slate-600 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="font-bold text-red-700">Issue: </span>
                        <span>{whatIsWrong}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">Impact: </span>
                        <span>{whyItMatters}</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-700">Remedy: </span>
                        <span>{whatFixesIt}</span>
                      </div>
                    </div>

                    {/* Expiry vs Deadline Comparison Box */}
                    {(isExpired || isExpiryNeeded) && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Document Expiry</span>
                          <span className={isExpired ? 'text-rose-600 font-bold' : 'text-amber-600 font-bold'}>
                            {expiryDate || 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Submission Deadline</span>
                          <span className="text-slate-800 font-bold">{tender.submission_deadline}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Review Button */}
                  <button
                    onClick={() => onReviewRequirement(requirement.id)}
                    className="w-full py-2 px-3 bg-white hover:bg-blue-50 text-blue-700 border border-slate-300 hover:border-blue-400 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
                  >
                    <span>REVIEW DOCUMENT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional Unprovided Documents */}
      {optionalUnprovided.length > 0 && (
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold uppercase tracking-wider">
              Optional Documents (Omitted from package &bull; Non-Blocking):
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {optionalUnprovided.map((v) => (
              <button
                key={v.requirement.id}
                onClick={() => onReviewRequirement(v.requirement.id)}
                className="text-xs px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors shadow-2xs"
              >
                {v.requirement.id}: {lang === 'bn' ? v.requirement.title_bn : v.requirement.title_en} (Review)
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
