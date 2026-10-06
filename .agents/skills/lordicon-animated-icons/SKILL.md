---
name: lordicon-animated-icons
description: Production patterns for integrating Lordicon animated Lottie icons in React, Vite, Tailwind, and Three.js HUD interfaces. Includes Player wrappers, custom element definitions, interaction triggers, and contest-compliant credential handling.
---

# Lordicon Animated Icons Integration Guide

This skill provides verified patterns for embedding Lordicon animated icons into modern React + Vite applications, interactive HUDs, and 3D UI overlays.

---

## 1. Installation & Setup Options

### Option A: React Component (`@lordicon/react` + `lottie-web`)
Recommended when bundling offline JSON icon definitions for guaranteed reliability and zero network latency.

```bash
npm install @lordicon/react lottie-web
```

#### Reusable React Player Component
```tsx
import React, { useRef, useEffect } from 'react';
import { Player } from '@lordicon/react';

interface AnimatedIconProps {
  icon: object | string; // Imported JSON or icon object
  size?: number;
  trigger?: 'hover' | 'click' | 'loop' | 'once';
  colors?: { primary?: string; secondary?: string };
  className?: string;
  onComplete?: () => void;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  size = 32,
  trigger = 'hover',
  className = '',
  onComplete,
}) => {
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    if (trigger === 'once') {
      playerRef.current?.playFromBeginning();
    } else if (trigger === 'loop') {
      // Periodic play or loop
      const interval = setInterval(() => {
        playerRef.current?.playFromBeginning();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [trigger]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      playerRef.current?.playFromBeginning();
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      playerRef.current?.playFromBeginning();
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      style={{ width: size, height: size }}
    >
      <Player
        ref={playerRef}
        icon={icon}
        size={size}
        onComplete={onComplete}
      />
    </div>
  );
};
```

---

### Option B: Custom Element (`<lord-icon>` Web Component)
Extremely lightweight, zero bundle overhead, and native support for all Lordicon triggers (`hover`, `click`, `loop`, `morph`, `boomerang`).

#### 1. Add Script Loader to `index.html` or Component Hook
```html
<script src="https://cdn.lordicon.com/lordicon.js"></script>
```

#### 2. Declare TypeScript Types
```typescript
// types/lord-icon.d.ts
declare namespace JSX {
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
```

#### 3. React Web Component Wrapper
```tsx
import React from 'react';

interface LordIconProps {
  src: string; // e.g. "https://cdn.lordicon.com/kthelypq.json"
  trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'boomerang';
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
}

export const LordIcon: React.FC<LordIconProps> = ({
  src,
  trigger = 'hover',
  size = 32,
  primaryColor = '#38bdf8',
  secondaryColor = '#818cf8',
  className = '',
}) => {
  const colorString = `primary:${primaryColor},secondary:${secondaryColor}`;

  return (
    <lord-icon
      src={src}
      trigger={trigger}
      colors={colorString}
      className={className}
      style={{ width: `${size}px`, height: `${size}px`, display: 'inline-block' }}
    />
  );
};
```

---

## 2. Token & Security Handling (Contest Hard Rule)

> [!CAUTION]
> **Strict Contest Compliance**:
> Under the AI DevFest rulebook, **NO API keys, project tokens, or secrets may ever be hardcoded into source code or committed to GitHub**.

- **Do NOT commit JWT tokens or secrets to git.**
- If project icons require an API token for dynamic fetching, store the token in:
  1. In-memory state
  2. `sessionStorage` / `localStorage` (via a settings modal inside the app)
- **Best Practice for 90-minute Contest**: Use direct Lordicon CDN paths (`https://cdn.lordicon.com/<icon-id>.json`) or bundled local JSON assets. This requires **zero tokens** at runtime and ensures 100% offline and firewall resilience.
