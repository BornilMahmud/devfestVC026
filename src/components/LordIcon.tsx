import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Calendar,
  Upload,
  Download,
  Package,
  RefreshCw,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';

// Custom element declaration for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'boomerang' | 'in';
          colors?: string;
          delay?: string | number;
          stroke?: string | number;
          state?: string;
        },
        HTMLElement
      >;
    }
  }
}

export type LordIconName =
  | 'document'
  | 'check'
  | 'warning'
  | 'lock'
  | 'calendar'
  | 'upload'
  | 'download'
  | 'box'
  | 'refresh'
  | 'shield';

const ICON_URLS: Record<LordIconName, string> = {
  document: 'https://cdn.lordicon.com/qhgmphtg.json', // document
  check: 'https://cdn.lordicon.com/lupuorrc.json',    // checkmark
  warning: 'https://cdn.lordicon.com/alnsmmzz.json',  // warning sign
  lock: 'https://cdn.lordicon.com/slmechys.json',     // padlock
  calendar: 'https://cdn.lordicon.com/kthelypq.json', // calendar
  upload: 'https://cdn.lordicon.com/xfzfxsqc.json',   // upload
  download: 'https://cdn.lordicon.com/wzwygmng.json', // download
  box: 'https://cdn.lordicon.com/fihkmkwt.json',      // 3D package/box
  refresh: 'https://cdn.lordicon.com/nxaaqchu.json',  // refresh
  shield: 'https://cdn.lordicon.com/gqdnbnwt.json',   // verified shield
};

const LUCIDE_FALLBACKS: Record<LordIconName, LucideIcon> = {
  document: FileText,
  check: CheckCircle2,
  warning: AlertTriangle,
  lock: Lock,
  calendar: Calendar,
  upload: Upload,
  download: Download,
  box: Package,
  refresh: RefreshCw,
  shield: ShieldCheck,
};

interface LordIconProps {
  name: LordIconName;
  size?: number;
  trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'boomerang' | 'in';
  colors?: string; // e.g. "primary:#245CC6,secondary:#5C6B7E" or "primary:#ffffff"
  className?: string;
  fallback?: LucideIcon;
}

export const LordIcon: React.FC<LordIconProps> = ({
  name,
  size = 20,
  trigger = 'hover',
  colors = 'primary:#245cc6,secondary:#5c6b7e',
  className = '',
  fallback: CustomFallback,
}) => {
  const [loadError, setLoadError] = useState(false);
  const iconSrc = ICON_URLS[name];
  const FallbackComponent = CustomFallback || LUCIDE_FALLBACKS[name] || FileText;

  // Check if Lordicon web component script is loaded
  const isCustomElementDefined =
    typeof window !== 'undefined' && !!window.customElements?.get('lord-icon');

  if (loadError || !isCustomElementDefined) {
    return (
      <span
        className={`inline-flex items-center justify-center select-none flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <FallbackComponent style={{ width: size * 0.9, height: size * 0.9 }} />
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center select-none flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <lord-icon
        src={iconSrc}
        trigger={trigger}
        colors={colors}
        style={{ width: `${size}px`, height: `${size}px` }}
        onError={() => setLoadError(true)}
      />
    </div>
  );
};
