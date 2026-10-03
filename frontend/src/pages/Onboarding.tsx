import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui';
import { Field } from '../components/FormFields';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { cn } from '../lib/format';

const steps = ['Business profile', 'Jurisdictions', 'Regulatory domains', 'Review'];
const jurisdictionOptions = ['Maharashtra', 'Gujarat', 'Karnataka', 'Delhi NCR', 'Tamil Nadu', 'Central / Federal'];
const domainOptions = ['Industrial Safety', 'Environment', 'Labour & Employment', 'Taxation', 'Corporate Governance', 'Contract Labour'];

function OptionPill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg border font-label-md text-label-md transition-colors',
        active ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest border-[#E2E8E5] text-on-surface hover:border-primary',
      )}
    >
      {children}
    </button>
  );
}

export default function Onboarding() {
  const { completeOnboarding } = useAuth();
  const { business, updateBusiness } = useAppData();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: 'Precision Fab Ltd',
    entity: 'Private Limited Company',
    sector: 'Light Heavy Fabrication & Automotive Components',
    employees: '42',
    nic: '25920',
  });
  const [jurisdictions, setJurisdictions] = useState<string[]>(['Maharashtra', 'Central / Federal']);
  const [domains, setDomains] = useState<string[]>(['Industrial Safety', 'Environment', 'Labour & Employment']);

  const toggle = (value: string, list: string[], setList: (v: string[]) => void) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  async function finish() {
    await updateBusiness({
      ...(business || {}),
      name: form.name,
      entity: form.entity,
      sector: form.sector,
      employees: parseInt(form.employees, 10) || 0,
      jurisdiction: jurisdictions.join(', '),
    }).catch(() => {});
    completeOnboarding();
    navigate('/app/overview', { replace: true });
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center px-6 py-8">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <Logo size={30} showTagline />
          <span className="font-label-md text-label-md text-outline">
            Step {step + 1} of {steps.length}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2 shrink-0">
              <span
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-full font-label-sm text-label-sm font-bold',
                  i < step && 'bg-primary text-on-primary',
                  i === step && 'bg-accent-teal text-white ring-4 ring-accent-teal/20',
                  i > step && 'bg-surface-container-high text-on-surface-variant',
                )}
              >
                {i < step ? <Icon name="check" size={15} /> : i + 1}
              </span>
              <span className={cn('font-label-md text-label-md', i === step ? 'text-on-surface' : 'text-outline')}>{label}</span>
              {i < steps.length - 1 && <span className="w-8 h-px bg-[#E2E8E5]" />}
            </div>
          ))}
        </div>

        <div className="bg-surface-container-lowest border border-[#E2E8E5] rounded-xl p-7">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h1 className="font-display font-headline-md text-headline-md text-primary">Tell us about your business</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Regnify matches regulations against these attributes to compute relevance.
                </p>
              </div>
              <Field label="Legal entity name" icon="business" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Entity type" icon="corporate_fare" value={form.entity} onChange={(e) => setForm({ ...form, entity: e.target.value })} />
                <Field label="Active workforce" icon="groups" value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} />
              </div>
              <Field label="Primary sector" icon="factory" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} />
              <Field label="NIC code" icon="tag" value={form.nic} onChange={(e) => setForm({ ...form, nic: e.target.value })} />
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="font-display font-headline-md text-headline-md text-primary">Where do you operate?</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-5">Select every jurisdiction you want monitored.</p>
              <div className="flex flex-wrap gap-2">
                {jurisdictionOptions.map((j) => (
                  <OptionPill key={j} active={jurisdictions.includes(j)} onClick={() => toggle(j, jurisdictions, setJurisdictions)}>
                    {j}
                  </OptionPill>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="font-display font-headline-md text-headline-md text-primary">Which regulatory domains matter?</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-5">We prioritise alerts within the domains you select.</p>
              <div className="flex flex-wrap gap-2">
                {domainOptions.map((d) => (
                  <OptionPill key={d} active={domains.includes(d)} onClick={() => toggle(d, domains, setDomains)}>
                    {d}
                  </OptionPill>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="font-display font-headline-md text-headline-md text-primary">Review your intelligence profile</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-5">Regnify will begin monitoring and matching immediately.</p>
              <dl className="grid sm:grid-cols-2 gap-4">
                {([
                  ['Entity', form.name],
                  ['Sector', form.sector],
                  ['Workforce', `${form.employees} on-site`],
                  ['NIC code', form.nic],
                  ['Jurisdictions', jurisdictions.join(', ')],
                  ['Domains', domains.join(', ')],
                ] as const).map(([k, v]) => (
                  <div key={k} className="p-4 rounded-lg bg-surface-container-low">
                    <dt className="font-label-sm text-label-sm uppercase tracking-wider text-outline">{k}</dt>
                    <dd className="font-body-sm text-body-sm text-on-surface mt-1">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" icon="arrow_back" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button icon="arrow_forward" onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button icon="rocket_launch" onClick={finish}>
              Enter Regnify
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}