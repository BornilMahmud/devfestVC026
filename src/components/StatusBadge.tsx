import React from 'react';
import { RequirementStatus, Language } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  AlertOctagon,
  MinusCircle,
  Loader2,
} from 'lucide-react';

interface StatusBadgeProps {
  status: RequirementStatus | 'PROCESSING' | 'VERIFIED';
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
      bg: 'bg-[#EDF7F1] text-[#21714C] border-[#B7E2CD]',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#21714C] shrink-0" />,
      label: lang === 'bn' ? '✓ যাচাইকৃত' : '✓ VERIFIED',
    },
    VERIFIED: {
      bg: 'bg-[#EDF7F1] text-[#21714C] border-[#B7E2CD]',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#21714C] shrink-0" />,
      label: lang === 'bn' ? '✓ যাচাইকৃত' : '✓ VERIFIED',
    },
    EXPIRY_NEEDED: {
      bg: 'bg-[#FFF7E6] text-[#926009] border-[#FDE3B2]',
      icon: <Clock className="w-3.5 h-3.5 text-[#926009] shrink-0" />,
      label: lang === 'bn' ? '⚠ মেয়াদ প্রয়োজন' : '⚠ EXPIRY DATE NEEDED',
    },
    EXPIRED: {
      bg: 'bg-[#FEF0F0] text-[#B23A3A] border-[#F9CACA]',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#B23A3A] shrink-0" />,
      label: lang === 'bn' ? '✕ মেয়াদোত্তীর্ণ' : '✕ EXPIRED',
    },
    MISSING: {
      bg: 'bg-[#FEF0F0] text-[#B23A3A] border-[#F9CACA]',
      icon: <AlertOctagon className="w-3.5 h-3.5 text-[#B23A3A] shrink-0" />,
      label: lang === 'bn' ? '! অনুপস্থিত' : '! MISSING',
    },
    NOT_PROVIDED: {
      bg: 'bg-[#F4F6F9] text-[#5C6B7E] border-[#DEE4EC]',
      icon: <MinusCircle className="w-3.5 h-3.5 text-[#5C6B7E] shrink-0" />,
      label: lang === 'bn' ? '○ দেওয়া হয়নি' : '○ NOT PROVIDED',
    },
    PROCESSING: {
      bg: 'bg-[#EDF3FF] text-[#245CC6] border-[#BED2FA]',
      icon: <Loader2 className="w-3.5 h-3.5 text-[#245CC6] animate-spin shrink-0" />,
      label: lang === 'bn' ? '↻ প্রক্রিয়াকরণ' : '↻ PROCESSING',
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-tight border ${config.bg} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
