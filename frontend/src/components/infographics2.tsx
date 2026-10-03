import { cn } from '../lib/format';
import type { DomainConcentration, Regulation } from '../lib/types';

// ---------------------------------------------------------------------------
// "Why This Matters to You" intelligence block — sequential impact flow
// (DESIGN.md §"Why This Matters to You" Intelligence Block)
// ---------------------------------------------------------------------------

export function WhyThisMattersBlock({ regulation }: { regulation: Regulation }) {
  const steps = [
    { label: 'Government Notification', detail: regulation.authorityCode, tone: 'text-[#64748B]', dot: 'bg-[#64748B]' },
    { label: 'Business Profile Match', detail: 'Precision Fab Ltd • Pune Hub', tone: 'text-primary', dot: 'bg-primary' },
    { label: 'Specific Impact', detail: regulation.impactTag, tone: 'text-on-surface', dot: 'bg-on-surface' },
    { label: 'Required Action', detail: regulation.impactQuote, tone: 'text-[#b45309]', dot: 'bg-[#b45309]' },
    { label: 'Statutory Deadline', detail: `Effective ${regulation.effectiveDate}`, tone: 'text-[#b91c1c]', dot: 'bg-[#b91c1c]' },
  ];
  return (
    <div className="bg-surface-container-lowest border border-[#E2E8E5] border-l-[3px] border-l-accent-teal rounded-xl p-5">
      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-4">Why This Matters to Your Enterprise</h3>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={cn('w-2.5 h-2.5 rounded-full mt-1.5', step.dot)} />
              {i < steps.length - 1 && <span className="w-px flex-1 bg-[#E2E8E5] my-1" />}
            </div>
            <div className="pb-1">
              <p className={cn('font-label-md text-label-md font-semibold', step.tone)}>{step.label}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Domain concentration chart — live gross jurisdictional weighting
// ---------------------------------------------------------------------------

export function DomainConcentrationChart({ domains }: { domains: DomainConcentration[] }) {
  const max = Math.max(...domains.map((d) => d.count), 1);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
      {domains.map((d) => {
        const tone =
          d.impact === 'High Impact'
            ? { bar: 'bg-error', chip: 'bg-error-container text-on-error-container' }
            : d.impact === 'Apply'
              ? { bar: 'bg-secondary', chip: 'bg-secondary-container text-on-secondary-container' }
              : { bar: 'bg-[#64748B]', chip: 'bg-surface-container text-on-surface-variant' };
        return (
          <div key={d.id} className="bg-surface-container-lowest border border-[#E2E8E5] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={cn('font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold', tone.chip)}>{d.impact}</span>
            </div>
            <p className="font-label-md text-label-md text-on-surface font-semibold leading-tight">{d.domain}</p>
            <p className="font-body-sm text-body-sm text-outline mt-1 min-h-[32px]">{d.requirement}</p>
            <div className="flex items-end gap-1 h-10 mt-3">
              {d.trend.map((v, i) => (
                <span key={i} className={cn('flex-1 rounded-sm', tone.bar)} style={{ height: `${(v / max) * 100}%`, opacity: 0.35 + i * 0.16 }} />
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E2E8E5]">
              <span className="font-label-sm text-label-sm text-outline uppercase">Active updates</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">{d.count}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Statutory Diff — side-by-side pre/post amendment audit table
// ---------------------------------------------------------------------------

export function StatutoryDiff({ before, now, effective }: { before: string; now: string; effective?: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="rounded-lg p-4 bg-[#FEF2F2] border border-[#f3d0d0]">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-label-sm text-label-sm font-bold uppercase text-[#b91c1c]">Previous Provision (Pre-Amendment)</span>
          <span className="ml-auto font-label-sm text-label-sm text-[#b91c1c]/70">Superseded</span>
        </div>
        <p className="font-body-sm text-body-sm text-[#b91c1c]">{before}</p>
      </div>
      <div className="rounded-lg p-4 bg-[#F0FDF4] border border-[#c9ecd3]">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-label-sm text-label-sm font-bold uppercase text-[#15803d]">Enacted Mandate (Current Law)</span>
          <span className="ml-auto font-label-sm text-label-sm text-[#15803d]/70">Mandatory {effective ?? ''}</span>
        </div>
        <p className="font-body-sm text-body-sm text-[#15803d]">{now}</p>
      </div>
    </div>
  );
}
