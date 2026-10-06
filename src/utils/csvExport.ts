import { RequirementValidation, TenderMetadata } from '../types';

/**
 * Generates and triggers download of the requirement checklist as CSV
 */
export function exportChecklistToCSV(tender: TenderMetadata, validations: RequirementValidation[]): void {
  const headers = ['Order', 'Requirement ID', 'Title (EN)', 'Title (BN)', 'Mandatory', 'Matched Filename', 'Pages', 'Expiry Date', 'Status', 'Verification Message'];
  
  const rows = validations.map((v) => [
    v.requirement.order,
    `"${v.requirement.id}"`,
    `"${v.requirement.title_en.replace(/"/g, '""')}"`,
    `"${v.requirement.title_bn.replace(/"/g, '""')}"`,
    v.requirement.mandatory ? 'YES' : 'NO',
    v.matchedFile ? `"${v.matchedFile.name.replace(/"/g, '""')}"` : 'NONE',
    v.matchedFile ? v.matchedFile.pages : 0,
    v.expiryDate || 'N/A',
    v.status,
    `"${v.message_en.replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    `# TENDER COMPLIANCE CHECKLIST REPORT`,
    `# Tender ID: ${tender.tender_id}`,
    `# Title: ${tender.title}`,
    `# Deadline: ${tender.submission_deadline}`,
    `# Generated: ${new Date().toISOString()}`,
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${tender.tender_id}_Checklist.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
