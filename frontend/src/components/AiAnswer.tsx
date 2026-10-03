import { Icon } from './Icon';
import { AiBadge, Card, OfficialSourceBadge } from './ui';
import { cn } from '../lib/format';
import type { AiResponse } from '../lib/types';

// Renders the grounded AI answer: synthesis, business logic match, citations,
// operational steps and the statutory deadline. Official vs AI provenance is
// kept visually separate per DESIGN.md.

export function AssistantEmpty() {
  return (
    <Card className="p-10 flex flex-col items-center justify-center text-center gap-3">
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EEF2FF] text-ai-indigo">
        <Icon name="neurology" size={24} />
      </span>
      <div>
        <p className="font-headline-sm text-headline-sm text-on-surface">Ask your first statutory question</p>
        <p className="font-body-sm text-body-sm text-outline mt-1 max-w-md">
          Regnify will retrieve the exact gazette clause, match it to your business profile, and return numbered operational steps with a deadline.
        </p>
      </div>
    </Card>
  );
}

export function AiAnswerCard({ answer }: { answer: AiResponse }) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6 border-l-[3px] border-l-ai-indigo">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <AiBadge label={`Confidence ${answer.confidence}%`} />
          <span className="font-label-sm text-label-sm text-outline">Answered in {answer.latencyMs} ms • {answer.askedAt}</span>
        </div>
        <p className="font-label-md text-label-md text-on-surface-variant">{answer.question}</p>
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-2">Executive Synthesis</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">{answer.executiveSynthesis}</p>

        <div className="mt-5 bg-surface-container-low rounded-xl p-5">
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-3">Business Logic Match</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {[
              { label: 'Target Entity', value: answer.businessLogic.targetEntity },
              { label: 'Matched Clause', value: answer.businessLogic.matchedClause },
              { label: 'NIC Code', value: answer.businessLogic.nicCode },
              { label: 'Zone', value: answer.businessLogic.zone },
            ].map((f) => (
              <div key={f.label} className="flex items-start justify-between gap-3 border-b border-[#E2E8E5] pb-2">
                <span className="font-label-sm text-label-sm text-outline uppercase">{f.label}</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold text-right">{f.value}</span>
              </div>
            ))}
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-3">{answer.businessLogic.applicability}</p>
        </div>

        <div className="mt-4 flex items-center gap-3 p-4 rounded-lg bg-[#FEF2F2] border border-error/20">
          <Icon name="event_busy" className="text-error" size={20} />
          <div>
            <p className="font-label-md text-label-md text-error font-semibold">Statutory Deadline</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{answer.statutoryDeadline}</p>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="rule" className="text-primary" size={20} />
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Operational Steps</h2>
          </div>
          <span className="font-label-sm text-label-sm text-outline">{answer.operationalSteps.length} steps</span>
        </div>
        <ol className="space-y-4">
          {answer.operationalSteps.map((s) => (
            <li key={s.step} className="flex gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shrink-0">{s.step}</span>
              <div className="pb-1">
                <p className="font-label-md text-label-md text-on-surface font-semibold">{s.title}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="menu_book" className="text-primary" size={20} />
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Official Citations</h2>
        </div>
        <div className="space-y-3">
          {answer.citations.map((c) => (
            <div key={c.notification} className="rounded-xl border border-[#E2E8E5] overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-surface-container-low">
                <OfficialSourceBadge label={c.verified ? 'Verified Official Source' : 'Unverified'} />
                <span className="font-label-sm text-label-sm text-outline">{c.gazette}</span>
              </div>
              <div className="p-4">
                <p className="font-label-md text-label-md text-on-surface font-semibold">{c.notification}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{c.authority} • {c.clause}</p>
                <blockquote className={cn('mt-3 pl-3 border-l-2 border-[#E2E8E5] font-body-sm text-body-sm text-on-surface-variant italic')}>
                  “{c.excerpt}”
                </blockquote>
                <button className="mt-3 inline-flex items-center gap-1.5 font-label-sm text-label-sm text-primary font-bold hover:underline">
                  <Icon name="picture_as_pdf" size={16} /> {c.pdfLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
