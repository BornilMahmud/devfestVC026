import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker if in browser
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export interface PDFInspectionResult {
  pages: number;
  isEncrypted: boolean;
  isCorrupt: boolean;
  error?: string;
}

/**
 * Inspects a PDF arrayBuffer using pdf-lib and pdfjs for page count, password protection, and integrity
 */
export async function inspectPDF(arrayBuffer: ArrayBuffer): Promise<PDFInspectionResult> {
  try {
    // 1. Primary inspection using pdf-lib (zero network dependencies)
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
    const pages = pdfDoc.getPageCount();

    if (pages <= 0) {
      return {
        pages: 0,
        isEncrypted: false,
        isCorrupt: true,
        error: 'PDF contains no pages.',
      };
    }

    return {
      pages,
      isEncrypted: false,
      isCorrupt: false,
    };
  } catch (err: any) {
    const errorMsg = (err?.message || '').toLowerCase();
    
    // Check for password protection
    if (errorMsg.includes('encrypt') || errorMsg.includes('password') || errorMsg.includes('protected')) {
      return {
        pages: 0,
        isEncrypted: true,
        isCorrupt: false,
        error: 'Password-protected / encrypted PDF is not supported.',
      };
    }

    // Try secondary inspection using pdfjs
    try {
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
      const doc = await loadingTask.promise;
      return {
        pages: doc.numPages,
        isEncrypted: false,
        isCorrupt: false,
      };
    } catch (fallbackErr: any) {
      return {
        pages: 0,
        isEncrypted: false,
        isCorrupt: true,
        error: 'Invalid or corrupted PDF file.',
      };
    }
  }
}

/**
 * Renders a specific page of a PDF onto a canvas element
 */
export async function renderPDFPageToCanvas(
  arrayBuffer: ArrayBuffer,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.0
): Promise<void> {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(Math.max(1, Math.min(pageNumber, pdf.numPages)));

  const viewport = page.getViewport({ scale });
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2D canvas context');

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;
}
