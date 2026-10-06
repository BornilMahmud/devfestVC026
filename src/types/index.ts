export interface TenderMetadata {
  tender_id: string;
  title: string;
  procuring_entity: string;
  bidder: string;
  submission_deadline: string; // YYYY-MM-DD
}

export interface DocumentRequirement {
  id: string;
  order: number;
  title_en: string;
  title_bn: string;
  mandatory: boolean;
  has_expiry: boolean;
}

export interface RequirementsConfig {
  tender: TenderMetadata;
  requirements: DocumentRequirement[];
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pages: number;
  hash: string;
  isEncrypted?: boolean;
  isCorrupt?: boolean;
  error?: string;
  arrayBuffer: ArrayBuffer;
}

export type RequirementStatus = 'MISSING' | 'EXPIRY_NEEDED' | 'EXPIRED' | 'NOT_PROVIDED' | 'OK';

export interface DocumentMatch {
  requirementId: string;
  fileId: string;
  expiryDate?: string; // YYYY-MM-DD
}

export interface RequirementValidation {
  requirement: DocumentRequirement;
  status: RequirementStatus;
  isBlocking: boolean;
  matchedFile?: UploadedFile;
  expiryDate?: string;
  message_en: string;
  message_bn: string;
}

export interface DuplicateGroup {
  hash: string;
  files: UploadedFile[];
}

export interface ReadinessSummary {
  percentage: number;
  isReady: boolean;
  totalRequirements: number;
  mandatoryCount: number;
  optionalCount: number;
  readyCount: number;
  missingCount: number;
  expiryIssueCount: number;
  duplicateConflictCount: number;
  blockers: { en: string; bn: string }[];
}

export type Language = 'en' | 'bn';
