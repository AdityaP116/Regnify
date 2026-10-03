import { Icon } from './Icon';
import { cn } from '../lib/format';
import type { DomainConcentration, Regulation } from '../lib/types';

// ---------------------------------------------------------------------------
// Regulatory Process Tracker: DISCOVER → UNDERSTAND → CLASSIFY → MATCH →
// EXPLAIN → ALERT → ACT → TRACK  (DESIGN.md §Regulatory Process Tracker Nodes)
// ---------------------------------------------------------------------------

export const PROCESS_STAGES = [
  { code: 'DISCOVER', label: 'Gazette Scanned' },
  { code: 'UNDERSTAND', label: 'NLP Parse' },
  { code: 'CLASSIFY', label: 'Domain Taxonomy' },
  { code: 'MATCH', label: 'Entity Match' },
  { code: 'EXPLAIN', label: 'Plain Language' },
  { code: 'ALERT', label: 'Action Route' },
  { code: 'ACT', label: 'Task Created' },
  { code: 'TRACK', label: 'Deadline Monitor' },
];

export function ProcessTracker({ activeIndex = 7 }: { activeIndex?: number }) {
  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex items-center gap-1 min-w-[720px]">
        {PROCESS_STAGES.map((stage, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <div key={stage.code} className="flex items-center flex-1">
              <div className="flex flex-col items-center text-center flex-1">
                <span
                  className={cn(
                    'flex items-center justify-center w-7 h-7 rounded-full font-label-sm text-label-sm font-bold mb-1.5',
                    done && 'bg-primary text-on-primary',
                    active && 'bg-accent-teal text-white ring-4 ring-accent-teal/20',
                    !done && !active && 'bg-surface-container-high text-on-surface-variant',
                  )}
                >
                  {done ? <Icon name="check" size={15} /> : i + 1}
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface">{stage.code}</span>
                <span className="font-body-sm text-body-sm text-outline">{stage.label}</span>
              </div>
              {i < PROCESS_STAGES.length - 1 && (
                <span className={cn('h-px w-full max-w-[28px] -mt-6', i < activeIndex ? 'bg-primary' : 'bg-[#E2E8E5]')} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Radial compliance gauge (inline SVG, mirrors reference dashboard)
// ---------------------------------------------------------------------------

export function ComplianceGauge({ value, rating, size = 168 }: { value: number; rating: string; size?: number }) {
  const r = 50;
  const circumference = 2 * Math.PI * r; // 314.16
  const offset = circumference * (1 - value / 100);
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" viewBox="0 0 120 120" width={size} height={size}>
        <circle className="text-surface-container" cx="60" cy="60" fill="transparent" r={r} stroke="currentColor" strokeWidth="10" />
        <circle
          className="text-secondary transition-[stroke-dashoffset] duration-700"
          cx="60"
          cy="60"
          fill="transparent"
          r={r}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-headline-xl text-headline-xl text-primary font-bold leading-none">{value}%</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1">{rating}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Regulatory Intelligence Flow — 5-stage pipeline (dashboard)
// ---------------------------------------------------------------------------

export function PipelineFlow({
  stages,
}: {
  stages: { code: string; label: string; count: number; meta: string; state: string }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
      {stages.map((s) => {
        const isActive = s.state === 'active';
        return (
          <div
            key={s.code}
            className={cn('rounded-xl p-4 border transition-colors', isActive ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest border-[#E2E8E5]')}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn('font-label-sm text-label-sm uppercase tracking-wider', isActive ? 'text-on-primary-container' : 'text-outline')}>{s.code}</span>
              <span className={cn('w-2 h-2 rounded-full', isActive ? 'bg-accent-teal animate-pulse' : 'bg-secondary')} />
            </div>
            <div className={cn('font-headline-lg text-headline-lg font-semibold leading-none', isActive ? 'text-on-primary' : 'text-primary')}>
              {s.count}
              {s.code.includes('COMPLIANCE') && '%'}
            </div>
            <p className={cn('font-body-sm text-body-sm mt-2', isActive ? 'text-on-primary-container' : 'text-on-surface-variant')}>{s.label}</p>
            <div className={cn('flex items-center gap-1.5 mt-3 pt-3 border-t', isActive ? 'border-white/20' : 'border-[#E2E8E5]')}>
              <Icon name={isActive ? 'error' : 'check_circle'} size={14} className={isActive ? 'text-accent-teal' : 'text-secondary'} />
              <span className={cn('font-label-sm text-label-sm', isActive ? 'text-on-primary-container' : 'text-outline')}>{s.meta}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}