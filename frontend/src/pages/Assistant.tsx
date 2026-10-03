import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Card } from '../components/ui';
import { ErrorState, LoadingState } from '../components/States';
import { PageHeader } from '../components/PageHeader';
import { useAppData } from '../context/AppDataContext';
import { api } from '../lib/api';
import { AiAnswerCard, AssistantEmpty } from '../components/AiAnswer';
import type { AiResponse } from '../lib/types';

const DEFAULT_QUERIES = [
  'What must we do to comply with the new CPCB emission telemetry rule?',
  'Are we liable for ESIC contribution on the raised wage ceiling?',
  'When is our next GSTR-3B filing and what changed this cycle?',
];

export default function Assistant() {
  const { state, error, reload, business } = useAppData();
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<AiResponse | null>(null);
  const [busy, setBusy] = useState(false);

  if (state === 'loading') return <LoadingState label="Warming the regulatory reasoning engine…" />;
  if (state === 'error') return <ErrorState description={error ?? undefined} onRetry={reload} />;

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q) return;
    setQuery(q);
    setBusy(true);
    const res = await api.getAiResponse(q);
    setAnswer(res);
    setBusy(false);
  };

  const suggestions = answer?.suggestedQueries ?? DEFAULT_QUERIES;

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Grounded Reasoning"
        title="Regnify AI Assistant"
        description="Ask a statutory question in plain language. Every answer is grounded in an official gazette citation and matched against your registered business profile — never invented."
        actions={<Button variant="secondary" icon="history">Query History</Button>}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 flex flex-col gap-6 min-w-0">
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#EEF2FF] text-ai-indigo shrink-0">
                <Icon name="neurology" size={20} />
              </span>
              <div className="flex-1">
                <p className="font-label-md text-label-md text-on-surface font-semibold">Ask across {business?.name ?? 'your enterprise'}</p>
                <p className="font-body-sm text-body-sm text-outline">
                  Scope: {business?.sector ?? 'Manufacturing'} • {business?.jurisdiction ?? 'Maharashtra'} • {business?.employees ?? 45} employees
                </p>
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void ask(query);
                    }}
                    placeholder="e.g. What are our obligations under the new CPCB ZLD circular?"
                    className="flex-1 px-3 py-2.5 rounded-lg bg-surface-container-low border border-[#E2E8E5] font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-ai-indigo"
                  />
                  <Button variant="ai" icon="send" onClick={() => void ask(query)} disabled={busy || !query.trim()}>
                    {busy ? 'Analyzing…' : 'Ask Regnify'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          {busy && <LoadingState label="Retrieving gazette clauses and matching your business profile…" />}

          {!busy && !answer && <AssistantEmpty />}
          {!busy && answer && <AiAnswerCard answer={answer} />}
        </div>
        <div className="xl:col-span-4 flex flex-col gap-6 min-w-0">
          <Card className="p-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Suggested Queries</h3>
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => void ask(s)}
                  className="w-full text-left p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors font-body-sm text-body-sm text-on-surface-variant"
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-l-[3px] border-l-ai-indigo">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-2">How Regnify Answers</h3>
            <ul className="space-y-3">
              {[
                { icon: 'menu_book', text: 'Retrieves the exact gazette clause from official sources only.' },
                { icon: 'business_center', text: 'Matches the clause to your NIC code, zone and scale.' },
                { icon: 'rule', text: 'Converts the legal text into numbered operational steps.' },
                { icon: 'schedule', text: 'Attaches the statutory deadline and penalty exposure.' },
              ].map((r) => (
                <li key={r.text} className="flex items-start gap-2.5">
                  <Icon name={r.icon} size={18} className="text-ai-indigo mt-0.5 shrink-0" />
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{r.text}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="shield" size={18} className="text-secondary" />
              <span className="font-label-md text-label-md text-on-surface font-semibold">Zero-Hallucination Policy</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              If no official source supports an answer, Regnify says so and links you to the closest verified notification rather than guessing.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
