import { DocumentRequirement, UploadedFile, DocumentMatch } from '../types';

/**
 * Normalizes text by removing extensions, underscores, dashes, numbers, and common noise words
 */
function normalizeString(str: string): string[] {
  return str
    .toLowerCase()
    .replace(/\.pdf$/i, '')
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !['the', 'of', 'and', 'for', 'copy', 'scan', 'doc'].includes(w));
}

/**
 * Calculates similarity score between a filename and requirement title
 */
function calculateMatchScore(filename: string, req: DocumentRequirement): number {
  const fileTokens = normalizeString(filename);
  const titleTokens = normalizeString(req.title_en);

  let score = 0;
  for (const fToken of fileTokens) {
    for (const tToken of titleTokens) {
      if (fToken === tToken) {
        score += 2;
      } else if (fToken.includes(tToken) || tToken.includes(fToken)) {
        score += 1;
      }
    }
  }

  // Exact phrase check
  const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanTitle = req.title_en.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (cleanFileName === cleanTitle) {
    return 100;
  }
  if (cleanFileName.includes(cleanTitle)) {
    return 50;
  }
  if (cleanTitle.includes(cleanFileName)) {
    return 40;
  }
}

/**
 * Produces suggested matches without overriding existing manual matches
 */
export function generateAutoMatches(
  requirements: DocumentRequirement[],
  files: UploadedFile[],
  existingMatches: DocumentMatch[]
): DocumentMatch[] {
  const matchedReqIds = new Set(existingMatches.map((m) => m.requirementId));
  const matchedFileIds = new Set(existingMatches.map((m) => m.fileId));

  const availableReqs = requirements.filter((r) => !matchedReqIds.has(r.id));
  const availableFiles = files.filter((f) => !matchedFileIds.has(f.id) && !f.isCorrupt && !f.error);

  const newMatches: DocumentMatch[] = [...existingMatches];
  const usedFileIds = new Set(matchedFileIds);

  for (const req of availableReqs) {
    let bestFile: UploadedFile | null = null;
    let bestScore = 0;

    for (const file of availableFiles) {
      if (usedFileIds.has(file.id)) continue;
      const score = calculateMatchScore(file.name, req);
      if (score > bestScore && score >= 2) {
        bestScore = score;
        bestFile = file;
      }
    }

    if (bestFile) {
      newMatches.push({
        requirementId: req.id,
        fileId: bestFile.id,
      });
      usedFileIds.add(bestFile.id);
    }
  }

  return newMatches;
}
