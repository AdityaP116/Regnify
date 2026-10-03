import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Card } from '../components/ui';
import { ErrorState, LoadingState } from '../components/States';
import { PipelineFlow, ProcessTracker } from '../components/infographics';
import { MetricCard, MetricGrid } from '../components/MetricCards';
import { FeaturedDossier } from '../components/dashboard/FeaturedDossier';
import { UpdateItem } from '../components/dashboard/UpdateItem';
import { DeadlineRunway } from '../components/dashboard/DeadlineRunway';
import { ComplianceHealthCard, EnforcingAuthoritiesCard, ImmediateTasksCard } from '../components/dashboard/ComplianceHealthCard';
import { useAppData } from '../context/AppDataContext';

function Greeting() {
  const { dashboard } = useAppData();
  if (!dashboard) return null;
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-2 pb-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" /> Live Ingestion Active
          </span>
          <span className="font-label-sm text-label-sm text-outline">Dossier ID: {dashboard.dossierId}</span>
        </div>
        <h1 className="font-display font-headline-xl text-headline-xl text-primary font-medium tracking-tight">
          Good morning, {dashboard.greetingName}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">
          Here is what changed across your subscribed jurisdictions and what requires your immediate operational attention.
        </p>
      </div>
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-[#E2E8E5] self-start lg:self-end">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
          <Icon name="sync" size={18} />
        </span>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary" /> {dashboard.sourcesSynced}
          </span>
          <span className="font-body-sm text-body-sm text-outline">{dashboard.sourcesScraped}</span>
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const { state, error, reload, dashboard, regulations, alerts, tasks, sources, calendar } = useAppData();

  if (state === 'loading') return <LoadingState label="Synchronizing gazettes, circulars and statutory notifications…" />;
  if (state === 'error' || !dashboard) return <ErrorState description={error ?? undefined} onRetry={reload} />;

  const featured = regulations[0];
  const topAlerts = alerts.slice(0, 3);
  const immediateTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 4);

  const metrics = [
    { label: 'New Updates', value: dashboard.metrics.newUpdates, delta: dashboard.metrics.newUpdatesDelta, icon: 'feed', footer: 'CBIC & Labour Ministry Gazettes' },
    { label: 'Relevant to You', value: dashboard.metrics.relevant, delta: dashboard.metrics.relevantMatch, icon: 'cloud_upload', footer: 'Filter: Maharashtra • Manufacturing • 45 Emp.', accent: 'secondary' as const },
    { label: 'Action Required', value: dashboard.metrics.actionRequired, delta: dashboard.metrics.actionPriority, icon: 'error', footer: 'Filing, Sensor Vendor, & Telemetry Setup', accent: 'critical' as const },
    { label: 'Due Soon (< 7 Days)', value: dashboard.metrics.dueSoon, delta: dashboard.metrics.dueRisk, icon: 'schedule', footer: 'Filing: Sensor Vendor & Telemetry' },
  ];

  return (
    <div className="pb-16">
      <Greeting />

      <MetricGrid>
        {metrics.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </MetricGrid>

      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="account_tree" className="text-primary" size={20} />
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Regulatory Intelligence Flow</h2>
          </div>
          <span className="font-label-sm text-label-sm text-outline hidden sm:block">Deterministic AI extraction &amp; Statutory matching pipeline</span>
        </div>
        <PipelineFlow stages={dashboard.pipeline} />
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
        <div className="xl:col-span-8 flex flex-col gap-6 min-w-0">
          {featured && <FeaturedDossier regulation={featured} />}

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon name="difference" className="text-primary" size={20} />
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">What Changed? • Critical Statutory Updates</h2>
              </div>
              <Link to="/app/regulations" className="font-label-sm text-label-sm text-primary font-semibold hover:underline">View All 12 Updates</Link>
            </div>
            <div className="space-y-3">
              {topAlerts.map((a) => (
                <UpdateItem key={a.id} alert={a} regulation={regulations.find((r) => r.id === a.regulationId)} />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="hub" className="text-primary" size={20} />
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Regnify Intelligence Pipeline Tracking</h2>
            </div>
            <ProcessTracker activeIndex={6} />
          </Card>

          <DeadlineRunway deadlines={calendar} />
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6 min-w-0">
          <ComplianceHealthCard health={dashboard.complianceHealth} />
          <ImmediateTasksCard tasks={immediateTasks} />
          <EnforcingAuthoritiesCard sources={sources} />
        </div>
      </div>
    </div>
  );
}