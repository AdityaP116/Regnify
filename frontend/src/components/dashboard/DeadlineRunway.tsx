import { Icon } from '../Icon';
import { Card } from '../ui';
import { cn } from '../../lib/format';
import type { CalendarDeadline } from '../../lib/types';

// Horizontal statutory deadline / filing runway timeline.

export function DeadlineRunway({ deadlines }: { deadlines: CalendarDeadline[] }) {
  const toneMap = {
    critical: 'bg-error text-on-error',
    primary: 'bg-primary text-on-primary',
    neutral: 'bg-surface-container-high text-on-surface',
  } as const;
  const labelTone = {
    critical: 'text-error',
    primary: 'text-primary',
    neutral: 'text-on-surface-variant',
  } as const;
  const cycle = deadlines[0]?.cycle ?? 'Current Cycle';

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="calendar_clock" className="text-primary" size={20} />
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Statutory Deadlines &amp; Filing Runway</h2>
        </div>
        <span className="font-label-sm text-label-sm text-outline">{cycle}</span>
      </div>
      <div className="relative pt-2 pb-4">
        <div className="absolute top-6 left-4 right-4 h-1 bg-surface-container hidden sm:block" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
          {deadlines.map((d) => (
            <div key={d.id} className="flex flex-col items-start relative">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold z-10 shadow-sm mb-3', toneMap[d.tone])}>
                {d.daysLeft}
              </div>
              <span className={cn('font-label-sm text-label-sm font-bold uppercase', labelTone[d.tone])}>
                {d.date} • {d.daysLeft} Days Left
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold mt-1">{d.title}</span>
              <span className="font-body-sm text-body-sm text-outline mt-0.5">{d.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
