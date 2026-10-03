import {
  aiResponse,
  alerts,
  businessProfile,
  calendarDeadlines,
  complianceTasks,
  dashboardSnapshot,
  domainConcentration,
  governmentSources,
  notifications,
  regulations,
} from '../data/seed';
import { delay } from './format';
import type {
  AiResponse,
  AlertItem,
  BusinessProfile,
  CalendarDeadline,
  ComplianceTask,
  DashboardSnapshot,
  DomainConcentration,
  GovernmentSource,
  NotificationItem,
  Regulation,
} from './types';

// Single service layer used by the whole frontend.
//
// Order of preference:
//   1. FastAPI backend at VITE_API_BASE_URL (real connectivity)
//   2. Deterministic seed corpus (offline / backend-not-running)
//
// Every call therefore always resolves, so the UI never hits a dead end.

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

/** Try the live backend; silently fall back to the seed corpus. */
async function withFallback<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    return await request<T>(path, init);
  } catch {
    await delay(120);
    return fallback;
  }
}

export const api = {
  getDashboard: () => withFallback<DashboardSnapshot>('/dashboard', dashboardSnapshot),
  getBusinessProfile: () => withFallback<BusinessProfile>('/business-profile', businessProfile),
  getSources: () => withFallback<GovernmentSource[]>('/sources', governmentSources),
  getRegulations: () => withFallback<Regulation[]>('/regulations', regulations),
  getRegulation: async (id: string) => {
    const fallback = regulations.find((r) => r.id === id) ?? regulations[0];
    return withFallback<Regulation>(`/regulations/${id}`, fallback);
  },
  getAlerts: () => withFallback<AlertItem[]>('/alerts', alerts),
  getTasks: () => withFallback<ComplianceTask[]>('/compliance/tasks', complianceTasks),
  getDomains: () => withFallback<DomainConcentration[]>('/regulations/domains', domainConcentration),
  getCalendar: () => withFallback<CalendarDeadline[]>('/calendar', calendarDeadlines),
  getNotifications: () => withFallback<NotificationItem[]>('/notifications', notifications),
  getAiResponse: (query?: string) =>
    withFallback<AiResponse>(
      '/ai/query',
      { ...aiResponse, question: query ? `“${query}”` : aiResponse.question },
      { method: 'POST', body: JSON.stringify({ query }) },
    ),
  /** Persist a created task (best-effort; demo mode resolves locally). */
  createTask: (payload: Partial<ComplianceTask>) =>
    withFallback<ComplianceTask>(
      '/compliance/tasks',
      {
        id: `task-${Date.now()}`,
        title: payload.title ?? 'New compliance task',
        regulationId: payload.regulationId ?? 'reg-dish-cr-88',
        regulationRef: payload.regulationRef ?? 'DISH/2025/CR-88',
        status: 'pending',
        priority: payload.priority ?? 'high',
        assignedTo: payload.assignedTo ?? 'Elena Vance',
        ownerInitials: payload.ownerInitials ?? 'EV',
        dueDate: payload.dueDate ?? '30 Oct 2025',
        primaryCategory: payload.primaryCategory ?? 'Industrial Safety',
        actions: payload.actions ?? '',
        progress: 0,
      },
      { method: 'POST', body: JSON.stringify(payload) },
    ),
};

export type Api = typeof api;
