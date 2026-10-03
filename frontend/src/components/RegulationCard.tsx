import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { AiBadge, OfficialSourceBadge, StatusBadge } from './ui';
import { cn, relevanceTone } from '../lib/format';
import type { Regulation } from '../lib/types';

// Compact regulation row used in the stream list below the featured dossier.

export function RegulationListItem({ regulation }: { regulation: Regulation }) {
  return (
    <div className="bg-surface-container-lowest border border-[#E2E8E5] rounded-xl p-5 hover:shadow-dossier transition-shadow">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
          {regulation.category}
        </span>
        <span className={cn('px-2 py-0.5 rounded font-label-sm text-label-sm font-bold', relevanceTone[regulation.relevance])}>
          {regulation.impactTag}
        </span>
        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">{regulation.authorityCode}</span>
        <span className="font-body-sm text-body-sm text-outline ml-auto">
          {regulation.gazetteId} • Published {regulation.publishedDate}
        </span>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{regulation.shortTitle}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{regulation.summary}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <OfficialSourceBadge label={`${regulation.authorityCode} Verified`} />
            <AiBadge label={`Relevance ${regulation.relevanceScore}%`} />
            <StatusBadge status={regulation.status} />
          </div>
          <p className="font-label-sm text-label-sm text-outline mt-3">Effective: {regulation.effectiveDate}</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Link to={`/app/regulations/${regulation.id}`} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors">
            <Icon name="visibility" size={18} /> Inspect Details
          </Link>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">
            <Icon name="bookmark_add" size={18} /> Save Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
