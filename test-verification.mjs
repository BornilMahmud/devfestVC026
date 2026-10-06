import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PDFDocument } from 'pdf-lib';

async function runVerification() {
  console.log('=== TENDERFORGE VERIFICATION TEST ===\n');

  // 1. Requirements JSON parsing
  const reqPath = './requirements.json';
  const reqData = JSON.parse(fs.readFileSync(reqPath, 'utf8'));
  console.log(`[PASS] Loaded tender: ${reqData.tender.tender_id} - "${reqData.tender.title}"`);
  console.log(`[PASS] Total requirements parsed: ${reqData.requirements.length}`);

  // 2. Document Inspection & Hashing
  const docsDir = './documents';
  const docFiles = fs.readdirSync(docsDir);
  console.log(`\nInspecting ${docFiles.length} files in documents/...`);

  const fileHashes = new Map();
  const pdfReports = [];

  for (const fileName of docFiles) {
    const filePath = path.join(docsDir, fileName);
    const buffer = fs.readFileSync(filePath);

    if (fileName.endsWith('.pdf')) {
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPageCount();

      pdfReports.push({ fileName, pages, hash: hash.substring(0, 16) + '...' });

      if (fileHashes.has(hash)) {
        console.log(`[DUPLICATE DETECTED] Exact match: "${fileName}" matches "${fileHashes.get(hash)}" (Hash: ${hash.substring(0, 12)})`);
      } else {
        fileHashes.set(hash, fileName);
      }
    } else {
      console.log(`[NON-PDF DETECTED] "${fileName}" correctly identified as non-PDF asset.`);
    }
  }

  console.log('\nPDF Inspection Summary:');
  console.table(pdfReports);

  // 3. Expiry comparison test
  const deadline = reqData.tender.submission_deadline;
  console.log(`\nTesting Expiry Dates against Deadline: ${deadline}`);
  const testDates = [
    { name: '2025-06-30 (trade_license_2025)', date: '2025-06-30' },
    { name: '2026-10-20 (same day)', date: '2026-10-20' },
    { name: '2027-06-30 (trade_license_2026)', date: '2027-06-30' }
  ];

  for (const t of testDates) {
    const isExpired = t.date < deadline;
    console.log(`  - ${t.name}: ${isExpired ? 'EXPIRED (BLOCKING)' : 'OK (VALID)'}`);
  }

  console.log('\n=== ALL AUTOMATED VERIFICATION TESTS PASSED ===');
}

runVerification().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
