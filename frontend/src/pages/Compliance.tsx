import { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Card, TaskStatusBadge } from '../components/ui';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { PageHeader } from '../components/PageHeader';
import { ComplianceGauge } from '../components/infographics';
import { useAppData } from '../context/AppDataContext';
import { cn, titleCase } from '../lib/format';
import type { ComplianceTask } from '../lib/types';

const COLUMNS: { key: ComplianceTask['status']; label: string; tone: string }[] = [
  { key: 'overdue', label: 'Overdue', tone: 'text-error' },
  { key: 'pending', label: 'Pending', tone: 'text-on-surface' },
  { key: 'in_progress', label: 'In Progress', tone: 'text-[#b45309]' },
  { key: 'completed', label: 'Completed', tone: 'text-secondary' },
];

const priorityTone: Record<ComplianceTask['priority'], string> = {
  critical: 'bg-error-container text-on-error-container',
  high: 'bg-[#fef3c7] text-[#b45309]',
  medium: 'bg-surface-container-high text-on-surface-variant',
  low: 'bg-surface-container text-outline',
};

export default function Compliance() {
  const { state, error, reload, tasks, dashboard, addTask, updateTaskStatus } = useAppData();
  const [owner, setOwner] = useState('All Owners');
  const [showForm, setShowForm] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftOwner, setDraftOwner] = useState('Elena Vance');

  const owners = useMemo(() => ['All Owners', ...Array.from(new Set(tasks.map((t) => t.assignedTo)))], [tasks]);

  if (state === 'loading') return <LoadingState label="Reconciling open obligations with statutory deadlines…" />;
  if (state === 'error') return <ErrorState description={error ?? undefined} onRetry={reload} />;

  const scoped = tasks.filter((t) => owner === 'All Owners' || t.assignedTo === owner);
  const stats = {
    total: scoped.length,
    overdue: scoped.filter((t) => t.status === 'overdue').length,
    active: scoped.filter((t) => t.status === 'pending' || t.status === 'in_progress').length,
    completed: scoped.filter((t) => t.status === 'completed').length,
  };

  const submit = async () => {
    if (!draftTitle.trim()) return;
    await addTask({ title: draftTitle.trim(), assignedTo: draftOwner, ownerInitials: draftOwner.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() });
    setDraftTitle('');
    setShowForm(false);
  };

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Closed-Loop Workflow"
        title="Compliance Workspace"
        description="Every matched obligation becomes an owned, dated, trackable task. Progress rolls straight back into your compliance health score."
        actions={
          <>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-surface-container-lowest border border-[#E2E8E5] font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary"
            >
              {owners.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <Button icon="add" onClick={() => setShowForm((v) => !v)}>New Task</Button>
          </>
        }
      />

      {showForm && (
        <Card className="p-5 mb-6">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Create Compliance Task</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="e.g. Install CPCB-compliant emission sensors"
              className="flex-1 px-3 py-2.5 rounded-lg bg-surface-container-low border border-[#E2E8E5] font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
            />
            <select
              value={draftOwner}
              onChange={(e) => setDraftOwner(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-surface-container-low border border-[#E2E8E5] font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary"
            >
              {owners.filter((o) => o !== 'All Owners').map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <Button icon="save" onClick={() => void submit()} disabled={!draftTitle.trim()}>Create</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Open Obligations', value: stats.total, icon: 'assignment', tone: 'text-primary' },
          { label: 'Overdue', value: stats.overdue, icon: 'running_with_errors', tone: 'text-error' },
          { label: 'In Flight', value: stats.active, icon: 'pending_actions', tone: 'text-[#b45309]' },
          { label: 'Completed', value: stats.completed, icon: 'task_alt', tone: 'text-secondary' },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">{s.label}</span>
              <Icon name={s.icon} size={20} className={s.tone} />
            </div>
            <p className={cn('font-headline-xl text-headline-xl font-medium leading-none mt-3', s.tone)}>{s.value}</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
            {COLUMNS.map((col) => {
              const items = scoped.filter((t) => t.status === col.key);
              return (
                <div key={col.key} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between px-1">
                    <span className={cn('font-label-md text-label-md font-bold uppercase tracking-wider', col.tone)}>{col.label}</span>
                    <span className="font-label-sm text-label-sm text-outline">{items.length}</span>
                  </div>
                  {items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#E2E8E5] p-4 text-center font-body-sm text-body-sm text-outline">
                      Nothing here
                    </div>
                  ) : (
                    items.map((t) => (
                      <Card key={t.id} className="p-4">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={cn('px-2 py-0.5 rounded font-label-sm text-label-sm font-bold capitalize', priorityTone[t.priority])}>{t.priority}</span>
                          <TaskStatusBadge status={t.status} />
                        </div>
                        <p className="font-label-md text-label-md text-on-surface font-semibold leading-tight">{t.title}</p>
                        <p className="font-body-sm text-body-sm text-outline mt-1">{t.regulationRef} • {t.primaryCategory}</p>
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-label-sm text-label-sm text-outline">Progress</span>
                            <span className="font-label-sm text-label-sm text-on-surface font-semibold tabular">{t.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                            <div className={cn('h-full rounded-full', t.status === 'completed' ? 'bg-secondary' : t.status === 'overdue' ? 'bg-error' : 'bg-primary')} style={{ width: `${t.progress}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E2E8E5]">
                          <span className="flex items-center gap-1.5 font-body-sm text-body-sm text-outline">
                            <span className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary font-label-sm text-label-sm font-bold">{t.ownerInitials}</span>
                            Due {t.dueDate}
                          </span>
                          {t.status !== 'completed' && (
                            <button
                              onClick={() => updateTaskStatus(t.id, t.status === 'pending' ? 'in_progress' : 'completed')}
                              className="font-label-sm text-label-sm text-secondary font-bold hover:underline"
                            >
                              {t.status === 'pending' ? 'Start' : 'Complete'}
                            </button>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="xl:col-span-3 flex flex-col gap-6 min-w-0">
          {dashboard && (
            <Card className="p-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-4">Compliance Health</h3>
              <div className="flex flex-col items-center">
                <ComplianceGauge value={dashboard.complianceHealth.overall} rating={dashboard.complianceHealth.rating} size={150} />
              </div>
              <div className="mt-4 space-y-3">
                {dashboard.complianceHealth.breakdown.map((b) => (
                  <div key={b.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-sm text-label-sm text-on-surface">{b.label}</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold tabular">{b.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                      <div className={cn('h-full rounded-full', b.tone === 'success' ? 'bg-secondary' : b.tone === 'critical' ? 'bg-error' : 'bg-[#b45309]')} style={{ width: `${b.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Escalation Queue</h3>
            {scoped.filter((t) => t.status === 'overdue').length === 0 ? (
              <p className="font-body-sm text-body-sm text-outline">No overdue obligations. All owners are on schedule.</p>
            ) : (
              <div className="space-y-2">
                {scoped.filter((t) => t.status === 'overdue').map((t) => (
                  <div key={t.id} className="p-3 rounded-lg bg-[#FEF2F2] border border-error/20">
                    <p className="font-label-md text-label-md text-on-surface font-semibold leading-tight">{t.title}</p>
                    <p className="font-body-sm text-body-sm text-error mt-1">{titleCase(t.status)} • {t.assignedTo} • Due {t.dueDate}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {scoped.length === 0 && (
            <EmptyState icon="assignment_turned_in" title="No tasks for this owner" description="Pick another owner or create a new compliance task." />
          )}
        </div>
      </div>
    </div>
  );
}
