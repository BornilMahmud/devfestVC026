import {
  DocumentRequirement,
  UploadedFile,
  DocumentMatch,
  RequirementValidation,
  RequirementStatus,
  ReadinessSummary,
  TenderMetadata,
} from '../types';
import { findDuplicateMatchConflicts } from './hashing';

/**
 * Deterministic status evaluation for a single requirement
 */
export function evaluateRequirementStatus(
  requirement: DocumentRequirement,
  match: DocumentMatch | undefined,
  matchedFile: UploadedFile | undefined,
  submissionDeadline: string
): { status: RequirementStatus; isBlocking: boolean; message_en: string; message_bn: string } {
  // Case 1: No file matched
  if (!match || !matchedFile) {
    if (requirement.mandatory) {
      return {
        status: 'MISSING',
        isBlocking: true,
        message_en: 'Mandatory document is missing.',
        message_bn: 'বাধ্যতামূলক নথিটি অনুপস্থিত।',
      };
    } else {
      return {
        status: 'NOT_PROVIDED',
        isBlocking: false,
        message_en: 'Optional document not provided.',
        message_bn: 'ঐচ্ছিক নথি সরবরাহ করা হয়নি।',
      };
    }
  }

  // Case 2: File is corrupted or unreadable
  if (matchedFile.isCorrupt || matchedFile.error) {
    return {
      status: 'MISSING',
      isBlocking: true,
      message_en: `File error: ${matchedFile.error || 'Corrupted PDF file.'}`,
      message_bn: `নথিতে ত্রুটি: ${matchedFile.error || 'ক্ষতিগ্রস্ত পিডিএফ ফাইল।'}`,
    };
  }

  // Case 3: Expiry checking
  if (requirement.has_expiry) {
    if (!match.expiryDate || match.expiryDate.trim() === '') {
      return {
        status: 'EXPIRY_NEEDED',
        isBlocking: true,
        message_en: 'Expiry date is required for this document.',
        message_bn: 'এই নথির জন্য মেয়াদ উত্তীর্ণের তারিখ আবশ্যক।',
      };
    }

    const expiryDateStr = match.expiryDate.trim();
    const deadlineStr = submissionDeadline.trim();

    // Direct ISO string comparison (YYYY-MM-DD works lexicographically)
    if (expiryDateStr < deadlineStr) {
      return {
        status: 'EXPIRED',
        isBlocking: true,
        message_en: `Document expires on ${expiryDateStr}, before deadline ${deadlineStr}.`,
        message_bn: `নথির মেয়াদ ${expiryDateStr} তারিখে শেষ, যা জমার শেষ তারিখ ${deadlineStr}-এর পূর্বে।`,
      };
    }
  }

  // Case 4: Everything valid
  return {
    status: 'OK',
    isBlocking: false,
    message_en: 'Document verified and valid.',
    message_bn: 'নথি যাচাইকৃত ও বৈধ।',
  };
}

/**
 * Centrally validates all requirements against matches and files
 */
export function validateAllRequirements(
  requirements: DocumentRequirement[],
  matches: DocumentMatch[],
  files: UploadedFile[],
  tender: TenderMetadata
): {
  validations: RequirementValidation[];
  readiness: ReadinessSummary;
} {
  const matchMap = new Map<string, DocumentMatch>(matches.map((m) => [m.requirementId, m]));
  const fileMap = new Map<string, UploadedFile>(files.map((f) => [f.id, f]));

  // Sort requirements by order ascending
  const sortedRequirements = [...requirements].sort((a, b) => a.order - b.order);

  const validations: RequirementValidation[] = sortedRequirements.map((req) => {
    const match = matchMap.get(req.id);
    const matchedFile = match ? fileMap.get(match.fileId) : undefined;
    const evaluation = evaluateRequirementStatus(req, match, matchedFile, tender.submission_deadline);

    return {
      requirement: req,
      status: evaluation.status,
      isBlocking: evaluation.isBlocking,
      matchedFile,
      expiryDate: match?.expiryDate,
      message_en: evaluation.message_en,
      message_bn: evaluation.message_bn,
    };
  });

  // Check for duplicate conflicts (same file matched to multiple requirements)
  const duplicateConflicts = findDuplicateMatchConflicts(matches, files);

  // Compute readiness
  const total = requirements.length;
  const mandatoryCount = requirements.filter((r) => r.mandatory).length;
  const optionalCount = total - mandatoryCount;

  let readyCount = 0;
  let missingMandatoryCount = 0;
  let expiryIssueCount = 0;
  const blockers: { en: string; bn: string }[] = [];

  for (const v of validations) {
    if (v.status === 'OK') {
      readyCount++;
    } else if (v.status === 'MISSING') {
      missingMandatoryCount++;
      blockers.push({
        en: `Missing required: [${v.requirement.id}] ${v.requirement.title_en}`,
        bn: `অনুপস্থিত বাধ্যতামূলক: [${v.requirement.id}] ${v.requirement.title_bn}`,
      });
    } else if (v.status === 'EXPIRY_NEEDED') {
      expiryIssueCount++;
      blockers.push({
        en: `Expiry date needed: [${v.requirement.id}] ${v.requirement.title_en}`,
        bn: `মেয়াদ উত্তীর্ণের তারিখ প্রয়োজন: [${v.requirement.id}] ${v.requirement.title_bn}`,
      });
    } else if (v.status === 'EXPIRED') {
      expiryIssueCount++;
      blockers.push({
        en: `Expired document: [${v.requirement.id}] ${v.requirement.title_en}`,
        bn: `মেয়াদোত্তীর্ণ নথি: [${v.requirement.id}] ${v.requirement.title_bn}`,
      });
    }
  }

  // Duplicate conflict blockers
  for (const dup of duplicateConflicts) {
    const reqList = dup.requirementIds.join(', ');
    const fileList = dup.fileNames.join(', ');
    blockers.push({
      en: `Duplicate content reused across requirements: ${reqList} (${fileList})`,
      bn: `একই নথি একাধিক বিধিতে ব্যবহৃত হয়েছে: ${reqList} (${fileList})`,
    });
  }

  // Readiness percentage: based on mandatory requirements satisfaction + optional contribution
  // If mandatory is 100% satisfied and no blockers, score can reach 100%.
  const mandatoryReady = validations.filter((v) => v.requirement.mandatory && v.status === 'OK').length;
  const optionalReady = validations.filter((v) => !v.requirement.mandatory && v.status === 'OK').length;
  
  // Weight mandatory 85% and optional 15% (or proportional)
  const percentage = total > 0 
    ? Math.round(((mandatoryReady * 1.5 + optionalReady) / (mandatoryCount * 1.5 + optionalCount)) * 100) 
    : 0;

  const isReady = blockers.length === 0 && mandatoryReady === mandatoryCount;

  const readiness: ReadinessSummary = {
    percentage: isReady ? 100 : Math.min(percentage, 95),
    isReady,
    totalRequirements: total,
    mandatoryCount,
    optionalCount,
    readyCount,
    missingCount: missingMandatoryCount,
    expiryIssueCount,
    duplicateConflictCount: duplicateConflicts.length,
    blockers,
  };

  return { validations, readiness };
}
