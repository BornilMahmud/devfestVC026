import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function generateSamplePackage() {
  console.log('=== GENERATING SAMPLE TENDER PACKAGE ===\n');

  const reqData = JSON.parse(fs.readFileSync('./requirements.json', 'utf8'));
  const tender = reqData.tender;
  const docsDir = './documents';

  // Output directory
  if (!fs.existsSync('./output')) {
    fs.mkdirSync('./output', { recursive: true });
  }

  // Selected valid matches for the sample pack:
  // R01 (Trade License): trade_license_2026.pdf (valid expiry: 2027-06-30)
  // R02 (TIN): 03_tin_certificate.pdf
  // R03 (VAT): 04_vat_certificate.pdf
  // R04 (Bank Solvency): bank_solvency.pdf (valid expiry: 2026-12-31)
  // R05 (Experience Cert): experience_cert.pdf
  // R06 (Audited Financial): optional, not provided
  // R07 (Manufacturer's Auth): optional, not provided
  // R08 (Technical Proposal): 02_technical_proposal.pdf
  // R09 (Financial Proposal): 01_financial_proposal.pdf
  // R10 (Signed Declaration): scan_0042.pdf
  const matchedList = [
    { req: reqData.requirements[0], file: 'trade_license_2026.pdf', expiry: '2027-06-30' },
    { req: reqData.requirements[1], file: '03_tin_certificate.pdf', expiry: '' },
    { req: reqData.requirements[2], file: '04_vat_certificate.pdf', expiry: '' },
    { req: reqData.requirements[3], file: 'bank_solvency.pdf', expiry: '2026-12-31' },
    { req: reqData.requirements[4], file: 'experience_cert.pdf', expiry: '' },
    { req: reqData.requirements[7], file: '02_technical_proposal.pdf', expiry: '' },
    { req: reqData.requirements[8], file: '01_financial_proposal.pdf', expiry: '' },
    { req: reqData.requirements[9], file: 'scan_0042.pdf', expiry: '' },
  ];

  const masterDoc = await PDFDocument.create();
  const helvetica = await masterDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await masterDoc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;

  // Count source pages
  let sourcePagesCount = 0;
  for (const m of matchedList) {
    const buf = fs.readFileSync(path.join(docsDir, m.file));
    const srcDoc = await PDFDocument.load(buf);
    sourcePagesCount += srcDoc.getPageCount();
  }

  const coverPagesCount = 1;
  const indexPagesCount = 1;
  const totalPackagePages = coverPagesCount + indexPagesCount + sourcePagesCount;

  console.log(`Cover: ${coverPagesCount} page | Index: ${indexPagesCount} page | Document Pages: ${sourcePagesCount}`);
  console.log(`Total Package Pages: ${totalPackagePages}`);

  // 1. Cover Page
  const coverPage = masterDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  coverPage.drawRectangle({
    x: 36,
    y: 36,
    width: PAGE_WIDTH - 72,
    height: PAGE_HEIGHT - 72,
    borderColor: rgb(0.12, 0.53, 0.9),
    borderWidth: 1.5,
  });

  coverPage.drawRectangle({
    x: 36,
    y: PAGE_HEIGHT - 120,
    width: PAGE_WIDTH - 72,
    height: 84,
    color: rgb(0.04, 0.11, 0.22),
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
    coverPage.drawText(row.label, { x: 56, y: currentY, size: 9.5, font: helveticaBold, color: rgb(0.2, 0.25, 0.35) });
    coverPage.drawText(row.value, { x: 210, y: currentY, size: 9.5, font: helvetica, color: rgb(0.05, 0.05, 0.1) });
    currentY -= 18;
  }

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
  coverPage.drawText('#', { x: 56, y: currentY, size: 8.5, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  coverPage.drawText('CODE', { x: 76, y: currentY, size: 8.5, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  coverPage.drawText('DOCUMENT TITLE', { x: 120, y: currentY, size: 8.5, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  coverPage.drawText('MATCHED FILE', { x: 310, y: currentY, size: 8.5, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  coverPage.drawText('PAGES', { x: 460, y: currentY, size: 8.5, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  coverPage.drawText('EXPIRY', { x: 505, y: currentY, size: 8.5, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });

  currentY -= 6;
  coverPage.drawLine({ start: { x: 56, y: currentY }, end: { x: PAGE_WIDTH - 56, y: currentY }, thickness: 0.5, color: rgb(0.8, 0.85, 0.9) });

  currentY -= 14;
  for (let idx = 0; idx < matchedList.length; idx++) {
    const item = matchedList[idx];
    const itemNum = String(idx + 1).padStart(2, '0');
    coverPage.drawText(itemNum, { x: 56, y: currentY, size: 8, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    coverPage.drawText(item.req.id, { x: 76, y: currentY, size: 8, font: helveticaBold, color: rgb(0.1, 0.35, 0.7) });
    coverPage.drawText(item.req.title_en, { x: 120, y: currentY, size: 8, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    coverPage.drawText(item.file, { x: 310, y: currentY, size: 8, font: helvetica, color: rgb(0.2, 0.3, 0.4) });
    coverPage.drawText(item.expiry || 'N/A', { x: 505, y: currentY, size: 8, font: helvetica, color: item.expiry ? rgb(0.1, 0.6, 0.3) : rgb(0.5, 0.5, 0.5) });
    currentY -= 16;
  }

  // 2. Index Page
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

  indexPage.drawText(`Tender ID: ${tender.tender_id} | Total Documents: ${matchedList.length} | Package Volume: ${totalPackagePages} Pages`, {
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
  indexPage.drawText('SECTION', { x: 56, y: indexY, size: 9, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  indexPage.drawText('REQ ID', { x: 120, y: indexY, size: 9, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  indexPage.drawText('DOCUMENT DESCRIPTION', { x: 180, y: indexY, size: 9, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });
  indexPage.drawText('START PAGE', { x: 480, y: indexY, size: 9, font: helveticaBold, color: rgb(0.3, 0.35, 0.45) });

  indexY -= 8;
  indexPage.drawLine({ start: { x: 56, y: indexY }, end: { x: PAGE_WIDTH - 56, y: indexY }, thickness: 0.5, color: rgb(0.8, 0.85, 0.9) });
  indexY -= 20;

  indexPage.drawText('Dossier Cover', { x: 56, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
  indexPage.drawText('—', { x: 120, y: indexY, size: 9, font: helvetica, color: rgb(0.5, 0.5, 0.5) });
  indexPage.drawText('Official Tender Submission Cover', { x: 180, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
  indexPage.drawText('Page 1', { x: 480, y: indexY, size: 9, font: helveticaBold, color: rgb(0.04, 0.11, 0.22) });
  indexY -= 18;

  indexPage.drawText('Table of Contents', { x: 56, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
  indexPage.drawText('—', { x: 120, y: indexY, size: 9, font: helvetica, color: rgb(0.5, 0.5, 0.5) });
  indexPage.drawText('Section Registry & Pagination Index', { x: 180, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
  indexPage.drawText('Page 2', { x: 480, y: indexY, size: 9, font: helveticaBold, color: rgb(0.04, 0.11, 0.22) });
  indexY -= 20;

  let runningPageCounter = 3;
  for (let idx = 0; idx < matchedList.length; idx++) {
    const item = matchedList[idx];
    const buf = fs.readFileSync(path.join(docsDir, item.file));
    const srcDoc = await PDFDocument.load(buf);
    const pages = srcDoc.getPageCount();

    indexPage.drawText(`Section ${idx + 1}`, { x: 56, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    indexPage.drawText(item.req.id, { x: 120, y: indexY, size: 9, font: helveticaBold, color: rgb(0.1, 0.35, 0.7) });
    indexPage.drawText(item.req.title_en, { x: 180, y: indexY, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
    indexPage.drawText(`Page ${runningPageCounter}`, { x: 480, y: indexY, size: 9, font: helveticaBold, color: rgb(0.04, 0.11, 0.22) });

    indexY -= 18;
    runningPageCounter += pages;
  }

  // 3. Append All Source Pages
  for (const m of matchedList) {
    const buf = fs.readFileSync(path.join(docsDir, m.file));
    const srcDoc = await PDFDocument.load(buf);
    const copiedPages = await masterDoc.copyPages(srcDoc, srcDoc.getPageIndices());
    for (const p of copiedPages) {
      masterDoc.addPage(p);
    }
  }

  // 4. Apply Footers: "<tender_id> | Page X of Y"
  const allPages = masterDoc.getPages();
  const actualTotalPages = allPages.length;

  for (let pageIdx = 0; pageIdx < actualTotalPages; pageIdx++) {
    const page = allPages[pageIdx];
    const { width } = page.getSize();
    const pageNum = pageIdx + 1;
    const footerText = `${tender.tender_id} | Page ${pageNum} of ${actualTotalPages}`;

    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height: 28,
      color: rgb(0.98, 0.98, 0.99),
      opacity: 0.95,
    });

    page.drawLine({
      start: { x: 30, y: 28 },
      end: { x: width - 30, y: 28 },
      thickness: 0.5,
      color: rgb(0.8, 0.83, 0.88),
    });

    const textWidth = helveticaBold.widthOfTextAtSize(footerText, 8);
    page.drawText(footerText, {
      x: (width - textWidth) / 2,
      y: 11,
      size: 8,
      font: helveticaBold,
      color: rgb(0.2, 0.25, 0.35),
    });

    page.drawText('TENDERFORGE VERIFIED', {
      x: 36,
      y: 11,
      size: 6.5,
      font: helvetica,
      color: rgb(0.5, 0.55, 0.65),
    });
  }

  const pdfBytes = await masterDoc.save();
  const outPath = `./output/${tender.tender_id}_Package.pdf`;
  fs.writeFileSync(outPath, pdfBytes);
  console.log(`\n[SUCCESS] Generated package: ${outPath} (${pdfBytes.length} bytes, ${actualTotalPages} pages)`);
}

generateSamplePackage().catch(err => {
  console.error('Error generating package:', err);
  process.exit(1);
});
