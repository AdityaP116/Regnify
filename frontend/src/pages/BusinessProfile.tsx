import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Card, Chip } from '../components/ui';
import { ErrorState, LoadingState } from '../components/States';
import { PageHeader } from '../components/PageHeader';
import { useAppData } from '../context/AppDataContext';

const FIELDS = [
  { key: 'name', label: 'Registered Entity Name', icon: 'business' },
  { key: 'entity', label: 'Legal Structure', icon: 'account_balance' },
  { key: 'sector', label: 'Industry Sector', icon: 'factory' },
  { key: 'jurisdiction', label: 'Primary Jurisdiction', icon: 'location_city' },
  { key: 'location', label: 'Operating Location', icon: 'place' },
  { key: 'licenseNo', label: 'Factory / Trade Licence No.', icon: 'badge' },
  { key: 'turnover', label: 'Annual Turnover Band', icon: 'payments' },
  { key: 'shifts', label: 'Shift Pattern', icon: 'schedule' },
  { key: 'taxRegime', label: 'GST Regime', icon: 'receipt_long' },
  { key: 'operatingMarket', label: 'Operating Market', icon: 'public' },
  { key: 'boilerCategory', label: 'Boiler Category', icon: 'local_fire_department' },
  { key: 'pollutionCategory', label: 'Pollution Category', icon: 'air' },
] as const;

export default function BusinessProfile() {
  const { state, error, reload, business, sources } = useAppData();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  if (state === 'loading') return <LoadingState label="Loading your registered business profile…" />;
  if (state === 'error') return <ErrorState description={error ?? undefined} onRetry={reload} />;
  if (!business) return <ErrorState title="Business profile unavailable" description="Complete onboarding to generate your regulatory matching profile." onRetry={reload} />;

  const values: Record<string, string> = {
    name: business.name,
    entity: business.entity,
    sector: business.sector,
    jurisdiction: business.jurisdiction,
    location: business.location,
    licenseNo: business.licenseNo,
    turnover: business.turnover,
    shifts: business.shifts,
    taxRegime: business.taxRegime,
    operatingMarket: business.operatingMarket,
    boilerCategory: business.boilerCategory,
    pollutionCategory: business.pollutionCategory,
  };

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Entity Matching"
        title="Business Profile"
        description="This profile is the filter every gazette notification is matched against. The more accurate it is, the fewer irrelevant alerts you receive."
        actions={
          <>
            <Button variant="secondary" icon="upload_file">Re-import MCA Data</Button>
            {editing ? (
              <Button icon="save" onClick={() => { setEditing(false); setSaved(true); }}>Save Changes</Button>
            ) : (
              <Button icon="edit" onClick={() => { setEditing(true); setSaved(false); }}>Edit Profile</Button>
            )}
          </>
        }
      />

      {saved && (
        <div className="mb-6 flex items-center gap-2 p-3 rounded-lg bg-secondary-container text-on-secondary-container font-label-md text-label-md">
          <Icon name="check_circle" size={18} /> Profile updated. Regulatory matching will re-run on the next ingestion cycle.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 flex flex-col gap-6 min-w-0">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary font-display font-headline-lg text-headline-lg font-bold">
                {business.logoInitials}
              </span>
              <div className="min-w-0">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{business.name}</h2>
                <p className="font-body-sm text-body-sm text-outline">{business.entity} • {business.sector}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Chip tone="primary">{business.employees} employees</Chip>
                  <Chip>{business.pollutionCategory}</Chip>
                  <Chip tone="warning">{business.boilerCategory}</Chip>
                </div>
              </div>
              <div className="ml-auto text-right shrink-0">
                <p className="font-headline-lg text-headline-lg font-semibold text-secondary leading-none">{business.completion}%</p>
                <p className="font-label-sm text-label-sm text-outline mt-1">Profile complete</p>
              </div>
            </div>
            <div className="mt-5 h-2 rounded-full bg-surface-container overflow-hidden">
              <div className="h-full rounded-full bg-secondary" style={{ width: `${business.completion}%` }} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="list_alt" className="text-primary" size={20} />
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Registration Details</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {FIELDS.map((f) => (
                <div key={f.key} className="flex flex-col gap-1 pb-3 border-b border-[#E2E8E5]">
                  <span className="flex items-center gap-1.5 font-label-sm text-label-sm uppercase tracking-wider text-outline">
                    <Icon name={f.icon} size={14} /> {f.label}
                  </span>
                  {editing ? (
                    <input
                      defaultValue={values[f.key]}
                      className="px-2 py-1.5 rounded-md bg-surface-container-low border border-[#E2E8E5] font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <span className="font-label-md text-label-md text-on-surface font-semibold">{values[f.key]}</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="xl:col-span-4 flex flex-col gap-6 min-w-0">
          <Card className="p-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Regulatory Classification</h3>
            <div className="space-y-2">
              {business.classification.map((c) => (
                <div key={c.label} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                  <div className="min-w-0">
                    <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline">{c.label}</p>
                    <p className="font-label-md text-label-md text-on-surface font-semibold">{c.value}</p>
                  </div>
                  {c.rating && <Chip tone="primary">{c.rating}</Chip>}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="hub" className="text-primary" size={20} />
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Subscribed Authorities</h3>
            </div>
            <div className="space-y-2">
              {sources.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary font-label-sm text-label-sm font-bold shrink-0">{s.code}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-md text-label-md text-on-surface font-semibold truncate">{s.name}</p>
                    <p className="font-body-sm text-body-sm text-outline">{s.department} • {s.jurisdiction}</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary font-bold shrink-0">Live</span>
                </div>
              ))}
            </div>
            <Button variant="secondary" icon="add" className="w-full mt-3 justify-center">Subscribe to Authority</Button>
          </Card>

          <Card className="p-6 border-l-[3px] border-l-accent-teal">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="lock" size={18} className="text-accent-teal" />
              <span className="font-label-md text-label-md text-on-surface font-semibold">Data Governance</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Your registration data is used only for regulatory matching, is encrypted at rest, and is never sold or shared with third parties.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
