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
import { auth } from './firebase';
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
  UserAccount,
} from './types';

// Single service layer used by the whole frontend.
//
// Order of preference:
//   1. FastAPI backend at VITE_API_BASE_URL (real connectivity)
//   2. Deterministic seed corpus (offline / backend-not-running)
//
// Every call therefore always resolves, so the UI never hits a dead end.

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';

/** Get the Firebase ID token if a user is signed in, otherwise null. */
async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    if (auth?.currentUser) {
      const token = await auth.currentUser.getIdToken();
      return { Authorization: `Bearer ${token}` };
    }
  } catch {
    // Token unavailable — backend will use demo mode
  }
  return {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const authHeaders = await getAuthHeader();
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
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
  getUserProfile: () =>
    withFallback<UserAccount>('/user-profile', {
      uid: 'demo-user-001',
      name: 'Elena Vance',
      email: 'elena.vance@precisionfab.in',
      role: 'Compliance Lead',
      initials: 'EV',
      provider: 'password',
      businessId: 'biz-precision-fab-pune',
      onboarded: true,
    }),
  updateUserProfile: (payload: Partial<UserAccount>) =>
    withFallback<UserAccount>(
      '/user-profile',
      {
        uid: 'demo-user-001',
        name: payload.name ?? 'Elena Vance',
        email: payload.email ?? 'elena.vance@precisionfab.in',
        role: payload.role ?? 'Compliance Lead',
        initials: payload.name ? payload.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'EV',
        provider: 'password',
        businessId: payload.businessId ?? 'biz-precision-fab-pune',
        onboarded: true,
      },
      { method: 'PUT', body: JSON.stringify(payload) },
    ),
  getDashboard: () => withFallback<DashboardSnapshot>('/dashboard', dashboardSnapshot),
  getBusinessProfile: () => withFallback<BusinessProfile>('/business-profile', businessProfile),
  updateBusinessProfile: (payload: Partial<BusinessProfile>) => {
    const updated = { ...businessProfile, ...payload };
    return withFallback<BusinessProfile>(
      '/business-profile',
      updated,
      { method: 'PUT', body: JSON.stringify(updated) },
    );
  },
  getSources: () => withFallback<GovernmentSource[]>('/sources', governmentSources),
  getRegulations: () => withFallback<Regulation[]>('/regulations', regulations),
  getRegulation: async (id: string) => {
    const fallback = regulations.find((r) => r.id === id) ?? regulations[0];
    return withFallback<Regulation>(`/regulations/${id}`, fallback);
  },
  getAlerts: () => withFallback<AlertItem[]>('/alerts', alerts),
  markAlertRead: (id: string) => {
    const fallback = alerts.find((a) => a.id === id) ?? alerts[0];
    return withFallback<AlertItem>(
      `/alerts/${id}/read`,
      { ...fallback, requiresAction: false, status: 'Review Needed' },
      { method: 'PUT' },
    );
  },
  getTasks: () => withFallback<ComplianceTask[]>('/compliance/tasks', complianceTasks),
  getDomains: () => withFallback<DomainConcentration[]>('/regulations/domains', domainConcentration),
  getCalendar: () => withFallback<CalendarDeadline[]>('/calendar', calendarDeadlines),
  getNotifications: () => withFallback<NotificationItem[]>('/notifications', notifications),
  markNotificationRead: (id: string) => {
    const fallback = notifications.find((n) => n.id === id) ?? notifications[0];
    return withFallback<NotificationItem>(
      `/notifications/${id}/read`,
      { ...fallback, read: true },
      { method: 'PUT' },
    );
  },
  getAiResponse: (query?: string) =>
    withFallback<AiResponse>(
      '/ai/query',
      { ...aiResponse, question: query ? `"${query}"` : aiResponse.question },
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
  /** Update a task's status on the backend (best-effort). */
  updateTask: (id: string, status: ComplianceTask['status'], progress?: number) => {
    const existing = complianceTasks.find((t) => t.id === id) ?? complianceTasks[0];
    const fallback: ComplianceTask = {
      ...existing,
      id,
      status,
      progress: progress ?? (status === 'completed' ? 100 : existing.progress),
    };
    return withFallback<ComplianceTask>(
      `/compliance/tasks/${id}`,
      fallback,
      { method: 'PUT', body: JSON.stringify({ status, progress }) },
    );
  },
};

export type Api = typeof api;
