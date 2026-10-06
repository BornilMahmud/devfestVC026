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
import { t } from '../utils/translations';

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
    <div className="space-y-6 animate-tf-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-tf-fade-up">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t(lang, 'validationAuditor')}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'bn'
              ? `জমাদানের সময়সীমার (${tender.submission_deadline}) বিপরীতে স্বয়ংক্রিয় প্রাক-যাচাই।`
              : `Deterministic preflight verification against Submission Deadline (${tender.submission_deadline}).`}
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
            {lang === 'bn'
              ? `${blockingIssues.length}টি বাধা সমস্যা`
              : `${blockingIssues.length} Blocking Issue${blockingIssues.length === 1 ? '' : 's'}`}
          </span>
          <span className="px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            {lang === 'bn'
              ? `${verifiedCount} / ${validations.length}টি যাচাইকৃত`
              : `${verifiedCount} of ${validations.length} Verified`}
          </span>
        </div>
      </div>

      {/* Zero Issues Verified State */}
      {blockingIssues.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center space-y-3 bg-white border border-emerald-200 rounded-xl shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {lang === 'bn' ? 'সকল সংবিধিবদ্ধ মানদণ্ড যাচাই সম্পন্ন' : 'All Statutory Criteria Verified'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md">
            {lang === 'bn'
              ? 'কোন বাধা শনাক্ত হয়নি। সকল বাধ্যতামূলক নথি সংযুক্ত, অননুরূপ এবং জমাদানের সময়সীমা পর্যন্ত বৈধ।'
              : 'No blocking issues detected. All mandatory tender documents are attached, non-duplicate, and valid through the submission deadline.'}
          </p>
        </div>
      ) : (
        /* List of Blocking Issues */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-red-700 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <span>
                {lang === 'bn' ? 'সমাধানযোগ্য বাধাসমূহ' : 'BLOCKING ISSUES REQUIRING ATTENTION'}
              </span>
            </span>
            <span className="text-slate-400">
              {lang === 'bn' ? 'সমাধান না হওয়া পর্যন্ত প্যাকেজ সংকলন লক থাকবে' : 'Package compilation is locked until resolved'}
            </span>
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
                whatIsWrong = lang === 'bn' ? 'বাধ্যতামূলক নথির সাথে কোন ফাইল সংযুক্ত নেই।' : 'Mandatory document has no attached file.';
                whyItMatters = lang === 'bn' ? 'বাধ্যতামূলক নথি ব্যতীত দরপত্র অযোগ্য হিসেবে গণ্য হবে।' : 'Public procurement rules disqualify submissions missing mandatory documents.';
                whatFixesIt = lang === 'bn' ? 'প্রয়োজনীয় পিডিএফ ফাইলটি আপলোড ও সংযুক্ত করুন।' : 'Upload and attach the required PDF file.';
              } else if (status === 'EXPIRED') {
                whatIsWrong = lang === 'bn' ? `জমাদানের শেষ সময় (${tender.submission_deadline}) এর পূর্বে ${expiryDate} তারিখে মেয়াদ শেষ।` : `Expired on ${expiryDate}, before the tender deadline (${tender.submission_deadline}).`;
                whyItMatters = lang === 'bn' ? 'মূল্যায়ন কমিটি জমাদানের সময় সকল সনদ বৈধ থাকা বাধ্যতামূলক করে।' : 'Procurement evaluation requires all licenses and certificates to be valid at deadline.';
                whatFixesIt = lang === 'bn' ? 'নবায়নকৃত বৈধ সনদ সংযুক্ত করুন বা সঠিক মেয়াদ লিখুন।' : 'Attach an updated renewal document or verify the entered expiry date.';
              } else if (status === 'EXPIRY_NEEDED') {
                whatIsWrong = lang === 'bn' ? 'আইনগত মেয়াদ উত্তীর্ণের তারিখ উল্লেখ করা হয়নি।' : 'Statutory expiration date has not been specified.';
                whyItMatters = lang === 'bn' ? 'মূল্যায়ন কমিটিকে অবশ্যই নথির বৈধতা যাচাই করতে হবে।' : 'Evaluation committees must verify certificate validity at submission deadline.';
                whatFixesIt = lang === 'bn' ? 'নথিতে উল্লিখিত মেয়াদ উত্তীর্ণের তারিখটি প্রদান করুন।' : 'Enter the valid expiration date shown on the document.';
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
                        <span className="text-slate-400">
                          {lang === 'bn' ? `ক্রম #${requirement.order}` : `Order #${requirement.order}`}
                        </span>
                      </div>
                      <StatusBadge status={status} lang={lang} />
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {displayTitle}
                    </h4>

                    {/* Breakdown */}
                    <div className="text-xs space-y-1.5 text-slate-600 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="font-bold text-red-700">{t(lang, 'issueLabel')} </span>
                        <span>{whatIsWrong}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">{t(lang, 'impactLabel')} </span>
                        <span>{whyItMatters}</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-700">{t(lang, 'remedyLabel')} </span>
                        <span>{whatFixesIt}</span>
                      </div>
                    </div>

                    {/* Expiry vs Deadline Comparison Box */}
                    {(isExpired || isExpiryNeeded) && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">
                            {t(lang, 'docExpiry')}
                          </span>
                          <span className={isExpired ? 'text-rose-600 font-bold' : 'text-amber-600 font-bold'}>
                            {expiryDate || (lang === 'bn' ? 'উল্লেখ নেই' : 'Not specified')}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">
                            {t(lang, 'submissionDeadline')}
                          </span>
                          <span className="text-slate-800 font-bold">{tender.submission_deadline}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Review Button */}
                  <button
                    onClick={() => onReviewRequirement(requirement.id)}
                    className="btn-tf-secondary btn-hover-icon w-full !text-[#245CC6] hover:!bg-[#EDF3FF] hover:!border-[#BED2FA]"
                  >
                    <span>{t(lang, 'reviewDocumentBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5 btn-icon-right" />
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
          <span className="text-xs font-semibold text-slate-600 block">
            {t(lang, 'omittedDocsNote')}
          </span>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {optionalUnprovided.map((doc) => (
              <span
                key={doc.requirement.id}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-600"
              >
                {doc.requirement.id}: {lang === 'bn' ? doc.requirement.title_bn : doc.requirement.title_en}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
