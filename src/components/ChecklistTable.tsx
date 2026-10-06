import React from 'react';
import { RequirementValidation, Language } from '../types';
import { t } from '../utils/translations';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  MinusCircle,
  FileText,
  Calendar,
  ChevronRight,
} from 'lucide-react';

interface ChecklistTableProps {
  validations: RequirementValidation[];
  selectedReqId: string | null;
  onSelectReq: (id: string) => void;
  lang: Language;
}

export const ChecklistTable: React.FC<ChecklistTableProps> = ({
  validations,
  selectedReqId,
  onSelectReq,
  lang,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>{t(lang, 'checklistTitle')}</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-400">
          {validations.filter((v) => v.status === 'OK').length} / {validations.length} Verified
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] text-slate-400">
              <th className="py-2.5 px-3 font-semibold w-12 text-center">#</th>
              <th className="py-2.5 px-3 font-semibold">{t(lang, 'documentName')}</th>
              <th className="py-2.5 px-3 font-semibold">{t(lang, 'matchedFile')}</th>
              <th className="py-2.5 px-3 font-semibold text-center">{t(lang, 'pages')}</th>
              <th className="py-2.5 px-3 font-semibold">{t(lang, 'expiry')}</th>
              <th className="py-2.5 px-3 font-semibold text-center">{t(lang, 'status')}</th>
              <th className="py-2.5 px-3 font-semibold w-12 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {validations.map((val) => {
              const { requirement, status, matchedFile, expiryDate } = val;
              const isSelected = selectedReqId === requirement.id;
              const displayTitle = lang === 'bn' ? requirement.title_bn : requirement.title_en;

              // Row background styling
              let rowBg = 'hover:bg-slate-800/50';
              if (isSelected) {
                rowBg = 'bg-cyan-950/40 border-l-2 border-l-cyan-400';
              } else if (status === 'OK') {
                rowBg = 'hover:bg-emerald-950/20';
              } else if (status === 'MISSING') {
                rowBg = 'hover:bg-red-950/20';
              }

              // Status badge styling
              const statusBadge = {
                OK: {
                  bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
                  icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
                  label: t(lang, 'status_OK'),
                },
                MISSING: {
                  bg: 'bg-red-950/60 text-red-300 border-red-500/40',
                  icon: <AlertTriangle className="w-3 h-3 text-red-400" />,
                  label: t(lang, 'status_MISSING'),
                },
                EXPIRY_NEEDED: {
                  bg: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
                  icon: <Clock className="w-3 h-3 text-amber-400" />,
                  label: t(lang, 'status_EXPIRY_NEEDED'),
                },
                EXPIRED: {
                  bg: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
                  icon: <AlertTriangle className="w-3 h-3 text-rose-400" />,
                  label: t(lang, 'status_EXPIRED'),
                },
                NOT_PROVIDED: {
                  bg: 'bg-slate-800/50 text-slate-400 border-slate-700',
                  icon: <MinusCircle className="w-3 h-3 text-slate-400" />,
                  label: t(lang, 'status_NOT_PROVIDED'),
                },
              }[status];

              return (
                <tr
                  key={requirement.id}
                  onClick={() => onSelectReq(requirement.id)}
                  className={`cursor-pointer transition-colors ${rowBg}`}
                >
                  {/* Order Number */}
                  <td className="py-2.5 px-3 text-center text-slate-400 font-bold">
                    {String(requirement.order).padStart(2, '0')}
                  </td>

                  {/* Document Name */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-200">{displayTitle}</span>
                      <span className="text-[10px] text-slate-500">[{requirement.id}]</span>
                      {requirement.mandatory ? (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold bg-red-950 text-red-400 border border-red-800/50 rounded">
                          REQ
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 text-[9px] font-medium bg-slate-800 text-slate-400 rounded">
                          OPT
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Matched File */}
                  <td className="py-2.5 px-3">
                    {matchedFile ? (
                      <span className="text-cyan-300 font-medium truncate block max-w-[200px]">
                        {matchedFile.name}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">None</span>
                    )}
                  </td>

                  {/* Pages */}
                  <td className="py-2.5 px-3 text-center text-slate-300">
                    {matchedFile ? `${matchedFile.pages}` : '—'}
                  </td>

                  {/* Expiry */}
                  <td className="py-2.5 px-3">
                    {requirement.has_expiry ? (
                      expiryDate ? (
                        <span className="flex items-center space-x-1 text-slate-200">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>{expiryDate}</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 italic">Required</span>
                      )
                    ) : (
                      <span className="text-slate-600">N/A</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge.bg}`}
                    >
                      {statusBadge.icon}
                      <span>{statusBadge.label}</span>
                    </span>
                  </td>

                  {/* Selection indicator */}
                  <td className="py-2.5 px-3 text-center text-slate-400">
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'
                      }`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
