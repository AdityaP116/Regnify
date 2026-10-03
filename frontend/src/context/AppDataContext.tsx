import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../lib/api';
import type {
  AlertItem,
  BusinessProfile,
  CalendarDeadline,
  ComplianceTask,
  DashboardSnapshot,
  DomainConcentration,
  GovernmentSource,
  NotificationItem,
  Regulation,
} from '../lib/types';

type LoadState = 'loading' | 'ready' | 'error';

interface AppData {
  state: LoadState;
  error: string | null;
  reload: () => void;
  dashboard: DashboardSnapshot | null;
  business: BusinessProfile | null;
  sources: GovernmentSource[];
  regulations: Regulation[];
  alerts: AlertItem[];
  tasks: ComplianceTask[];
  domains: DomainConcentration[];
  calendar: CalendarDeadline[];
  notifications: NotificationItem[];
  getRegulation: (id: string) => Regulation | undefined;
  getAlertsForRegulation: (id: string) => AlertItem[];
  addTask: (payload: Partial<ComplianceTask>) => Promise<ComplianceTask>;
  updateTaskStatus: (id: string, status: ComplianceTask['status']) => void;
  markNotificationRead: (id: string) => void;
}

const AppDataContext = createContext<AppData | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoadState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardSnapshot | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [sources, setSources] = useState<GovernmentSource[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [tasks, setTasks] = useState<ComplianceTask[]>([]);
  const [domains, setDomains] = useState<DomainConcentration[]>([]);
  const [calendar, setCalendar] = useState<CalendarDeadline[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const load = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      const [
        dashboardData,
        businessData,
        sourcesData,
        regulationsData,
        alertsData,
        tasksData,
        domainsData,
        calendarData,
        notificationsData,
      ] = await Promise.all([
        api.getDashboard(),
        api.getBusinessProfile(),
        api.getSources(),
        api.getRegulations(),
        api.getAlerts(),
        api.getTasks(),
        api.getDomains(),
        api.getCalendar(),
        api.getNotifications(),
      ]);
      setDashboard(dashboardData);
      setBusiness(businessData);
      setSources(sourcesData);
      setRegulations(regulationsData);
      setAlerts(alertsData);
      setTasks(tasksData);
      setDomains(domainsData);
      setCalendar(calendarData);
      setNotifications(notificationsData);
      setState('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load regulatory data.');
      setState('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const getRegulation = useCallback(
    (id: string) => regulations.find((r) => r.id === id),
    [regulations],
  );

  const getAlertsForRegulation = useCallback(
    (id: string) => alerts.filter((a) => a.regulationId === id),
    [alerts],
  );

  const addTask = useCallback(async (payload: Partial<ComplianceTask>) => {
    const created = await api.createTask(payload);
    setTasks((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateTaskStatus = useCallback((id: string, status: ComplianceTask['status']) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, progress: status === 'completed' ? 100 : t.progress } : t,
      ),
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const value = useMemo<AppData>(
    () => ({
      state,
      error,
      reload: load,
      dashboard,
      business,
      sources,
      regulations,
      alerts,
      tasks,
      domains,
      calendar,
      notifications,
      getRegulation,
      getAlertsForRegulation,
      addTask,
      updateTaskStatus,
      markNotificationRead,
    }),
    [
      state,
      error,
      load,
      dashboard,
      business,
      sources,
      regulations,
      alerts,
      tasks,
      domains,
      calendar,
      notifications,
      getRegulation,
      getAlertsForRegulation,
      addTask,
      updateTaskStatus,
      markNotificationRead,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
