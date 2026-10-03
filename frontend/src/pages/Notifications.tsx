import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Button, Card, Chip } from '../components/ui';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { PageHeader } from '../components/PageHeader';
import { useAppData } from '../context/AppDataContext';
import { cn } from '../lib/format';

const FILTERS = ['All', 'Unread', 'Regulations', 'Deadlines', 'Account'] as const;
type Filter = (typeof FILTERS)[number];

export default function Notifications() {
  const { state, error, reload, notifications, markNotificationRead } = useAppData();
  const [filter, setFilter] = useState<Filter>('All');

  const visible = useMemo(() => {
    if (filter === 'All') return notifications;
    if (filter === 'Unread') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.category === filter);
  }, [notifications, filter]);

  if (state === 'loading') return <LoadingState label="Collecting your notification feed…" />;
  if (state === 'error') return <ErrorState description={error ?? undefined} onRetry={reload} />;

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Activity Feed"
        title="Notifications"
        description="A chronological record of every regulatory change, deadline reminder and account event routed to you."
        actions={
          <>
            <Button variant="secondary" icon="done_all" onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}>
              Mark All Read
            </Button>
            <Button icon="tune">Manage Preferences</Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3.5 py-1.5 rounded-full font-label-sm text-label-sm font-semibold transition-colors',
              filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high',
            )}
          >
            {f}
            {f === 'Unread' && unread > 0 && <span className="ml-1.5 px-1.5 rounded-full bg-error text-on-error text-[10px] font-bold">{unread}</span>}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState icon="notifications_off" title="Nothing here yet" description="You are all caught up. New notifications will appear as gazette feeds are ingested." />
      ) : (
        <Card className="divide-y divide-[#E2E8E5]">
          {visible.map((n) => (
            <div key={n.id} className={cn('flex items-start gap-4 p-5 transition-colors hover:bg-surface-container-low', !n.read && 'bg-primary/[0.03]')}>
              <span className={cn('flex items-center justify-center w-10 h-10 rounded-full shrink-0', n.read ? 'bg-surface-container text-outline' : 'bg-primary/10 text-primary')}>
                <Icon name={n.read ? 'notifications_none' : 'notifications_active'} size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={cn('font-label-md text-label-md', n.read ? 'text-on-surface-variant' : 'text-on-surface font-semibold')}>{n.title}</p>
                  <Chip tone={n.read ? 'neutral' : 'primary'}>{n.category}</Chip>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-error" aria-label="unread" />}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{n.body}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="font-label-sm text-label-sm text-outline">{n.timestamp}</span>
                  {!n.read && (
                    <button onClick={() => markNotificationRead(n.id)} className="font-label-sm text-label-sm text-primary font-bold hover:underline">
                      Mark as read
                    </button>
                  )}
                  <Link to="/app/alerts" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary font-semibold">
                    View in Alerts
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
