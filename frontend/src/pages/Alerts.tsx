import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { AiBadge, Button, Card, Chip, OfficialSourceBadge } from '../components/ui';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { PageHeader } from '../components/PageHeader';
import { useAppData } from '../context/AppDataContext';
import { cn, relevanceTone } from '../lib/format';

const TABS = ['All Alerts', 'Action Required', 'Review Needed', 'Informational'] as const;
type Tab = (typeof TABS)[number];

export default function Alerts() {
  const { state, error, reload, alerts, getRegulation, markAlertRead } = useAppData();
  const [tab, setTab] = useState<Tab>('All Alerts');
  const [acknowledged, setAcknowledged] = useState<string[]>([]);

  if (state === 'loading') return <LoadingState label="Evaluating new notifications against your business profile…" />;
  if (state === 'error') return <ErrorState description={error ?? undefined} onRetry={reload} />;

  const visible = alerts.filter((a) => tab === 'All Alerts' || a.status === tab);
  const counts = {
    critical: alerts.filter((a) => a.severity === 'critical').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    info: alerts.filter((a) => a.severity === 'info').length,
  };

  const acknowledge = (id: string) => {
    setAcknowledged((prev) => (prev.includes(id) ? prev : [...prev, id]));
    void markAlertRead(id);
  };

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Action Routing"
        title="Alerts &amp; Action Center"
        description="Each alert is routed to a named owner with the statutory clause, deadline and the exact action required — so nothing is missed and nothing is duplicated."
        actions={
          <>
            <Button variant="secondary" icon="done_all">Mark All Reviewed</Button>
            <Button icon="tune">Notification Rules</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Critical Alerts', value: counts.critical, icon: 'error', tone: 'critical' as const, note: 'Immediate statutory exposure' },
          { label: 'Advisory Warnings', value: counts.warning, icon: 'warning', tone: 'warning' as const, note: 'Review within current quarter' },
          { label: 'Informational', value: counts.info, icon: 'info', tone: 'info' as const, note: 'No action required' },
        ].map((c) => (
          <Card key={c.label} className="p-5 flex items-center gap-4">
            <span
              className={cn(
                'flex items-center justify-center w-11 h-11 rounded-lg shrink-0',
                c.tone === 'critical' ? 'bg-error-container text-on-error-container' : c.tone === 'warning' ? 'bg-[#fef3c7] text-[#b45309]' : 'bg-surface-container text-on-surface-variant',
              )}
            >
              <Icon name={c.icon} size={22} />
            </span>
            <div>
              <p className="font-headline-lg text-headline-lg font-semibold text-primary leading-none">{c.value}</p>
              <p className="font-label-md text-label-md text-on-surface font-semibold mt-1">{c.label}</p>
              <p className="font-body-sm text-body-sm text-outline">{c.note}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-3.5 py-1.5 rounded-full font-label-sm text-label-sm font-semibold transition-colors',
              tab === t ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState icon="notifications_off" title="No alerts in this view" description="Switch tabs to see other alert severities." />
      ) : (
        <div className="space-y-3">
          {visible.map((a) => {
            const regulation = getRegulation(a.regulationId);
            const isAck = acknowledged.includes(a.id);
            return (
              <Card key={a.id} className={cn('p-5', a.severity === 'critical' && 'border-l-[3px] border-l-error')}>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={cn('px-2 py-0.5 rounded font-label-sm text-label-sm font-bold', relevanceTone[a.severity === 'critical' ? 'critical' : a.severity === 'warning' ? 'medium' : 'low'])}>
                    {a.status}
                  </span>
                  <Chip>{a.authorityCode}</Chip>
                  {regulation && <Chip>{regulation.domain}</Chip>}
                  <span className="font-body-sm text-body-sm text-outline ml-auto">Published {a.published} • Effective {a.effective}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{a.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{a.detail}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <OfficialSourceBadge label={`${a.authorityCode} Gazette`} />
                  {regulation && <AiBadge label={`Relevance ${regulation.relevanceScore}%`} />}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-[#E2E8E5]">
                  <Link to={`/app/regulations/${a.regulationId}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors">
                    <Icon name="visibility" size={18} /> {a.actionable}
                  </Link>
                  <Button variant="secondary" icon={isAck ? 'check_circle' : 'done'} onClick={() => acknowledge(a.id)} disabled={isAck}>
                    {isAck ? 'Acknowledged' : 'Acknowledge'}
                  </Button>
                  <Button variant="ghost" icon="forward_to_inbox">Assign Owner</Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
