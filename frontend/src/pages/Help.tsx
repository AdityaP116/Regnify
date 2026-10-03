import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Card } from '../components/ui';
import { PageHeader } from '../components/PageHeader';
import { cn } from '../lib/format';

const FAQS = [
  {
    q: 'How does Regnify decide which notifications matter to my business?',
    a: 'Every gazette notification is parsed, classified into a domain taxonomy, then matched against your registered profile — entity type, sector, NIC code, jurisdiction, employee count and pollution/boiler category. Only matches above your relevance threshold reach your alert centre.',
  },
  {
    q: 'Where do the regulations come from?',
    a: 'Regnify polls official authority feeds — CPCB, MoEFCC, GPCB, MPCB, EPFO, ESIC, CBIC, DGFT and the Gazette of India. Each notification keeps a verified source link, and the AI interpretation is always labelled separately from the official text.',
  },
  {
    q: 'Can I trust the AI answers?',
    a: 'Answers are grounded strictly in retrieved official clauses. If no source supports a claim, Regnify states that explicitly rather than guessing. Every answer shows its citations, confidence score and the reasoning chain used.',
  },
  {
    q: 'How is compliance health calculated?',
    a: 'Compliance health is a weighted score across open obligations: overdue tasks reduce it sharply, unassigned obligations moderately, and completed tasks restore it. The breakdown shows each contributing category.',
  },
  {
    q: 'What happens if a deadline is missed?',
    a: 'Overdue tasks move to the escalation queue, the owner receives an escalating reminder, and the projected penalty exposure is added to your risk summary so it can be raised with management.',
  },
];

const CHANNELS = [
  { icon: 'support_agent', title: 'Talk to a compliance expert', detail: 'Avg. response 12 min • Mon–Sat, 09:00–19:00 IST', action: 'Start Chat' },
  { icon: 'mail', title: 'Email support', detail: 'support@regnify.in • Response within 1 business day', action: 'Send Email' },
  { icon: 'menu_book', title: 'Documentation', detail: 'Guides, API reference and integration playbooks', action: 'Open Docs' },
  { icon: 'ondemand_video', title: 'Video walkthroughs', detail: 'Short task-based tutorials for every module', action: 'Watch' },
];

export default function Help() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Support"
        title="Help &amp; Support"
        description="Answers to the questions compliance teams ask most, plus a direct line to our regulatory specialists."
        actions={<Button variant="secondary" icon="bug_report">Report an Issue</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {CHANNELS.map((c) => (
          <Card key={c.title} className="p-5 flex items-start gap-4">
            <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary shrink-0">
              <Icon name={c.icon} size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-label-lg text-label-lg text-on-surface font-semibold">{c.title}</p>
              <p className="font-body-sm text-body-sm text-outline mt-0.5">{c.detail}</p>
            </div>
            <Button variant="ghost" icon="arrow_forward" className="shrink-0">{c.action}</Button>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="quiz" className="text-primary" size={20} />
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-[#E2E8E5]">
              {FAQS.map((f, i) => (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-start justify-between gap-4 py-4 text-left"
                    aria-expanded={open === i}
                  >
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">{f.q}</span>
                    <Icon name={open === i ? 'expand_less' : 'expand_more'} size={22} className="text-outline shrink-0" />
                  </button>
                  {open === i && <p className="font-body-md text-body-md text-on-surface-variant pb-4 -mt-1">{f.a}</p>}
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="xl:col-span-4 flex flex-col gap-6 min-w-0">
          <Card className="p-6 border-l-[3px] border-l-accent-teal">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="verified_user" size={18} className="text-accent-teal" />
              <span className="font-label-md text-label-md text-on-surface font-semibold">Service Status</span>
            </div>
            <ul className="space-y-2">
              {[
                { label: 'Gazette ingestion pipeline', ok: true },
                { label: 'AI reasoning engine', ok: true },
                { label: 'Authority source sync', ok: true },
                { label: 'Notification delivery', ok: true },
              ].map((s) => (
                <li key={s.label} className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{s.label}</span>
                  <span className={cn('flex items-center gap-1.5 font-label-sm text-label-sm font-bold', s.ok ? 'text-secondary' : 'text-error')}>
                    <span className={cn('w-2 h-2 rounded-full', s.ok ? 'bg-secondary' : 'bg-error')} />
                    {s.ok ? 'Operational' : 'Degraded'}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="keyboard" className="text-primary" size={20} />
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Keyboard Shortcuts</h3>
            </div>
            <div className="space-y-2">
              {[
                { keys: 'G then O', label: 'Go to Overview' },
                { keys: 'G then R', label: 'Go to Regulations' },
                { keys: 'G then A', label: 'Go to Alerts' },
                { keys: '/', label: 'Focus search' },
                { keys: 'Esc', label: 'Close panel' },
              ].map((k) => (
                <div key={k.label} className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{k.label}</span>
                  <kbd className="px-2 py-0.5 rounded border border-[#E2E8E5] bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant">{k.keys}</kbd>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
