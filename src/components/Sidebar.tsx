import React from 'react';
import {
  LayoutDashboard,
  Files,
  GitMerge,
  AlertOctagon,
  PackageCheck,
  Palette,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Language } from '../types';

export type AppNavTab =
  | 'overview'
  | 'documents'
  | 'matching'
  | 'validation'
  | 'package'
  | 'design-system';

interface SidebarProps {
  activeTab: AppNavTab;
  onTabChange: (tab: AppNavTab) => void;
  blockerCount: number;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  blockerCount,
  lang,
}) => {
  const navItems: { id: AppNavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <Files className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'matching',
      label: 'Matching',
      icon: <GitMerge className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'validation',
      label: 'Validation',
      icon: <AlertOctagon className="w-4 h-4 shrink-0" />,
      badge: blockerCount > 0 ? blockerCount : undefined,
    },
    {
      id: 'package',
      label: 'Package Preview',
      icon: <PackageCheck className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'design-system',
      label: 'Design System',
      icon: <Palette className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none">
      {/* Brand Section */}
      <div className="p-4 border-b border-slate-100 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">TenderForge</h1>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
              v2.6
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Tender Package Builder</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Workflow
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Compliance Badge */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1 shadow-2xs">
          <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Browser-Only Engine</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Cryptographic SHA-256 digests and PDF compilation run 100% locally.
          </p>
        </div>
      </div>
    </aside>
  );
};
