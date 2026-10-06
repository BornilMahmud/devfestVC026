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
  const navItems: { id: AppNavTab; labelEn: string; labelBn: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'overview',
      labelEn: 'Overview',
      labelBn: 'সারসংক্ষেপ',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'documents',
      labelEn: 'Documents',
      labelBn: 'নথিপত্র',
      icon: <Files className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'matching',
      labelEn: 'Matching',
      labelBn: 'নথি মিলানো',
      icon: <GitMerge className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'validation',
      labelEn: 'Validation',
      labelBn: 'যাচাই',
      icon: <AlertOctagon className="w-4 h-4 shrink-0" />,
      badge: blockerCount > 0 ? blockerCount : undefined,
    },
    {
      id: 'package',
      labelEn: 'Package preview',
      labelBn: 'প্যাকেজ প্রিভিউ',
      icon: <PackageCheck className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'design-system',
      labelEn: 'Design System',
      labelBn: 'ডিজাইন সিস্টেম',
      icon: <Palette className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside className="w-56 bg-[#FFFFFF] border-r border-[#DEE4EC] flex flex-col shrink-0 select-none min-h-screen">
      {/* Brand Section */}
      <div className="p-4 border-b border-[#DEE4EC]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#245CC6] text-white flex items-center justify-center shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#18263B] tracking-tight">TenderForge</h1>
            <p className="text-[10px] text-[#5C6B7E] font-medium leading-none mt-0.5">
              {lang === 'bn' ? 'দরপত্রের নথি প্যাকেজ নির্মাতা' : 'Tender Document Package Builder'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5C6B7E]">
          {lang === 'bn' ? 'কাজের ধাপ' : 'WORKSPACE'}
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const label = lang === 'bn' ? item.labelBn : item.labelEn;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#EDF3FF] text-[#245CC6] font-semibold'
                  : 'text-[#18263B] hover:bg-[#F8FAFC] hover:text-[#245CC6]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className={isActive ? 'text-[#245CC6]' : 'text-[#5C6B7E]'}>
                  {item.icon}
                </span>
                <span>{label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-[#B23A3A] text-white'
                      : 'bg-[#FEF0F0] text-[#B23A3A] border border-[#F9CACA]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status Note */}
      <div className="p-3 border-t border-[#DEE4EC] bg-[#F4F6F9]/50 text-[11px] text-[#5C6B7E] space-y-1">
        <div className="flex items-center space-x-1.5 text-[#21714C] font-semibold text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? '✓ সব পরিবর্তন সংরক্ষিত' : '✓ All changes saved locally'}</span>
        </div>
        <div className="text-[10px] text-[#5C6B7E] font-mono">
          TenderForge &bull; v1.0
        </div>
      </div>
    </aside>
  );
};
