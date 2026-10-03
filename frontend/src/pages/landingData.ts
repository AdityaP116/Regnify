// Static content for the public landing page, mirroring the reference
// design-reference/regnify_landing_page/code.html sections.

export const heroStats = [
  { value: '14,482', label: 'Gazettes Indexed' },
  { value: '1,148', label: 'Updates / Day' },
  { value: '98%', label: 'Match Accuracy' },
  { value: '11 sec', label: 'Sync Latency' },
];

export const intelligenceColumns = [
  { code: '01', icon: 'account_balance', title: 'Government Sources', items: ['48+ federal & state portals', 'Gazettes, circulars, notifications', 'Real-time scraping & verification'], tone: 'primary' },
  { code: '02', icon: 'neurology', title: 'Regnify Process', items: ['Deterministic NLP extraction', 'Statutory clause anchoring', 'Provenance preserved end-to-end'], tone: 'ai' },
  { code: '03', icon: 'auto_awesome', title: 'AI Understands', items: ['Plain-language synthesis', 'Before / after diffing', 'Confidence scoring'], tone: 'ai' },
  { code: '04', icon: 'factory', title: 'Business Matching', items: ['Sector, jurisdiction, NIC codes', 'Workforce & threshold checks', 'Relevance scoring'], tone: 'primary' },
  { code: '05', icon: 'directions_run', title: 'Action Required', items: ['Prioritized directives', 'Owner assignment', 'Deadline routing'], tone: 'warning' },
  { code: '06', icon: 'verified_user', title: 'Track Compliance', items: ['Command-center oversight', 'Audit-ready evidence', 'Closed-loop resolution'], tone: 'success' },
];

export const workflowSteps = [
  { n: '01. Mandate', icon: 'gavel', label: 'Regulation' },
  { n: '02. Specifics', icon: 'rule', label: 'Requirement' },
  { n: '03. Directive', icon: 'directions_run', label: 'Action' },
  { n: '04. Assignment', icon: 'checklist', label: 'Task' },
  { n: '05. Timeline', icon: 'alarm', label: 'Deadline' },
  { n: '06. Shield', icon: 'verified', label: 'Compliance 100%' },
];

export const heroRows = [
  { authority: 'CBIC • Notif 14/2025', domain: 'Customs / Indirect Tax', requirement: 'Mandatory RFID GPS e-seal verification on bonded transshipments', entity: 'Nova Logistics (MH, GJ)', status: 'Vendor RFP Issued', due: '01 Nov 2025', dueTone: 'text-error' },
  { authority: 'MoEFCC • S.O. 4112(E)', domain: 'Environmental Protection', requirement: 'Continuous Emission Monitoring Systems (CEMS) telemetry calibration', entity: 'Pune Unit 01', status: 'Calibration Completed', due: '15 Dec 2025', dueTone: 'text-on-surface-variant' },
  { authority: 'MCA • General Cir. 03/2025', domain: 'Corporate Governance', requirement: 'Revised disclosures on significant beneficial ownership (SBO) filings', entity: 'All Registered Subsidiaries', status: 'Under Legal Audit', due: '30 Jan 2026', dueTone: 'text-on-surface-variant' },
];

export const dashboardTableRows = [
  { authority: 'DISH • CR-88', domain: 'Industrial Safety', requirement: 'Automated fire suppression telemetry retrofitting', entity: 'Precision Fab Ltd (Pune)', status: 'Action Required', due: '15 Nov 2025', tone: 'critical' },
  { authority: 'CPCB • B-190188', domain: 'Environment', requirement: 'Continuous effluent telemetry log mandate', entity: 'Precision Fab Ltd (Pune)', status: 'Action Required', due: '10 Oct 2025', tone: 'critical' },
  { authority: 'ESIC • 2025-09', domain: 'Labour & Employment', requirement: 'Wage ceiling revision & contribution realignment', entity: 'All establishments', status: 'Review Needed', due: '15 Oct 2025', tone: 'warning' },
  { authority: 'CBIC • 27/2025', domain: 'Taxation', requirement: 'Input tax credit recalculation rules', entity: 'Finance & Accounts', status: 'Informational', due: '01 Nov 2025', tone: 'info' },
];

export const problemPoints = [
  'Notification arrives as 80-page PDFs and gazette attachments',
  'Statutory language requires specialist legal interpretation',
  'Business relevance is not obvious from the text',
  'Deadlines and enforcement windows are buried',
];

export const solutionPoints = [
  'Continuous monitoring across 48+ official portals',
  'AI synthesis in plain operational language',
  'Exact business-profile matching (sector, jurisdiction, thresholds)',
  'Prioritized, owner-assigned compliance tasks',
];

export function toneClasses(tone: string): string {
  switch (tone) {
    case 'ai':
      return 'bg-[#EEF2FF] text-ai-indigo';
    case 'warning':
      return 'bg-[#fef3c7] text-[#b45309]';
    case 'success':
      return 'bg-[#dcfce7] text-[#15803d]';
    case 'critical':
      return 'bg-error-container text-on-error-container';
    case 'info':
      return 'bg-surface-container text-on-surface-variant';
    default:
      return 'bg-primary/10 text-primary';
  }
}
