import React, { useEffect, useRef, useState } from 'react';
import { UploadedFile, Language } from '../types';
import { renderPDFPageToCanvas } from '../utils/pdfParser';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, AlertTriangle } from 'lucide-react';
import { t } from '../utils/translations';

interface PDFPreviewPanelProps {
  file: UploadedFile | null;
  lang: Language;
}

export const PDFPreviewPanel: React.FC<PDFPreviewPanelProps> = ({ file, lang }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [file?.id]);

  useEffect(() => {
    if (!file || !file.arrayBuffer || file.isCorrupt) {
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const render = async () => {
      try {
        if (canvasRef.current) {
          await renderPDFPageToCanvas(file.arrayBuffer, currentPage, canvasRef.current, scale);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Could not render page preview.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    render();

    return () => {
      isMounted = false;
    };
  }, [file, currentPage, scale]);

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 border border-dashed border-slate-700 rounded-xl bg-slate-900/40 text-slate-500">
        <FileText className="w-12 h-12 mb-2 opacity-40 text-cyan-400" />
        <p className="text-xs font-mono text-center">
          {t(lang, 'noDocumentSelected')}
        </p>
      </div>
    );
  }

  if (file.isCorrupt || file.error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 border border-red-500/40 rounded-xl bg-red-950/20 text-red-400">
        <AlertTriangle className="w-10 h-10 mb-2 text-red-400" />
        <p className="text-xs font-mono text-center font-semibold mb-1">
          {file.error || 'Corrupted or unreadable PDF'}
        </p>
        <p className="text-[11px] text-slate-400 text-center">
          This document cannot be previewed or included in the package.
        </p>
      </div>
    );
  }

  const totalPages = file.pages || 1;

  return (
    <div className="flex flex-col h-full bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
      {/* Preview Header Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/80 border-b border-slate-700/60">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-medium text-slate-200 truncate max-w-[180px]">
            {file.name}
          </span>
        </div>

        {/* Navigation & Zoom */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || loading}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors"
            title={t(lang, 'prevPage')}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-300 px-1">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || loading}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors"
            title={t(lang, 'nextPage')}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-3.5 bg-slate-700 mx-1" />

          <button
            onClick={() => setScale((s) => Math.max(0.7, s - 0.2))}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
            title={t(lang, 'zoomOut')}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale((s) => Math.min(2.0, s + 0.2))}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
            title={t(lang, 'zoomIn')}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative flex-1 min-h-[300px] max-h-[460px] overflow-auto flex items-center justify-center p-3 bg-slate-950/60">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 z-10">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Rendering preview...</span>
            </div>
          </div>
        )}

        {error ? (
          <div className="text-red-400 text-xs font-mono text-center p-4">
            {error}
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-full shadow-2xl rounded border border-slate-700/60 transition-all"
          />
        )}
      </div>
    </div>
  );
};
