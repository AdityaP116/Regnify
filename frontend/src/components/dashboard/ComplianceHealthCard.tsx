import { Icon } from '../Icon';
import { Button, Card } from '../ui';
import { ComplianceGauge } from '../infographics';
import { cn } from '../../lib/format';
import type { DashboardSnapshot } from '../../lib/types';

export function ComplianceHealthCard({ health }: { health: DashboardSnapshot['complianceHealth'] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Compliance Health</h3>
        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">Q3 FY26</span>
      </div>
      <div className="flex flex-col items-center">
        <ComplianceGauge value={health.overall} rating={health.rating} />
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-3">{health.note}</p>
      <div className="mt-5 space-y-4">
        {health.breakdown.map((b) => {
          const tone = b.tone === 'success' ? 'bg-secondary' : b.tone === 'critical' ? 'bg-error' : 'bg-[#b45309]';
          return (
            <div key={b.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-label-md text-label-md text-on-surface">{b.label}</span>
                <span className="font-label-md text-label-md text-on-surface font-bold tabular">{b.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                <div className={cn('h-full rounded-full', tone)} style={{ width: `${b.value}%` }} />
              </div>
              <span className={cn('font-label-sm text-label-sm mt-1 inline-block', b.tone === 'critical' ? 'text-error' : 'text-on-surface-variant')}>{b.status}</span>
            </div>
          );
        })}
      </div>
      <Button variant="secondary" icon="download" className="w-full mt-5">Download Compliance Deck (PDF)</Button>
    </Card>
  );
}

export function ImmediateTasksCard({ tasks }: { tasks: import('../../lib/types').ComplianceTask[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Immediate Tasks ({tasks.length})</h3>
        <Icon name="more_horiz" size={20} className="text-outline" />
      </div>
      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
            <span className="mt-0.5 flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary font-label-sm text-label-sm font-bold shrink-0">{t.ownerInitials}</span>
            <div className="flex-1 min-w-0">
              <span className="font-label-md text-label-md text-on-surface font-semibold block leading-tight">{t.title}</span>
              <span className="font-body-sm text-body-sm text-outline block truncate">Assigned to: {t.assignedTo}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold mt-1 inline-block">Due {t.dueDate}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="block w-full mt-4 text-center font-label-md text-label-md text-secondary font-bold">+ Create Custom Task</p>
    </Card>
  );
}

export function EnforcingAuthoritiesCard({ sources }: { sources: import('../../lib/types').GovernmentSource[] }) {
  return (
    <Card className="p-6">
      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Enforcing Authorities</h3>
      <div className="space-y-3">
        {sources.slice(0, 4).map((s, i) => (
          <div key={s.id} className="flex items-center justify-between p-2.5 rounded bg-surface-container-low">
            <div className="flex items-center gap-2.5">
              <span className={cn('flex items-center justify-center w-8 h-8 rounded font-label-sm text-label-sm font-bold', i % 2 === 0 ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary')}>
                {s.code}
              </span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-semibold">{s.name}</span>
                <span className="font-body-sm text-body-sm text-outline">{s.department}</span>
              </div>
            </div>
            <Icon name="call" size={18} className="text-outline hover:text-on-surface cursor-pointer" />
          </div>
        ))}
      </div>
    </Card>
  );
}
