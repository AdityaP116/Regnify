import { Icon } from '../components/Icon';
import { Button, Card, Chip } from '../components/ui';
import { ErrorState, LoadingState } from '../components/States';
import { PageHeader } from '../components/PageHeader';
import { DeadlineRunway } from '../components/dashboard/DeadlineRunway';
import { useAppData } from '../context/AppDataContext';
import { cn, taskStatusTone } from '../lib/format';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_DAYS = 35; // 5 rows × 7 columns for October 2025 grid
const FIRST_OFFSET = 2; // 1 Oct 2025 falls on Wednesday

export default function Calendar() {
  const { state, error, reload, calendar, tasks, regulations } = useAppData();

  if (state === 'loading') return <LoadingState label="Building your statutory filing calendar…" />;
  if (state === 'error') return <ErrorState description={error ?? undefined} onRetry={reload} />;

  const marked = new Map<number, (typeof calendar)[number]>();
  calendar.forEach((d) => {
    const day = Number(d.isoDate.split('-')[2]);
    if (!Number.isNaN(day)) marked.set(day, d);
  });

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Deadline Monitor"
        title="Statutory Calendar"
        description="Every filing, renewal, return and inspection deadline consolidated from your matched regulations — with the owner, the dependency and the escalation path."
        actions={
          <>
            <Button variant="secondary" icon="calendar_month">Month</Button>
            <Button variant="secondary" icon="view_timeline">Timeline</Button>
            <Button icon="event_available">Subscribe (.ics)</Button>
          </>
        }
      />

      <div className="mb-6">
        <DeadlineRunway deadlines={calendar} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Icon name="calendar_month" className="text-primary" size={20} />
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">October 2025</h2>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded hover:bg-surface-container text-outline"><Icon name="chevron_left" size={20} /></button>
                <button className="p-1.5 rounded hover:bg-surface-container text-outline"><Icon name="chevron_right" size={20} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {WEEKDAYS.map((d) => (
                <span key={d} className="text-center font-label-sm text-label-sm uppercase tracking-wider text-outline py-1">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: MONTH_DAYS }).map((_, i) => {
                const day = i - FIRST_OFFSET + 1;
                const inMonth = day >= 1 && day <= 31;
                const deadline = marked.get(day);
                return (
                  <div
                    key={i}
                    className={cn(
                      'min-h-[74px] rounded-lg p-2 border text-left',
                      !inMonth && 'bg-surface-container-low/40 border-transparent',
                      inMonth && !deadline && 'bg-surface-container-lowest border-[#E2E8E5]',
                      deadline?.tone === 'critical' && 'bg-[#FEF2F2] border-error/30',
                      deadline?.tone === 'primary' && 'bg-primary/5 border-primary/20',
                      deadline?.tone === 'neutral' && 'bg-surface-container-lowest border-[#E2E8E5]',
                    )}
                  >
                    {inMonth && (
                      <>
                        <span className={cn('font-label-sm text-label-sm font-semibold', deadline ? 'text-on-surface' : 'text-on-surface-variant')}>{day}</span>
                        {deadline && (
                          <p className={cn('font-label-sm text-label-sm leading-tight mt-1', deadline.tone === 'critical' ? 'text-error' : deadline.tone === 'primary' ? 'text-primary' : 'text-on-surface-variant')}>
                            {deadline.title}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
        <div className="xl:col-span-4 flex flex-col gap-6 min-w-0">
          <Card className="p-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {calendar.map((d) => (
                <div key={d.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low">
                  <span className={cn('flex flex-col items-center justify-center w-11 h-11 rounded-lg shrink-0 font-label-sm text-label-sm font-bold', d.tone === 'critical' ? 'bg-error text-on-error' : d.tone === 'primary' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface')}>
                    {d.daysLeft}
                    <span className="font-label-sm text-label-sm opacity-80">days</span>
                  </span>
                  <div className="min-w-0">
                    <p className="font-label-md text-label-md text-on-surface font-semibold leading-tight">{d.title}</p>
                    <p className="font-body-sm text-body-sm text-outline">{d.date} • {d.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Linked Compliance Tasks</h3>
            <div className="space-y-2">
              {tasks.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
                  <div className="min-w-0 flex-1">
                    <p className="font-label-md text-label-md text-on-surface font-semibold truncate">{t.title}</p>
                    <p className="font-body-sm text-body-sm text-outline">{t.regulationRef} • Due {t.dueDate}</p>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded font-label-sm text-label-sm font-bold capitalize shrink-0', taskStatusTone(t.status))}>{t.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Coverage</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(regulations.map((r) => r.domain))).map((d) => (
                <Chip key={d} tone="primary">{d}</Chip>
              ))}
            </div>
            <p className="font-body-sm text-body-sm text-outline mt-3">
              {calendar.length} statutory milestones tracked across {regulations.length} matched notifications.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}