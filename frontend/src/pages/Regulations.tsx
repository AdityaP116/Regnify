import { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Card } from '../components/ui';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { PageHeader } from '../components/PageHeader';
import { RegulationListItem } from '../components/RegulationCard';
import { FeaturedDossier } from '../components/dashboard/FeaturedDossier';
import { DomainConcentrationChart } from '../components/infographics2';
import { useAppData } from '../context/AppDataContext';
import { cn } from '../lib/format';

const FILTERS = ['All Updates', 'Action Required', 'High Impact', 'Central', 'Maharashtra', 'Environment'] as const;
type Filter = (typeof FILTERS)[number];

export default function Regulations() {
  const { state, error, reload, regulations, domains } = useAppData();
  const [filter, setFilter] = useState<Filter>('All Updates');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return regulations.filter((r) => {
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.shortTitle.toLowerCase().includes(q) ||
        r.gazetteId.toLowerCase().includes(q) ||
        r.authorityCode.toLowerCase().includes(q);
      const matchesFilter =
        filter === 'All Updates' ||
        (filter === 'Action Required' && r.status === 'Action Required') ||
        (filter === 'High Impact' && (r.relevance === 'critical' || r.relevance === 'high')) ||
        (filter === 'Central' && r.jurisdiction === 'Central') ||
        (filter === 'Maharashtra' && r.jurisdiction === 'Maharashtra') ||
        (filter === 'Environment' && r.domain === 'Environment');
      return matchesQuery && matchesFilter;
    });
  }, [regulations, filter, query]);

  if (state === 'loading') return <LoadingState label="Indexing gazette notifications across 8 authorities…" />;
  if (state === 'error') return <ErrorState description={error ?? undefined} onRetry={reload} />;

  const featured = regulations.find((r) => r.status === 'Action Required') ?? regulations[0];

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Continuous Monitoring"
        title="Regulatory Intelligence Library"
        description="Every gazette notification, circular and amendment ingested from your subscribed authorities — classified, matched to your business profile and explained in plain language."
        actions={
          <>
            <Button variant="secondary" icon="tune">Filter Domains</Button>
            <Button icon="download">Export Ledger</Button>
          </>
        }
      />

      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, gazette ID, or authority code…"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-low border border-[#E2E8E5] font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-full font-label-sm text-label-sm font-semibold transition-colors',
                  filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {featured && (
        <div className="mb-6">
          <FeaturedDossier regulation={featured} />
        </div>
      )}

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="category" className="text-primary" size={20} />
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Domain Concentration</h2>
          </div>
          <span className="font-label-sm text-label-sm text-outline hidden sm:block">Live weighting across your operational footprint</span>
        </div>
        <DomainConcentrationChart domains={domains} />
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
          Regulatory Stream <span className="text-outline font-body-md text-body-md">({filtered.length} of {regulations.length})</span>
        </h2>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="No regulations match this view"
          description="Try clearing the search query or switching to the All Updates filter."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <RegulationListItem key={r.id} regulation={r} />
          ))}
        </div>
      )}
    </div>
  );
}
