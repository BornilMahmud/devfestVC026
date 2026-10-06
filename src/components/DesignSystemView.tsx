import React from 'react';
import { StatusBadge } from './StatusBadge';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  AlertOctagon,
  Download,
  UploadCloud,
  FileText,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  Layers,
  Info,
  Check,
  X,
} from 'lucide-react';
import { LordIcon } from './LordIcon';

export const DesignSystemView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Page Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-blue-700">
          <span>TENDERFORGE DESIGN SYSTEM</span>
          <span>&bull;</span>
          <span>ENTERPRISE SPECIFICATION v2.6</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
          System Foundations & Component Library
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Light enterprise design system calibrated for procurement accuracy, academic evaluation, and deterministic compliance validation.
        </p>
      </div>

      {/* Grid of 6 Specification Boards (matching the attached reference image) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: System Foundations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Section 01</span>
            <h3 className="text-sm font-bold text-slate-900">System Foundations: Color & Typography</h3>
          </div>

          {/* Color Palette Swatches */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-700 block">Core Semantic Tokens</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
              <div className="p-2.5 rounded-lg bg-[#0F172A] text-white">
                <span className="font-bold block">Primary Text</span>
                <span className="text-slate-400">#0F172A</span>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-600 text-white">
                <span className="font-bold block">Action Blue</span>
                <span className="text-blue-100">#2563EB</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="font-bold block">Success</span>
                <span className="text-emerald-600">#10B981</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
                <span className="font-bold block">Blocking</span>
                <span className="text-rose-600">#EF4444</span>
              </div>
            </div>
          </div>

          {/* Typography Scale */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-700 block">Type Hierarchy</span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-slate-900">Display Title 20 / 700</span>
                <span className="text-[10px] font-mono text-slate-400">Section Headers</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-slate-800">Heading 14 / 600</span>
                <span className="text-[10px] font-mono text-slate-400">Card Titles</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-600">Body Text 12 / 400</span>
                <span className="text-[10px] font-mono text-slate-400">Table Data & Meta</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Controls and Interaction States */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Section 02</span>
            <h3 className="text-sm font-bold text-slate-900">Controls & Interaction States</h3>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-slate-700 block">Button Variants</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg font-medium shadow-2xs hover:bg-blue-700">
                Primary Action
              </button>
              <button className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50">
                Secondary Action
              </button>
              <button className="px-3.5 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100">
                Destructive Action
              </button>
            </div>

            <span className="text-[11px] font-semibold text-slate-700 block pt-2">Input Elements</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Text field..."
                defaultValue="Trade License 2026.pdf"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                readOnly
              />
              <input
                type="date"
                defaultValue="2027-06-30"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Panel 3: Status System */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Section 03</span>
            <h3 className="text-sm font-bold text-slate-900">Deterministic Status System</h3>
          </div>

          <p className="text-xs text-slate-500">
            Strict Icon + Label + Semantic Color standard. Never relies on color alone.
          </p>

          <div className="flex flex-wrap gap-2">
            <StatusBadge status="OK" />
            <StatusBadge status="EXPIRY_NEEDED" />
            <StatusBadge status="EXPIRED" />
            <StatusBadge status="MISSING" />
            <StatusBadge status="NOT_PROVIDED" />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">Validation Precedence:</div>
            <div>1. Missing mandatory document &rarr; <strong>MISSING</strong> (Blocking)</div>
            <div>2. Missing statutory date &rarr; <strong>EXPIRY DATE NEEDED</strong> (Blocking)</div>
            <div>3. Expiration date &lt; deadline &rarr; <strong>EXPIRED</strong> (Blocking)</div>
            <div>4. Satisfied requirements &rarr; <strong>OK</strong> (Valid)</div>
          </div>
        </div>

        {/* Panel 4: Tables, Cards and Panels */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Section 04</span>
            <h3 className="text-sm font-bold text-slate-900">Density Without Friction</h3>
          </div>

          {/* Miniature Table Specimen */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-slate-50 p-2.5 font-semibold text-slate-500 flex justify-between">
              <span>Specimen Checklist Row</span>
              <span>Density: Compact</span>
            </div>
            <div className="p-3 bg-white flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-blue-700">R01</span>
                <span className="font-medium text-slate-800">Trade License</span>
                <span className="text-slate-400 text-[11px]">(trade_license_2026.pdf)</span>
              </div>
              <StatusBadge status="OK" />
            </div>
          </div>

          {/* Miniature KPI Specimen */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Submission Readiness</span>
              <span className="text-base font-bold text-emerald-600">100% Verified</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Compiled Output</span>
              <span className="text-base font-bold text-blue-700">17 Pages</span>
            </div>
          </div>
        </div>

        {/* Panel 5: Dialogs and Feedback */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Section 05</span>
            <h3 className="text-sm font-bold text-slate-900">Feedback & Recovery Actions</h3>
          </div>

          {/* Feedback Specimen */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-red-800">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <span>Blocking Compliance Issue</span>
            </div>
            <p className="text-red-700 leading-tight">
              Trade License expired on 2025-06-30, before the mandatory tender submission deadline (2026-10-20).
            </p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Preflight Audit Passed</span>
            </div>
            <p className="text-emerald-700 leading-tight">
              All mandatory documents attached and verified with zero content duplicate conflicts.
            </p>
          </div>
        </div>

        {/* Panel 6: Motion, Accessibility and Lordicon */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Section 06</span>
            <h3 className="text-sm font-bold text-slate-900">Motion & Accessibility Standards</h3>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold block text-slate-800">150–220ms</span>
              <span className="text-[10px] text-slate-500">Micro Hover</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold block text-slate-800">200–350ms</span>
              <span className="text-[10px] text-slate-500">View Transition</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold block text-slate-800">WCAG AA</span>
              <span className="text-[10px] text-slate-500">Contrast Ratio</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed pt-1">
            <span className="font-semibold text-slate-800 block">Lordicon Placement Policy:</span>
            Subtle animated micro-interactions utilized strictly for state indicators (Upload, Lock, Download, Alert) without continuous distraction loops.
          </div>
        </div>
      </div>
    </div>
  );
};
