import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import { RequirementValidation, TenderMetadata } from '../types';

export interface PDFGenerationProgress {
  step: string;
  percent: number;
}

/**
 * Generates the complete, audit-compliant tender document package PDF.
 */
export async function generateTenderPackagePDF(
  tender: TenderMetadata,
  validations: RequirementValidation[],
  includeIndexPage: boolean = true,
  onProgress?: (progress: PDFGenerationProgress) => void
): Promise<{ blob: Blob; filename: string; totalPages: number }> {
  onProgress?.({ step: 'Initializing package architecture...', percent: 10 });

  // 1. Filter included documents in strict requirement order
  const includedItems = validations
    .filter((v) => v.status === 'OK' && v.matchedFile)
    .sort((a, b) => a.requirement.order - b.requirement.order);

  // 2. Count source document pages
  let sourcePagesCount = 0;
  for (const item of includedItems) {
    sourcePagesCount += item.matchedFile!.pages || 1;
  }

  // 3. Calculate page allocation
  const coverPagesCount = 1;
  const indexPagesCount = includeIndexPage ? 1 : 0;
  const totalPackagePages = coverPagesCount + indexPagesCount + sourcePagesCount;

  onProgress?.({ step: 'Assembling master document...', percent: 25 });

  // 4. Create Master PDF
  const masterDoc = await PDFDocument.create();
  const helvetica = await masterDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await masterDoc.embedFont(StandardFonts.HelveticaBold);

  // Standard A4 dimensions in points: 595.28 x 841.89
  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;

  // ----------------------------------------------------
  // PAGE 1: OFFICIAL ENGLISH COVER PAGE
  // ----------------------------------------------------
  onProgress?.({ step: 'Designing official cover dossier...', percent: 40 });
  const coverPage = masterDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Decorative border and header accents
  coverPage.drawRectangle({
    x: 36,
    y: 36,
    width: PAGE_WIDTH - 72,
    height: PAGE_HEIGHT - 72,
    borderColor: rgb(0.12, 0.53, 0.9), // Corporate navy/cyan border
    borderWidth: 1.5,
  });

  // Top header banner
  coverPage.drawRectangle({
    x: 36,
    y: PAGE_HEIGHT - 120,
    width: PAGE_WIDTH - 72,
    height: 84,
    color: rgb(0.04, 0.11, 0.22), // Deep corporate blue
  });

  coverPage.drawText('TENDER SUBMISSION PACKAGE', {
    x: 56,
    y: PAGE_HEIGHT - 75,
    size: 20,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  coverPage.drawText('CONFIDENTIAL PROCUREMENT DOSSIER — OFFICIAL COMPLIANCE SUBMISSION', {
    x: 56,
    y: PAGE_HEIGHT - 95,
    size: 8,
    font: helvetica,
    color: rgb(0.3, 0.75, 0.95),
  });

  // Tender Metadata Summary Box
  const metaStartY = PAGE_HEIGHT - 160;
  coverPage.drawText('TENDER & BIDDER METADATA', {
    x: 56,
    y: metaStartY,
    size: 11,
    font: helveticaBold,
    color: rgb(0.1, 0.2, 0.4),
  });

  coverPage.drawLine({
    start: { x: 56, y: metaStartY - 6 },
    end: { x: PAGE_WIDTH - 56, y: metaStartY - 6 },
    thickness: 1,
    color: rgb(0.8, 0.85, 0.9),
  });

  const metaRows = [
    { label: 'TENDER ID:', value: tender.tender_id },
    { label: 'TENDER TITLE:', value: tender.title },
    { label: 'PROCURING ENTITY:', value: tender.procuring_entity },
    { label: 'BIDDER NAME:', value: tender.bidder },
    { label: 'SUBMISSION DEADLINE:', value: tender.submission_deadline },
    { label: 'DATE GENERATED:', value: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC' },
  ];

  let currentY = metaStartY - 24;
  for (const row of metaRows) {
    coverPage.drawText(row.label, {
      x: 56,
      y: currentY,
      size: 9.5,
      font: helveticaBold,
      color: rgb(0.2, 0.25, 0.35),
    });
    coverPage.drawText(row.value, {
      x: 210,
      y: currentY,
      size: 9.5,
      font: helvetica,
      color: rgb(0.05, 0.05, 0.1),
    });
    currentY -= 18;
  }

  // Included Documents Schedule Box
  currentY -= 15;
  coverPage.drawText('SCHEDULE OF ENCLOSED DOCUMENTS', {
    x: 56,
    y: currentY,
    size: 11,
    font: helveticaBold,
    color: rgb(0.1, 0.2, 0.4),
  });

  coverPage.drawLine({
    start: { x: 56, y: currentY - 6 },
    end: { x: PAGE_WIDTH - 56, y: currentY - 6 },
    thickness: 1,
    color: rgb(0.8, 0.85, 0.9),
  });

  currentY -= 22;
  // Table header
  coverPage.drawText('#', { x: 56, y: currentY, size: 8.5, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  coverPage.drawText('CODE', { x: 76, y: currentY, size: 8.5, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  coverPage.drawText('DOCUMENT TITLE', { x: 120, y: currentY, size: 8.5, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  coverPage.drawText('MATCHED FILE', { x: 310, y: currentY, size: 8.5, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  coverPage.drawText('PAGES', { x: 460, y: currentY, size: 8.5, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  coverPage.drawText('EXPIRY', { x: 505, y: currentY, size: 8.5, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });

  currentY -= 6;
  coverPage.drawLine({
    start: { x: 56, y: currentY },
    end: { x: PAGE_WIDTH - 56, y: currentY },
    thickness: 0.5,
    color: rgb(0.8, 0.85, 0.9),
  });

  currentY -= 14;
  for (let idx = 0; idx < includedItems.length; idx++) {
    const item = includedItems[idx];
    const itemNum = String(idx + 1).padStart(2, '0');
    const title = item.requirement.title_en.length > 30 ? item.requirement.title_en.substring(0, 28) + '...' : item.requirement.title_en;
    const fileName = item.matchedFile!.name.length > 24 ? item.matchedFile!.name.substring(0, 22) + '...' : item.matchedFile!.name;
    const pagesStr = `${item.matchedFile!.pages} p`;
    const expiryStr = item.expiryDate || 'N/A';

    coverPage.drawText(itemNum, { x: 56, y: currentY, size: 8, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    coverPage.drawText(item.requirement.id, { x: 76, y: currentY, size: 8, font: helveticaBold, color: rgb(0.1, 0.35, 0.7) });
    coverPage.drawText(title, { x: 120, y: currentY, size: 8, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    coverPage.drawText(fileName, { x: 310, y: currentY, size: 8, font: helvetica, color: rgb(0.2, 0.3, 0.4) });
    coverPage.drawText(pagesStr, { x: 460, y: currentY, size: 8, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    coverPage.drawText(expiryStr, { x: 505, y: currentY, size: 8, font: helvetica, color: item.expiryDate ? rgb(0.1, 0.6, 0.3) : rgb(0.5, 0.5, 0.5) });

    currentY -= 16;
    if (currentY < 75) break; // stay within cover page safe zone
  }

  // ----------------------------------------------------
  // PAGE 2: BONUS INDEX PAGE / TABLE OF CONTENTS
  // ----------------------------------------------------
  const documentStartPages: { title: string; reqId: string; startPage: number; pages: number }[] = [];
  let runningPageCounter = coverPagesCount + indexPagesCount + 1;

  for (const item of includedItems) {
    documentStartPages.push({
      title: item.requirement.title_en,
      reqId: item.requirement.id,
      startPage: runningPageCounter,
      pages: item.matchedFile!.pages || 1,
    });
    runningPageCounter += item.matchedFile!.pages || 1;
  }

  if (includeIndexPage) {
    onProgress?.({ step: 'Generating comprehensive document index...', percent: 55 });
    const indexPage = masterDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    indexPage.drawRectangle({
      x: 36,
      y: 36,
      width: PAGE_WIDTH - 72,
      height: PAGE_HEIGHT - 72,
      borderColor: rgb(0.85, 0.88, 0.92),
      borderWidth: 1,
    });

    indexPage.drawText('TABLE OF CONTENTS & SECTION INDEX', {
      x: 56,
      y: PAGE_HEIGHT - 80,
      size: 16,
      font: helveticaBold,
      color: rgb(0.04, 0.11, 0.22),
    });

    indexPage.drawText(`Tender ID: ${tender.tender_id} | Total Documents: ${includedItems.length} | Package Volume: ${totalPackagePages} Pages`, {
      x: 56,
      y: PAGE_HEIGHT - 98,
      size: 9,
      font: helvetica,
      color: rgb(0.4, 0.45, 0.55),
    });

    indexPage.drawLine({
      start: { x: 56, y: PAGE_HEIGHT - 110 },
      end: { x: PAGE_WIDTH - 56, y: PAGE_HEIGHT - 110 },
      thickness: 1,
      color: rgb(0.2, 0.5, 0.8),
    });

    let indexY = PAGE_HEIGHT - 140;
    // Index table header
    indexPage.drawText('SECTION', { x: 56, y: indexY, size: 9, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
    indexPage.drawText('REQ ID', { x: 120, y: indexY, size: 9, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
    indexPage.drawText('DOCUMENT DESCRIPTION', { x: 180, y: indexY, size: 9, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
    indexPage.drawText('PAGES', { x: 420, y: indexY, size: 9, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
    indexPage.drawText('START PAGE', { x: 480, y: indexY, size: 9, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });

    indexY -= 8;
    indexPage.drawLine({
      start: { x: 56, y: indexY },
      end: { x: PAGE_WIDTH - 56, y: indexY },
      thickness: 0.5,
      color: rgb(0.8, 0.85, 0.9),
    });

    indexY -= 20;

    // Row 1: Cover
    indexPage.drawText('Dossier Cover', { x: 56, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    indexPage.drawText('—', { x: 120, y: indexY, size: 9, font: helvetica, color: rgb(0.5, 0.5, 0.5) });
    indexPage.drawText('Official Tender Submission Cover', { x: 180, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    indexPage.drawText('1 page', { x: 420, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    indexPage.drawText('Page 1', { x: 480, y: indexY, size: 9, font: helveticaBold, color: rgb(0.04, 0.11, 0.22) });

    indexY -= 18;
    // Row 2: Index
    indexPage.drawText('Table of Contents', { x: 56, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    indexPage.drawText('—', { x: 120, y: indexY, size: 9, font: helvetica, color: rgb(0.5, 0.5, 0.5) });
    indexPage.drawText('Section Registry & Pagination Index', { x: 180, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    indexPage.drawText('1 page', { x: 420, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    indexPage.drawText('Page 2', { x: 480, y: indexY, size: 9, font: helveticaBold, color: rgb(0.04, 0.11, 0.22) });

    indexY -= 20;

    for (let idx = 0; idx < documentStartPages.length; idx++) {
      const doc = documentStartPages[idx];
      const sectionNum = `Section ${idx + 1}`;

      indexPage.drawText(sectionNum, { x: 56, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
      indexPage.drawText(doc.reqId, { x: 120, y: indexY, size: 9, font: helveticaBold, color: rgb(0.1, 0.35, 0.7) });
      indexPage.drawText(doc.title, { x: 180, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
      indexPage.drawText(`${doc.pages} ${doc.pages === 1 ? 'page' : 'pages'}`, { x: 420, y: indexY, size: 9, font: helvetica, color: rgb(0.3, 0.3, 0.3) });
      indexPage.drawText(`Page ${doc.startPage}`, { x: 480, y: indexY, size: 9, font: helveticaBold, color: rgb(0.04, 0.11, 0.22) });

      indexY -= 18;
      if (indexY < 70) break;
    }
  }

  // ----------------------------------------------------
  // STEP 6: APPEND ALL SOURCE PAGES IN ORDER
  // ----------------------------------------------------
  for (let idx = 0; idx < includedItems.length; idx++) {
    const item = includedItems[idx];
    const percent = Math.round(60 + (idx / includedItems.length) * 25);
    onProgress?.({
      step: `Merging [${item.requirement.id}] ${item.matchedFile!.name}...`,
      percent,
    });

    try {
      const srcPdf = await PDFDocument.load(item.matchedFile!.arrayBuffer);
      const copiedPages = await masterDoc.copyPages(srcPdf, srcPdf.getPageIndices());

      for (const page of copiedPages) {
        masterDoc.addPage(page);
      }
    } catch (mergeErr) {
      console.error(`Error copying pages from ${item.matchedFile!.name}:`, mergeErr);
      // Fallback: create placeholder error page in package
      const errPage = masterDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      errPage.drawText(`Attachment Document: ${item.matchedFile!.name} (Error parsing original pages)`, {
        x: 56,
        y: PAGE_HEIGHT / 2,
        size: 12,
        font: helveticaBold,
        color: rgb(0.8, 0.2, 0.2),
      });
    }
  }

  // ----------------------------------------------------
  // STEP 7: APPLY FOOTER ON EVERY SINGLE PAGE
  // Footer rule: "<tender_id> | Page X of Y"
  // Must be readable and not overlap document content
  // ----------------------------------------------------
  onProgress?.({ step: 'Applying pagination headers and footers to all pages...', percent: 90 });
  const allPages: PDFPage[] = masterDoc.getPages();
  const actualTotalPages = allPages.length;

  for (let pageIdx = 0; pageIdx < actualTotalPages; pageIdx++) {
    const page = allPages[pageIdx];
    const { width, height } = page.getSize();
    const pageNum = pageIdx + 1;
    const footerText = `${tender.tender_id} | Page ${pageNum} of ${actualTotalPages}`;

    // Background protective strip at bottom margin (height 28)
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height: 28,
      color: rgb(0.98, 0.98, 0.99),
      opacity: 0.95,
    });

    // Clean hairline separator
    page.drawLine({
      start: { x: 30, y: 28 },
      end: { x: width - 30, y: 28 },
      thickness: 0.5,
      color: rgb(0.8, 0.83, 0.88),
    });

    // Footer text
    const textWidth = helveticaBold.widthOfTextAtSize(footerText, 8);
    page.drawText(footerText, {
      x: (width - textWidth) / 2,
      y: 11,
      size: 8,
      font: helveticaBold,
      color: rgb(0.2, 0.25, 0.35),
    });

    // Document classification tag on bottom left
    page.drawText('TENDERFORGE VERIFIED', {
      x: 36,
      y: 11,
      size: 6.5,
      font: helvetica,
      color: rgb(0.5, 0.55, 0.65),
    });
  }

  onProgress?.({ step: 'Finalizing PDF output package...', percent: 98 });
  const pdfBytes = await masterDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const filename = `${tender.tender_id}_Package.pdf`;

  onProgress?.({ step: 'Package ready for download.', percent: 100 });

  return { blob, filename, totalPages: actualTotalPages };
}

/**
 * Triggers standard browser download for a Blob
 */
export function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
