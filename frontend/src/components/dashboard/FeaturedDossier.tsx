import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import { Button, Card } from '../ui';
import type { Regulation } from '../../lib/types';

// Featured AI-reasoning dossier card on the Overview dashboard.

export function FeaturedDossier({ regulation }: { regulation: Regulation }) {
  const navigate = useNavigate();
  return (
    <Card className="p-6 border-l-[3px] border-l-ai-indigo">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF2FF] text-ai-indigo font-label-sm text-label-sm font-bold">
          <Icon name="auto_awesome" size={14} /> AI Relevance Engine
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
          <Icon name="menu_book" size={14} /> Gazette {regulation.gazetteId}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
          <Icon name="schedule" size={14} /> 18 Days Left • Due 30 Oct 2025
        </span>
      </div>
      <h2 className="font-display font-headline-lg text-headline-lg text-on-surface tracking-tight">{regulation.shortTitle}</h2>
      <p className="font-body-md text-body-md text-on-surface-variant mt-2">{regulation.summary}</p>

      <div className="mt-5 bg-surface-container-low rounded-xl p-5">
        <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-4">Deterministic Reasoning Chain</p>
        <div className="space-y-4">
          {regulation.reasoningChain.map((step) => (
            <div key={step.step} className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shrink-0">
                {step.step}
              </span>
              <div>
                <p className="font-label-md text-label-md text-on-surface font-semibold">{step.label}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/15">
        <Icon name="directions_run" className="text-primary mt-0.5" size={20} />
        <div>
          <p className="font-label-md text-label-md text-primary font-semibold">Prescribed Action Mandate</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{regulation.impactQuote}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button icon="add_task" onClick={() => navigate('/app/compliance')}>
          Assign Task to Facilities Team
        </Button>
        <Button variant="secondary" icon="description" onClick={() => navigate(`/app/regulations/${regulation.id}`)}>
          View Official Gazette
        </Button>
      </div>
      <p className="flex items-center gap-1.5 font-label-sm text-label-sm text-outline mt-4">
        <Icon name="verified" size={14} className="text-secondary" /> Automated Legal Analysis • Confidence: 99.4%
      </p>
    </Card>
  );
}
