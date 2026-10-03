"""
Pydantic models — kept in sync with frontend/src/lib/types.ts.
Field names match the TypeScript interfaces exactly so JSON serialisation
is transparent across the wire.
"""

from __future__ import annotations
from typing import Literal, Optional
from pydantic import BaseModel


# ─── Shared enumerations ────────────────────────────────────────────────────

Relevance = Literal["critical", "high", "medium", "low"]
RegulationStatus = Literal[
    "Action Required", "Review Needed", "Informational", "Compliant", "In Effect"
]
SourceProvenance = Literal["official", "ai"]


# ─── User Profile ─────────────────────────────────────────────────────────────

class UserProfile(BaseModel):
    uid: str
    name: str
    email: str
    role: str = "Compliance Lead"
    initials: str = "EV"
    provider: str = "password"
    businessId: str = "biz-precision-fab-pune"
    onboarded: bool = True


class UpdateUserProfileRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    businessId: Optional[str] = None
    onboarded: Optional[bool] = None



# ─── Business Profile ────────────────────────────────────────────────────────

class ClassificationEntry(BaseModel):
    label: str
    value: str
    rating: Optional[str] = None


class BusinessProfile(BaseModel):
    id: str
    name: str
    entity: str
    sector: str
    jurisdiction: str
    location: str
    employees: int
    licenseNo: str
    boilerCategory: str
    pollutionCategory: str
    turnover: str
    shifts: str
    taxRegime: str
    operatingMarket: str
    logoInitials: str
    classification: list[ClassificationEntry]
    completion: int


# ─── Government Sources ──────────────────────────────────────────────────────

class GovernmentSource(BaseModel):
    id: str
    code: str
    name: str
    department: str
    jurisdiction: str
    lastSynced: str


# ─── Regulations ─────────────────────────────────────────────────────────────

class ReasoningStep(BaseModel):
    step: str
    label: str
    detail: str


class RegulationDocument(BaseModel):
    label: str
    meta: str


class Regulation(BaseModel):
    id: str
    title: str
    shortTitle: str
    authority: str
    authorityCode: str
    gazetteId: str
    jurisdiction: str
    category: str
    publishedDate: str
    effectiveDate: str
    relevance: Relevance
    relevanceScore: int
    status: RegulationStatus
    domain: str
    impactTag: str
    summary: str
    affectedBusiness: list[str]
    impactQuote: str
    beforeChange: str
    nowChange: str
    reasoningChain: list[ReasoningStep]
    helpedSynthesis: Optional[str] = None
    documents: list[RegulationDocument]
    sourceProvenance: SourceProvenance


# ─── Alerts ──────────────────────────────────────────────────────────────────

class AlertItem(BaseModel):
    id: str
    regulationId: str
    title: str
    authorityCode: str
    severity: Literal["critical", "warning", "info"]
    status: Literal["Action Required", "Review Needed", "Informational"]
    published: str
    effective: str
    detail: str
    requiresAction: bool
    actionable: str


# ─── Compliance Tasks ─────────────────────────────────────────────────────────

class ComplianceTask(BaseModel):
    id: str
    title: str
    regulationId: str
    regulationRef: str
    status: Literal["pending", "in_progress", "completed", "overdue"]
    priority: Literal["critical", "high", "medium", "low"]
    assignedTo: str
    ownerInitials: str
    dueDate: str
    primaryCategory: str
    actions: str
    progress: int


class CreateTaskRequest(BaseModel):
    title: str
    regulationId: Optional[str] = "reg-dish-cr-88"
    regulationRef: Optional[str] = ""
    priority: Literal["critical", "high", "medium", "low"] = "medium"
    assignedTo: Optional[str] = "Elena Vance"
    ownerInitials: Optional[str] = "EV"
    dueDate: Optional[str] = ""
    primaryCategory: Optional[str] = ""
    actions: Optional[str] = ""


class UpdateTaskRequest(BaseModel):
    status: Literal["pending", "in_progress", "completed", "overdue"]
    progress: Optional[int] = None


# ─── Domain Concentration ────────────────────────────────────────────────────

class DomainConcentration(BaseModel):
    id: str
    domain: str
    code: str
    requirement: str
    count: int
    trend: list[int]
    impact: Literal["High Impact", "Apply", "Monitor"]
    relevance: int


# ─── Dashboard ───────────────────────────────────────────────────────────────

class DashboardMetrics(BaseModel):
    newUpdates: int
    newUpdatesDelta: str
    relevant: int
    relevantMatch: str
    actionRequired: int
    actionPriority: str
    dueSoon: int
    dueRisk: str


class PipelineStage(BaseModel):
    code: str
    label: str
    count: int
    meta: str
    state: str


class HealthBreakdown(BaseModel):
    label: str
    value: int
    status: str
    tone: str


class ComplianceHealth(BaseModel):
    overall: int
    rating: str
    note: str
    breakdown: list[HealthBreakdown]


class DashboardSnapshot(BaseModel):
    greetingName: str
    dossierId: str
    lastSync: str
    sourcesSynced: str
    sourcesScraped: str
    metrics: DashboardMetrics
    pipeline: list[PipelineStage]
    complianceHealth: ComplianceHealth


# ─── Calendar ────────────────────────────────────────────────────────────────

class CalendarDeadline(BaseModel):
    id: str
    date: str
    isoDate: str
    daysLeft: int
    title: str
    detail: str
    tone: Literal["critical", "primary", "neutral"]
    cycle: str


# ─── Notifications ───────────────────────────────────────────────────────────

class NotificationItem(BaseModel):
    id: str
    title: str
    body: str
    category: str
    timestamp: str
    read: bool


# ─── AI ──────────────────────────────────────────────────────────────────────

class AiQueryRequest(BaseModel):
    query: Optional[str] = None


class AiCitation(BaseModel):
    authority: str
    notification: str
    clause: str
    gazette: str
    excerpt: str
    pdfLabel: str
    verified: bool


class BusinessLogic(BaseModel):
    targetEntity: str
    matchedClause: str
    nicCode: str
    zone: str
    applicability: str


class OperationalStep(BaseModel):
    step: int
    title: str
    detail: str


class AiResponse(BaseModel):
    id: str
    question: str
    askedBy: str
    askedAt: str
    confidence: int
    latencyMs: int
    executiveSynthesis: str
    businessLogic: BusinessLogic
    citations: list[AiCitation]
    operationalSteps: list[OperationalStep]
    statutoryDeadline: str
    suggestedQueries: list[str]
