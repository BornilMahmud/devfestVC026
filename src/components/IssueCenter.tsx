import React from 'react';
import { RequirementValidation, TenderMetadata, Language } from '../types';
import { t } from '../utils/translations';
import { LordIcon } from './LordIcon';
import { AlertTriangle, Clock, ArrowRight, ShieldCheck, FileQuestion } from 'lucide-react';

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
  // Filter for items that require immediate administrative attention
  const blockingIssues = validations.filter(
    (v) => v.status === 'MISSING' || v.status === 'EXPIRY_NEEDED' || v.status === 'EXPIRED'
  );

  const optionalUnprovided = validations.filter((v) => v.status === 'NOT_PROVIDED');
  const verifiedCount = validations.filter((v) => v.status === 'OK').length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
            {blockingIssues.length > 0 ? (
              <LordIcon name="warning" size={28} trigger="loop" colors="primary:#f59e0b,secondary:#ef4444" />
            ) : (
              <LordIcon name="check" size={28} trigger="hover" colors="primary:#10b981,secondary:#38bdf8" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 tracking-wide uppercase font-mono">
              Compliance & Issue Center
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic validation of tender requirements against submission deadline: {tender.submission_deadline}
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
          <span className="px-2.5 py-1 rounded-md border bg-slate-800 text-slate-300 border-slate-700">
            {verifiedCount} of {validations.length} Verified
          </span>
        </div>
      </div>

      {/* Zero Issues State */}
      {blockingIssues.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center space-y-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
          <ShieldCheck className="w-12 h-12 text-emerald-400" />
          <h3 className="text-base font-bold text-emerald-300">All Statutory Criteria Verified</h3>
          <p className="text-xs text-slate-400 max-w-md">
            No blocking issues detected. All mandatory tender documents are attached and statutory expiration dates are valid through the submission deadline.
          </p>
        </div>
      ) : (
        /* List of Blocking Issues */
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Items Requiring Immediate Action</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {blockingIssues.map((val) => {
              const { requirement, status, expiryDate, message_en, message_bn } = val;
              const displayTitle = lang === 'bn' ? requirement.title_bn : requirement.title_en;
              const message = lang === 'bn' ? message_bn : message_en;

              const isExpired = status === 'EXPIRED';
              const isExpiryNeeded = status === 'EXPIRY_NEEDED';
              const isMissing = status === 'MISSING';

              return (
                <div
                  key={requirement.id}
                  className="bg-slate-950/80 border border-red-900/40 hover:border-red-500/60 transition-all rounded-lg p-4 flex flex-col justify-between space-y-3 group shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {requirement.id} &bull; Order #{requirement.order}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          isExpired
                            ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                            : isExpiryNeeded
                            ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                            : 'bg-red-950/80 text-red-300 border-red-500/50'
                        }`}
                      >
                        {status === 'EXPIRED'
                          ? 'Expired Document'
                          : status === 'EXPIRY_NEEDED'
                          ? 'Expiry Date Missing'
                          : 'Mandatory File Missing'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {displayTitle}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {message}
                    </p>

                    {/* Expiry vs Deadline Comparison Card */}
                    {(isExpired || isExpiryNeeded) && (
                      <div className="bg-slate-900/90 rounded border border-slate-800 p-2 text-[11px] font-mono grid grid-cols-2 gap-2 text-slate-300">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Document Expiry:</span>
                          <span className={isExpired ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                            {expiryDate || 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Tender Deadline:</span>
                          <span className="text-slate-200">{tender.submission_deadline}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Review Button */}
                  <button
                    onClick={() => onReviewRequirement(requirement.id)}
                    className="w-full mt-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 hover:border-cyan-500/60 rounded text-xs font-mono font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                  >
                    <span>Review Document</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Non-blocking Optional Documents Notice */}
      {optionalUnprovided.length > 0 && (
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-2">
            <FileQuestion className="w-3.5 h-3.5 text-slate-500" />
            <span>Optional Documents Not Provided (Non-Blocking):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {optionalUnprovided.map((v) => (
              <button
                key={v.requirement.id}
                onClick={() => onReviewRequirement(v.requirement.id)}
                className="text-[11px] font-mono px-2.5 py-1 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded transition-colors"
              >
                {v.requirement.id}: {lang === 'bn' ? v.requirement.title_bn : v.requirement.title_en}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
