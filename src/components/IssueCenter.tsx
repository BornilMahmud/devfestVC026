import React from 'react';
import { RequirementValidation, TenderMetadata, Language } from '../types';
import { LordIcon } from './LordIcon';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  FileQuestion,
  Info,
} from 'lucide-react';

interface IssueCenterProps {
  validations: RequirementValidation[];
  tender: TenderMetadata;
  lang: Language;
  onReviewRequirement: (reqId: string) => void;
}

export const IssueCenter: React.FC<IssueCenterProps> = ({
  validations,
  tender,
  lang,
  onReviewRequirement,
}) => {
  const blockingIssues = validations.filter(
    (v) => v.status === 'MISSING' || v.status === 'EXPIRY_NEEDED' || v.status === 'EXPIRED'
  );

  const optionalUnprovided = validations.filter((v) => v.status === 'NOT_PROVIDED');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
            {blockingIssues.length > 0 ? (
              <LordIcon name="warning" size={26} trigger="hover" colors="primary:#ef4444,secondary:#f59e0b" />
            ) : (
              <LordIcon name="check" size={26} trigger="hover" colors="primary:#10b981,secondary:#3b82f6" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 tracking-wide uppercase font-mono">
              Compliance Issue Center & Preflight Auditor
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic verification against Tender Submission Deadline ({tender.submission_deadline})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span
            className={`px-2.5 py-1 rounded-md border font-semibold ${
              blockingIssues.length === 0
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-red-950/60 text-red-300 border-red-500/40'
            }`}
          >
            {blockingIssues.length} Blocking Issue{blockingIssues.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Zero Issues State */}
      {blockingIssues.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center justify-center space-y-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
          <ShieldCheck className="w-12 h-12 text-emerald-400" />
          <h3 className="text-base font-bold text-emerald-300">All Statutory Criteria Verified</h3>
          <p className="text-xs text-slate-400 max-w-md">
            No blocking issues detected. All mandatory tender documents are attached, non-duplicate, and valid through the submission deadline.
          </p>
        </div>
      ) : (
        /* List of Blocking Issues */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <span>BLOCKING ISSUES REQUIRING ATTENTION</span>
            </span>
            <span className="text-slate-500">Package compilation is locked until resolved</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blockingIssues.map((val) => {
              const { requirement, status, expiryDate, message_en, message_bn } = val;
              const displayTitle = lang === 'bn' ? requirement.title_bn : requirement.title_en;
              const isExpired = status === 'EXPIRED';
              const isExpiryNeeded = status === 'EXPIRY_NEEDED';

              // What is wrong, why it matters, what fixes it
              let whatIsWrong = '';
              let whyItMatters = '';
              let whatFixesIt = '';

              if (status === 'MISSING') {
                whatIsWrong = 'Mandatory document has no attached file.';
                whyItMatters = 'Public procurement rules disqualify submissions missing mandatory documents.';
                whatFixesIt = 'Upload and attach the required PDF file.';
              } else if (status === 'EXPIRED') {
                whatIsWrong = `Expired on ${expiryDate}, before the tender deadline (${tender.submission_deadline}).`;
                whyItMatters = 'Procurement evaluation requires all licenses and certificates to be valid at the deadline.';
                whatFixesIt = 'Attach an updated renewal document or verify the entered expiry date.';
              } else if (status === 'EXPIRY_NEEDED') {
                whatIsWrong = 'Statutory expiration date has not been specified.';
                whyItMatters = 'Evaluation committees must verify certificate validity at submission deadline.';
                whatFixesIt = 'Enter the valid expiration date shown on the document.';
              }

              return (
                <div
                  key={requirement.id}
                  className="bg-slate-950 border border-red-900/50 hover:border-red-500/70 transition-all rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-slate-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {requirement.id} &bull; Order #{requirement.order}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                        {status === 'EXPIRED' ? 'EXPIRED' : status === 'EXPIRY_NEEDED' ? 'DATE NEEDED' : 'MISSING'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100 font-sans">
                      {displayTitle}
                    </h4>

                    {/* Breakdown */}
                    <div className="text-xs space-y-1.5 text-slate-300 font-sans">
                      <div>
                        <span className="font-bold text-red-400">Issue: </span>
                        <span>{whatIsWrong}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400">Impact: </span>
                        <span className="text-slate-400">{whyItMatters}</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-400">Remedy: </span>
                        <span className="text-slate-300">{whatFixesIt}</span>
                      </div>
                    </div>

                    {/* Expiry vs Deadline comparison box */}
                    {(isExpired || isExpiryNeeded) && (
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Document Expiry:</span>
                          <span className={isExpired ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
                            {expiryDate || 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Submission Deadline:</span>
                          <span className="text-slate-200 font-bold">{tender.submission_deadline}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Review Button */}
                  <button
                    onClick={() => onReviewRequirement(requirement.id)}
                    className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-700/80 hover:border-blue-500 rounded-lg text-xs font-mono font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <span>REVIEW REQUIREMENT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Non-blocking Warnings */}
      {optionalUnprovided.length > 0 && (
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold uppercase tracking-wider">
              Optional Documents (Omitted from final package):
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {optionalUnprovided.map((v) => (
              <button
                key={v.requirement.id}
                onClick={() => onReviewRequirement(v.requirement.id)}
                className="text-xs font-mono px-3 py-1 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-md transition-colors"
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
