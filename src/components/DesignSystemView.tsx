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
import { Language } from '../types';

interface DesignSystemViewProps {
  lang?: Language;
}

export const DesignSystemView: React.FC<DesignSystemViewProps> = ({ lang = 'en' }) => {
  return (
    <div className="space-y-8 pb-12 animate-tf-fade-in">
      {/* Page Title */}
      <div className="animate-tf-fade-up">
        <div className="flex items-center space-x-2 text-xs font-mono text-blue-700">
          <span>{lang === 'bn' ? 'টেন্ডারফোর্জ ডিজাইন সিস্টেম' : 'TENDERFORGE DESIGN SYSTEM'}</span>
          <span>&bull;</span>
          <span>ENTERPRISE SPECIFICATION v2.6</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
          {lang === 'bn' ? 'সিস্টেম ভিত্তি ও উপাদান লাইব্রেরি' : 'System Foundations & Component Library'}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          {lang === 'bn'
            ? 'সংগ্রহের নির্ভুলতা, একাডেমিক মূল্যায়ন এবং সংবিধিবদ্ধ সম্মতি যাচাইয়ের জন্য ক্যালিব্রেট করা লাইট এন্টারপ্রাইজ ডিজাইন সিস্টেম।'
            : 'Light enterprise design system calibrated for procurement accuracy, academic evaluation, and deterministic compliance validation.'}
        </p>
      </div>

      {/* Grid of 6 Specification Boards (matching the attached reference image) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: System Foundations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === 'bn' ? 'অধ্যায় ০১' : 'Section 01'}
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'bn' ? 'সিস্টেম ভিত্তি: রঙ ও টাইপোগ্রাফি' : 'System Foundations: Color & Typography'}
            </h3>
          </div>

          {/* Color Palette Swatches */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-700 block">
              {lang === 'bn' ? 'মূল শব্দার্থিক টোকেন' : 'Core Semantic Tokens'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
              <div className="p-2.5 rounded-lg bg-[#0F172A] text-white">
                <span className="font-bold block">{lang === 'bn' ? 'মূল লেখা' : 'Primary Text'}</span>
                <span className="text-slate-400">#0F172A</span>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-600 text-white">
                <span className="font-bold block">{lang === 'bn' ? 'অ্যাকশন ব্লু' : 'Action Blue'}</span>
                <span className="text-blue-100">#2563EB</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="font-bold block">{lang === 'bn' ? 'সফলতা' : 'Success'}</span>
                <span className="text-emerald-600">#10B981</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
                <span className="font-bold block">{lang === 'bn' ? 'বাধা' : 'Blocking'}</span>
                <span className="text-rose-600">#EF4444</span>
              </div>
            </div>
          </div>

          {/* Typography Scale */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-700 block">
              {lang === 'bn' ? 'টাইপ অনুক্রম' : 'Type Hierarchy'}
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-slate-900">Display Title 20 / 700</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {lang === 'bn' ? 'শাখা শিরোনাম' : 'Section Headers'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-slate-800">Heading 14 / 600</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {lang === 'bn' ? 'কার্ড শিরোনাম' : 'Card Titles'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-600">Body Text 12 / 400</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {lang === 'bn' ? 'টেবিল ও মেটাডাটা' : 'Table Data & Meta'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Controls and Interaction States */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === 'bn' ? 'অধ্যায় ০২' : 'Section 02'}
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'bn' ? 'নিয়ন্ত্রণ ও ইন্টারঅ্যাকশন অবস্থা' : 'Controls & Interaction States'}
            </h3>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-slate-700 block">
              {lang === 'bn' ? 'বাটন ধরন' : 'Button Variants'}
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg font-medium shadow-2xs hover:bg-blue-700">
                {lang === 'bn' ? 'প্রাথমিক বাটন' : 'Primary Action'}
              </button>
              <button className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50">
                {lang === 'bn' ? 'মাধ্যমিক বাটন' : 'Secondary Action'}
              </button>
              <button className="px-3.5 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100">
                {lang === 'bn' ? 'মুছে ফেলা' : 'Destructive Action'}
              </button>
            </div>

            <span className="text-[11px] font-semibold text-slate-700 block pt-2">
              {lang === 'bn' ? 'ইনপুট উপাদানসমূহ' : 'Input Elements'}
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder={lang === 'bn' ? 'টেক্সট ফিল্ড...' : 'Text field...'}
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === 'bn' ? 'অধ্যায় ০৩' : 'Section 03'}
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'bn' ? 'সুনির্দিষ্ট অবস্থা সিস্টেম' : 'Deterministic Status System'}
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            {lang === 'bn'
              ? 'আইকন + লেবেল + অর্থপূর্ণ রঙের সমন্বয়। শুধুমাত্র রঙের উপর নির্ভরশীল নয়।'
              : 'Strict Icon + Label + Semantic Color standard. Never relies on color alone.'}
          </p>

          <div className="flex flex-wrap gap-2">
            <StatusBadge status="OK" lang={lang} />
            <StatusBadge status="EXPIRY_NEEDED" lang={lang} />
            <StatusBadge status="EXPIRED" lang={lang} />
            <StatusBadge status="MISSING" lang={lang} />
            <StatusBadge status="NOT_PROVIDED" lang={lang} />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">
              {lang === 'bn' ? 'যাচাইয়ের ক্রম অগ্রাধিকার:' : 'Validation Precedence:'}
            </div>
            <div>
              {lang === 'bn'
                ? '১. অনুপস্থিত প্রয়োজনীয় নথি → MISSING (বাধা)'
                : '1. Missing mandatory document → MISSING (Blocking)'}
            </div>
            <div>
              {lang === 'bn'
                ? '২. প্রয়োজনীয় মেয়াদ অনুপস্থিত → EXPIRY DATE NEEDED (বাধা)'
                : '2. Missing statutory date → EXPIRY DATE NEEDED (Blocking)'}
            </div>
            <div>
              {lang === 'bn'
                ? '৩. মেয়াদ < জমাদানের শেষ সময় → EXPIRED (বাধা)'
                : '3. Expiration date < deadline → EXPIRED (Blocking)'}
            </div>
            <div>
              {lang === 'bn'
                ? '৪. সকল শর্ত পূরণ → OK (বৈধ)'
                : '4. Satisfied requirements → OK (Valid)'}
            </div>
          </div>
        </div>

        {/* Panel 4: Tables, Cards and Panels */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === 'bn' ? 'অধ্যায় ০৪' : 'Section 04'}
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'bn' ? 'সহজ ও স্পষ্ট ঘনত্ব' : 'Density Without Friction'}
            </h3>
          </div>

          {/* Miniature Table Specimen */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-slate-50 p-2.5 font-semibold text-slate-500 flex justify-between">
              <span>{lang === 'bn' ? 'নমুনা চেকলিস্ট সারি' : 'Specimen Checklist Row'}</span>
              <span>{lang === 'bn' ? 'ঘনত্ব: কমপ্যাক্ট' : 'Density: Compact'}</span>
            </div>
            <div className="p-3 bg-white flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-blue-700">R01</span>
                <span className="font-medium text-slate-800">
                  {lang === 'bn' ? 'ট্রেড লাইসেন্স' : 'Trade License'}
                </span>
                <span className="text-slate-400 text-[11px]">(trade_license_2026.pdf)</span>
              </div>
              <StatusBadge status="OK" lang={lang} />
            </div>
          </div>

          {/* Miniature KPI Specimen */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {lang === 'bn' ? 'জমাদানের প্রস্তুতি' : 'Submission Readiness'}
              </span>
              <span className="text-base font-bold text-emerald-600">
                {lang === 'bn' ? '১০০% যাচাইকৃত' : '100% Verified'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {lang === 'bn' ? 'সংকলিত আউটপুট' : 'Compiled Output'}
              </span>
              <span className="text-base font-bold text-blue-700">
                {lang === 'bn' ? '১৭ পৃষ্ঠা' : '17 Pages'}
              </span>
            </div>
          </div>
        </div>

        {/* Panel 5: Dialogs and Feedback */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === 'bn' ? 'অধ্যায় ০৫' : 'Section 05'}
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'bn' ? 'ফিডব্যাক ও সমাধানমূলক পদক্ষেপ' : 'Feedback & Recovery Actions'}
            </h3>
          </div>

          {/* Feedback Specimen */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-red-800">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <span>{lang === 'bn' ? 'বাধা সম্মতি সমস্যা' : 'Blocking Compliance Issue'}</span>
            </div>
            <p className="text-red-700 leading-tight">
              {lang === 'bn'
                ? 'ট্রেড লাইসেন্স ২০২৫-০৬-৩০ তারিখে উত্তীর্ণ হয়েছে, যা দরপত্র জমাদানের শেষ সময় (২০২৬-১০-২০) এর পূর্বের।'
                : 'Trade License expired on 2025-06-30, before the mandatory tender submission deadline (2026-10-20).'}
            </p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? 'প্রাক-যাচাই অডিট উত্তীর্ণ' : 'Preflight Audit Passed'}</span>
            </div>
            <p className="text-emerald-700 leading-tight">
              {lang === 'bn'
                ? 'সকল বাধ্যতামূলক নথি সংযুক্ত এবং শূন্য ডুপ্লিকেট দ্বন্দ্ব সহ যাচাইকৃত।'
                : 'All mandatory documents attached and verified with zero content duplicate conflicts.'}
            </p>
          </div>
        </div>

        {/* Panel 6: Motion, Accessibility and Lordicon */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === 'bn' ? 'অধ্যায় ০৬' : 'Section 06'}
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'bn' ? 'মোশন ও অ্যাক্সেসিবিলিটি মানদণ্ড' : 'Motion & Accessibility Standards'}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold block text-slate-800">150–220ms</span>
              <span className="text-[10px] text-slate-500">
                {lang === 'bn' ? 'মাইক্রো হোভার' : 'Micro Hover'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold block text-slate-800">200–350ms</span>
              <span className="text-[10px] text-slate-500">
                {lang === 'bn' ? 'ভিউ ট্রানজিশন' : 'View Transition'}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold block text-slate-800">WCAG AA</span>
              <span className="text-[10px] text-slate-500">
                {lang === 'bn' ? 'বৈপরীত্য অনুপাত' : 'Contrast Ratio'}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed pt-1">
            <span className="font-semibold text-slate-800 block">
              {lang === 'bn' ? 'লর্ডআইকন ব্যবহারের নীতিমালা:' : 'Lordicon Placement Policy:'}
            </span>
            {lang === 'bn'
              ? 'সূক্ষ্ম অ্যানিমেটেড মাইক্রো-ইন্টারঅ্যাকশন শুধুমাত্র অবস্থার নির্দেশক হিসেবে ব্যবহৃত হয়।'
              : 'Subtle animated micro-interactions utilized strictly for state indicators (Upload, Lock, Download, Alert) without continuous distraction loops.'}
          </div>
        </div>
      </div>
    </div>
  );
};
