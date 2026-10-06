import React from 'react';
import { RequirementStatus, Language } from '../types';
import { t } from '../utils/translations';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  AlertOctagon,
  MinusCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  status: RequirementStatus;
  lang?: Language;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  lang = 'en',
  className = '',
}) => {
  const config = {
    OK: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
      label: 'OK',
    },
    EXPIRY_NEEDED: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
      label: 'EXPIRY DATE NEEDED',
    },
    EXPIRED: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
      label: 'EXPIRED',
    },
    MISSING: {
      bg: 'bg-red-50 text-red-700 border-red-200',
      icon: <AlertOctagon className="w-3.5 h-3.5 text-red-600 shrink-0" />,
      label: 'MISSING',
    },
    NOT_PROVIDED: {
      bg: 'bg-slate-50 text-slate-600 border-slate-200',
      icon: <MinusCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />,
      label: 'NOT PROVIDED',
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.bg} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
