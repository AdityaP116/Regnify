import { Link } from 'react-router-dom';
import { Icon } from '../Icon';
import { cn } from '../../lib/format';
import type { AlertItem, Regulation } from '../../lib/types';

// "What Changed?" critical statutory update row with before/now diff.

export function UpdateItem({ alert, regulation }: { alert: AlertItem; regulation?: Regulation }) {
  const tone =
    alert.status === 'Action Required'
      ? 'bg-error-container text-on-error-container'
      : alert.status === 'Review Needed'
        ? 'bg-surface-container-highest text-on-surface-variant'
        : 'bg-surface-container text-on-surface-variant';
  return (
    <div className="bg-surface-container-low rounded-xl p-5 hover:bg-surface-container transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
            {regulation?.category ?? 'Regulation'} • {alert.authorityCode}
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
            {regulation?.jurisdiction ?? 'Central'}
          </span>
          <span className={cn('px-2 py-0.5 rounded font-label-sm text-label-sm font-bold', tone)}>{alert.status}</span>
        </div>
        <span className="font-body-sm text-body-sm text-outline">Published: {alert.published} • Effective: {alert.effective}</span>
      </div>
      <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-2">{alert.title}</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">{alert.detail}</p>
      {regulation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-surface-container-lowest rounded-lg">
          <div className="flex items-start gap-2">
            <span className="px-1.5 py-0.5 rounded bg-error/10 text-error font-label-sm text-label-sm font-bold uppercase shrink-0">Before</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{regulation.beforeChange.split('.')[0]}.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold uppercase shrink-0">Now</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium">{regulation.nowChange.split('.')[0]}.</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-4 pt-2">
        <span className={cn('font-label-sm text-label-sm font-semibold flex items-center gap-1', alert.requiresAction ? 'text-error' : 'text-secondary')}>
          <Icon name={alert.requiresAction ? 'schedule' : 'check_circle'} size={16} />
          {alert.requiresAction ? `Action required • Effective ${alert.effective}` : 'No action required for current fiscal bracket'}
        </span>
        <Link to={`/app/regulations/${alert.regulationId}`} className="font-label-sm text-label-sm text-primary font-bold hover:underline flex items-center gap-1">
          {alert.actionable} <Icon name="arrow_forward" size={14} />
        </Link>
      </div>
    </div>
  );
}
