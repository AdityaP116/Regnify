import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { cn } from '../lib/format';

// Four-card primary intelligence metrics bento (reference Overview dashboard).

export interface MetricSpec {
  label: string;
  value: number | string;
  delta: string;
  deltaTone?: string;
  icon: string;
  footer: string;
  accent?: 'critical' | 'secondary' | 'none';
  onFooterClick?: () => void;
}

function toneClass(tone?: string) {
  switch (tone) {
    case 'critical':
      return 'bg-error-container text-on-error-container';
    case 'secondary':
      return 'bg-surface-container-low text-secondary';
    default:
      return 'bg-surface-container text-on-surface-variant';
  }
}

export function MetricCard({ metric }: { metric: MetricSpec }) {
  const isCritical = metric.accent === 'critical';
  const isSecondary = metric.accent === 'secondary';
  return (
    <button
      onClick={metric.onFooterClick}
      className="text-left bg-surface-container-lowest border border-[#E2E8E5] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between group hover:shadow-dossier transition-shadow"
    >
      {isSecondary && <span className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-xl" />}
      <div className={cn('absolute -right-3 -top-3 w-20 h-20 rounded-full pointer-events-none', isCritical ? 'bg-error/5' : 'bg-surface-container-low')} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant font-semibold">{metric.label}</span>
          <Icon name={metric.icon} size={20} className={isCritical ? 'text-error' : isSecondary ? 'text-secondary' : 'text-outline'} />
        </div>
        <div className="flex items-baseline gap-3 mt-3">
          <span className={cn('font-headline-xl text-headline-xl font-medium leading-none', isCritical ? 'text-error' : isSecondary ? 'text-secondary' : 'text-primary')}>
            {metric.value}
          </span>
          <span className={cn('font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold', toneClass(metric.accent === 'critical' ? 'critical' : metric.accent === 'secondary' ? 'secondary' : undefined))}>
            {metric.delta}
          </span>
        </div>
      </div>
      <div className="relative mt-4 pt-3 flex items-center justify-between text-outline border-t border-[#E2E8E5]">
        <span className="font-body-sm text-body-sm truncate">{metric.footer}</span>
        {metric.onFooterClick && <Icon name="arrow_forward" size={16} className="text-secondary shrink-0" />}
      </div>
    </button>
  );
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{children}</div>;
}