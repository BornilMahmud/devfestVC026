import React from 'react';
import { LucideIcon } from 'lucide-react';

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

interface LordIconProps {
  name: LordIconName;
  size?: number;
  trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'boomerang' | 'in';
  colors?: string; // e.g. "primary:#10b981,secondary:#06b6d4"
  className?: string;
  fallback?: LucideIcon;
}

export const LordIcon: React.FC<LordIconProps> = ({
  name,
  size = 24,
  trigger = 'hover',
  colors = 'primary:#38bdf8,secondary:#94a3b8',
  className = '',
  fallback: FallbackIcon,
}) => {
  const iconSrc = ICON_URLS[name];

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
      />
    </div>
  );
};
