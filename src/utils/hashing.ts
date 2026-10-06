import { UploadedFile, DocumentMatch } from '../types';

/**
 * Computes SHA-256 hex digest using native Web Crypto API in-browser
 */
export async function computeSHA256(arrayBuffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Groups files by SHA-256 hash. Returns only hashes with more than 1 file (duplicates)
 */
export function getDuplicateGroups(files: UploadedFile[]): Map<string, UploadedFile[]> {
  const groups = new Map<string, UploadedFile[]>();
  for (const file of files) {
    if (!file.hash) continue;
    const existing = groups.get(file.hash) || [];
    existing.push(file);
    groups.set(file.hash, existing);
  }

  // Filter to only groups with duplicates (> 1 file)
  const duplicatesOnly = new Map<string, UploadedFile[]>();
  for (const [hash, groupFiles] of groups.entries()) {
    if (groupFiles.length > 1) {
      duplicatesOnly.set(hash, groupFiles);
    }
  }
  return duplicatesOnly;
}

/**
 * Validates if two duplicate files (same content) are matched to different requirements.
 * Returns array of conflict objects if any rule violation exists.
 */
export function findDuplicateMatchConflicts(
  matches: DocumentMatch[],
  files: UploadedFile[]
): { hash: string; requirementIds: string[]; fileNames: string[] }[] {
  const fileMap = new Map<string, UploadedFile>(files.map((f) => [f.id, f]));
  const hashToReqs = new Map<string, { reqIds: string[]; fileNames: string[] }>();

  for (const match of matches) {
    const file = fileMap.get(match.fileId);
    if (!file || !file.hash) continue;

    const current = hashToReqs.get(file.hash) || { reqIds: [], fileNames: [] };
    current.reqIds.push(match.requirementId);
    current.fileNames.push(file.name);
    hashToReqs.set(file.hash, current);
  }

  const conflicts: { hash: string; requirementIds: string[]; fileNames: string[] }[] = [];
  for (const [hash, data] of hashToReqs.entries()) {
    // If the same content is used across multiple different requirements
    if (data.reqIds.length > 1) {
      conflicts.push({
        hash,
        requirementIds: data.reqIds,
        fileNames: data.fileNames,
      });
    }
  }

  return conflicts;
}
