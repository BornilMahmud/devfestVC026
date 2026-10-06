import React from 'react';
import { RequirementValidation, Language } from '../types';
import { t } from '../utils/translations';
import {
  FileText,
  Calendar,
  ChevronRight,
  AlertOctagon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CircleDashed,
  Eye,
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Table Title Bar */}
      <div className="px-5 py-3.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <FileText className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Tender Requirements Checklist
          </h3>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
            {validations.length} Required Items
          </span>
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center space-x-3">
          <span className="text-emerald-400 font-semibold">
            {validations.filter((v) => v.status === 'OK').length} Verified
          </span>
          <span>&bull;</span>
          <span className="text-red-400 font-semibold">
            {validations.filter((v) => v.status === 'MISSING' || v.status === 'EXPIRED' || v.status === 'EXPIRY_NEEDED').length} Issues
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] text-slate-400">
              <th className="py-3 px-3.5 font-semibold w-12 text-center">#</th>
              <th className="py-3 px-3.5 font-semibold">Requirement</th>
              <th className="py-3 px-3.5 font-semibold">Matched File</th>
              <th className="py-3 px-3.5 font-semibold text-center w-16">Pages</th>
              <th className="py-3 px-3.5 font-semibold w-32">Expiry Date</th>
              <th className="py-3 px-3.5 font-semibold text-center w-44">Status</th>
              <th className="py-3 px-3.5 font-semibold w-20 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {validations.map((val) => {
              const { requirement, status, matchedFile, expiryDate } = val;
              const isSelected = selectedReqId === requirement.id;
              const displayTitle = lang === 'bn' ? requirement.title_bn : requirement.title_en;

              // Row background styling: clean enterprise hover & select
              let rowStyle = 'hover:bg-slate-800/40 cursor-pointer transition-colors';
              if (isSelected) {
                rowStyle = 'bg-blue-950/30 border-l-4 border-l-blue-500 font-medium';
              }

              // Status configuration strictly matching prompt
              const statusConfig = {
                OK: {
                  badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
                  icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
                  label: '✓ OK',
                },
                EXPIRY_NEEDED: {
                  badge: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
                  icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
                  label: '⚠ EXPIRY NEEDED',
                },
                EXPIRED: {
                  badge: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
                  icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
                  label: '✕ EXPIRED',
                },
                MISSING: {
                  badge: 'bg-red-950/60 text-red-300 border-red-500/40',
                  icon: <AlertOctagon className="w-3.5 h-3.5 text-red-400" />,
                  label: '! MISSING',
                },
                NOT_PROVIDED: {
                  badge: 'bg-slate-800/60 text-slate-400 border-slate-700',
                  icon: <CircleDashed className="w-3.5 h-3.5 text-slate-500" />,
                  label: '○ NOT PROVIDED',
                },
              }[status];

              return (
                <tr
                  key={requirement.id}
                  onClick={() => onSelectReq(requirement.id)}
                  className={rowStyle}
                >
                  {/* Order Number */}
                  <td className="py-3 px-3.5 text-center text-slate-400 font-bold">
                    {requirement.order.toString().padStart(2, '0')}
                  </td>

                  {/* Requirement Title */}
                  <td className="py-3 px-3.5 text-slate-200">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-300">{requirement.id}</span>
                      <span>&bull;</span>
                      <span className="text-slate-100">{displayTitle}</span>
                      {requirement.mandatory ? (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-red-950/80 text-red-400 border border-red-800/60">
                          Mandatory
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-slate-800 text-slate-400 border border-slate-700">
                          Optional
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Matched File */}
                  <td className="py-3 px-3.5">
                    {matchedFile ? (
                      <span className="text-blue-300 truncate max-w-[200px] block" title={matchedFile.name}>
                        {matchedFile.name}
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">No document attached</span>
                    )}
                  </td>

                  {/* Pages */}
                  <td className="py-3 px-3.5 text-center text-slate-300">
                    {matchedFile ? matchedFile.pages : '-'}
                  </td>

                  {/* Expiry Date */}
                  <td className="py-3 px-3.5">
                    {requirement.has_expiry ? (
                      expiryDate ? (
                        <span
                          className={`flex items-center space-x-1 ${
                            status === 'EXPIRED' ? 'text-rose-400 font-bold' : 'text-slate-300'
                          }`}
                        >
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{expiryDate}</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 font-semibold text-[11px]">Date Required</span>
                      )
                    ) : (
                      <span className="text-slate-600">N/A</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3.5 text-center">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-[11px] font-bold border ${statusConfig.badge}`}
                    >
                      {statusConfig.icon}
                      <span>{statusConfig.label}</span>
                    </span>
                  </td>

                  {/* Action Link */}
                  <td className="py-3 px-3.5 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectReq(requirement.id);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center justify-center space-x-1 transition-colors mx-auto"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
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
