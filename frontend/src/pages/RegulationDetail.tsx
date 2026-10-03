import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { AiBadge, Button, Card, Chip, OfficialSourceBadge, RelevanceBadge, StatusBadge } from '../components/ui';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { ProcessTracker } from '../components/infographics';
import { StatutoryDiff, WhyThisMattersBlock } from '../components/infographics2';
import { useAppData } from '../context/AppDataContext';
import { cn, relevanceTone } from '../lib/format';

export default function RegulationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, error, reload, regulations, getRegulation, getAlertsForRegulation, addTask } = useAppData();

  if (state === 'loading') return <LoadingState label="Reconstructing the statutory dossier…" />;
  if (state === 'error') return <ErrorState description={error ?? undefined} onRetry={reload} />;

  const regulation = id ? getRegulation(id) : regulations[0];
  if (!regulation) {
    return (
      <EmptyState
        icon="gavel"
        title="Regulation not found"
        description="This dossier may have been superseded or is outside your subscribed jurisdictions."
        action={<Button variant="secondary" icon="arrow_back" onClick={() => navigate('/app/regulations')}>Back to library</Button>}
      />
    );
  }

  const relatedAlerts = getAlertsForRegulation(regulation.id);
  const related = regulations.filter((r) => r.domain === regulation.domain && r.id !== regulation.id).slice(0, 3);

  return (
    <div className="pb-16">
      <button onClick={() => navigate('/app/regulations')} className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-primary mb-4">
        <Icon name="arrow_back" size={18} /> Back to Regulatory Library
      </button>

      <Card className="p-6 border-l-[3px] border-l-ai-indigo">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <StatusBadge status={regulation.status} />
          <RelevanceBadge relevance={regulation.relevance} score={regulation.relevanceScore} />
          <Chip>{regulation.category}</Chip>
          <Chip>{regulation.jurisdiction}</Chip>
          <span className="font-label-sm text-label-sm text-outline ml-auto">Dossier {regulation.gazetteId}</span>
        </div>
        <h1 className="font-display font-headline-lg text-headline-lg text-primary font-medium tracking-tight">{regulation.title}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">{regulation.summary}</p>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <OfficialSourceBadge label={`${regulation.authority} • Verified`} />
          <AiBadge label="Regnify AI Analyzed" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E2E8E5]">
          {[
            { label: 'Authority', value: regulation.authorityCode },
            { label: 'Published', value: regulation.publishedDate },
            { label: 'Effective From', value: regulation.effectiveDate },
            { label: 'Domain', value: regulation.domain },
          ].map((f) => (
            <div key={f.label}>
              <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline">{f.label}</p>
              <p className="font-label-md text-label-md text-on-surface font-semibold mt-0.5">{f.value}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Button
            icon="add_task"
            onClick={() =>
              void addTask({
                title: `Comply with ${regulation.shortTitle}`,
                regulationId: regulation.id,
                regulationRef: regulation.gazetteId,
                priority: regulation.relevance === 'critical' ? 'critical' : 'high',
              })
            }
          >
            Create Compliance Task
          </Button>
          <Button variant="secondary" icon="picture_as_pdf">Download Gazette PDF</Button>
          <Button variant="ghost" icon="share">Share Dossier</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
        <div className="xl:col-span-8 flex flex-col gap-6 min-w-0">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="difference" className="text-primary" size={20} />
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Statutory Diff — What Actually Changed</h2>
            </div>
            <StatutoryDiff before={regulation.beforeChange} now={regulation.nowChange} effective={regulation.effectiveDate} />
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="account_tree" className="text-primary" size={20} />
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Deterministic Reasoning Chain</h2>
            </div>
            <div className="space-y-4">
              {regulation.reasoningChain.map((step) => (
                <div key={step.step} className="flex gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shrink-0">{step.step}</span>
                  <div className="pb-1">
                    <p className="font-label-md text-label-md text-on-surface font-semibold">{step.label}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            {regulation.helpedSynthesis && (
              <div className="mt-5 flex items-start gap-3 p-4 rounded-lg bg-[#EEF2FF] border border-ai-indigo/20">
                <Icon name="auto_awesome" className="text-ai-indigo mt-0.5" size={20} />
                <div>
                  <p className="font-label-md text-label-md text-ai-indigo font-semibold">AI Synthesis</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{regulation.helpedSynthesis}</p>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="hub" className="text-primary" size={20} />
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Pipeline Trace</h2>
            </div>
            <ProcessTracker activeIndex={7} />
          </Card>

          {relatedAlerts.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="notifications_active" className="text-primary" size={20} />
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Linked Alerts</h2>
              </div>
              <div className="space-y-3">
                {relatedAlerts.map((a) => (
                  <div key={a.id} className="p-4 rounded-lg bg-surface-container-low">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('px-2 py-0.5 rounded font-label-sm text-label-sm font-bold', relevanceTone[a.severity === 'critical' ? 'critical' : 'medium'])}>{a.status}</span>
                      <span className="font-body-sm text-body-sm text-outline">Effective {a.effective}</span>
                    </div>
                    <p className="font-label-md text-label-md text-on-surface font-semibold">{a.title}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{a.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6 min-w-0">
          <WhyThisMattersBlock regulation={regulation} />

          <Card className="p-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Affected Operations</h3>
            <div className="flex flex-wrap gap-2">
              {regulation.affectedBusiness.map((b) => (
                <Chip key={b} tone="primary">{b}</Chip>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Source Documents</h3>
            <div className="space-y-2">
              {regulation.documents.map((d) => (
                <div key={d.label} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                  <Icon name="description" size={20} className="text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-label-md text-label-md text-on-surface font-semibold truncate">{d.label}</p>
                    <p className="font-body-sm text-body-sm text-outline">{d.meta}</p>
                  </div>
                  <Icon name="download" size={18} className="text-outline" />
                </div>
              ))}
            </div>
          </Card>

          {related.length > 0 && (
            <Card className="p-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Related in {regulation.domain}</h3>
              <div className="space-y-2">
                {related.map((r) => (
                  <Link key={r.id} to={`/app/regulations/${r.id}`} className="block p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                    <p className="font-label-md text-label-md text-on-surface font-semibold leading-tight">{r.shortTitle}</p>
                    <p className="font-body-sm text-body-sm text-outline mt-1">{r.authorityCode} • {r.gazetteId}</p>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
