// Domain model shared with the FastAPI layer (backend/app/models.py).
// Keep field names aligned with the Firestore collection documents described
// in DESIGN/README: users, businesses, regulations, alerts, complianceTasks,
// governmentSources, documents, notifications.

export type Relevance = 'critical' | 'high' | 'medium' | 'low';
export type RegulationStatus =
  | 'Action Required'
  | 'Review Needed'
  | 'Informational'
  | 'Compliant'
  | 'In Effect';

export type SourceProvenance = 'official' | 'ai';

export interface BusinessProfile {
  id: string;
  name: string;
  entity: string;
  sector: string;
  jurisdiction: string;
  location: string;
  employees: number;
  licenseNo: string;
  boilerCategory: string;
  pollutionCategory: string;
  turnover: string;
  shifts: string;
  taxRegime: string;
  operatingMarket: string;
  logoInitials: string;
  classification: { label: string; value: string; rating?: string }[];
  completion: number;
}

export interface GovernmentSource {
  id: string;
  code: string;
  name: string;
  department: string;
  jurisdiction: string;
  lastSynced: string;
}

export interface Regulation {
  id: string;
  title: string;
  shortTitle: string;
  authority: string;
  authorityCode: string;
  gazetteId: string;
  jurisdiction: string;
  category: string;
  publishedDate: string;
  effectiveDate: string;
  relevance: Relevance;
  relevanceScore: number;
  status: RegulationStatus;
  domain: string;
  impactTag: string;
  summary: string;
  affectedBusiness: string[];
  impactQuote: string;
  beforeChange: string;
  nowChange: string;
  reasoningChain: { step: string; label: string; detail: string }[];
  helpedSynthesis?: string;
  documents: { label: string; meta: string }[];
  sourceProvenance: SourceProvenance;
}

export interface AlertItem {
  id: string;
  regulationId: string;
  title: string;
  authorityCode: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'Action Required' | 'Review Needed' | 'Informational';
  published: string;
  effective: string;
  detail: string;
  requiresAction: boolean;
  actionable: string;
}

export interface ComplianceTask {
  id: string;
  title: string;
  regulationId: string;
  regulationRef: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTo: string;
  ownerInitials: string;
  dueDate: string;
  primaryCategory: string;
  actions: string;
  progress: number;
}

export interface DomainConcentration {
  id: string;
  domain: string;
  code: string;
  requirement: string;
  count: number;
  trend: number[];
  impact: 'High Impact' | 'Apply' | 'Monitor';
  relevance: number;
}

export interface AiCitation {
  authority: string;
  notification: string;
  clause: string;
  gazette: string;
  excerpt: string;
  pdfLabel: string;
  verified: boolean;
}

export interface AiResponse {
  id: string;
  question: string;
  askedBy: string;
  askedAt: string;
  confidence: number;
  latencyMs: number;
  executiveSynthesis: string;
  businessLogic: {
    targetEntity: string;
    matchedClause: string;
    nicCode: string;
    zone: string;
    applicability: string;
  };
  citations: AiCitation[];
  operationalSteps: { step: number; title: string; detail: string }[];
  statutoryDeadline: string;
  suggestedQueries: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: string;
  timestamp: string;
  read: boolean;
}

export interface CalendarDeadline {
  id: string;
  date: string;
  isoDate: string;
  daysLeft: number;
  title: string;
  detail: string;
  tone: 'critical' | 'primary' | 'neutral';
  cycle: string;
}

export interface DashboardSnapshot {
  greetingName: string;
  dossierId: string;
  lastSync: string;
  sourcesSynced: string;
  sourcesScraped: string;
  metrics: {
    newUpdates: number;
    newUpdatesDelta: string;
    relevant: number;
    relevantMatch: string;
    actionRequired: number;
    actionPriority: string;
    dueSoon: number;
    dueRisk: string;
  };
  pipeline: { code: string; label: string; count: number; meta: string; state: string }[];
  complianceHealth: {
    overall: number;
    rating: string;
    note: string;
    breakdown: { label: string; value: number; status: string; tone: string }[];
  };
}

export interface UserAccount {
  uid: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  provider: string;
  businessId: string;
  onboarded: boolean;
}