import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Card, Chip } from '../components/ui';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { cn } from '../lib/format';

const TABS = [
  { key: 'account', label: 'Account', icon: 'person' },
  { key: 'notifications', label: 'Notifications', icon: 'notifications' },
  { key: 'security', label: 'Security', icon: 'shield' },
  { key: 'data', label: 'Data & Privacy', icon: 'database' },
  { key: 'integrations', label: 'Integrations', icon: 'extension' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function Toggle({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#E2E8E5] last:border-0">
      <div className="min-w-0">
        <p className="font-label-md text-label-md text-on-surface font-semibold">{label}</p>
        <p className="font-body-sm text-body-sm text-outline">{description}</p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        role="switch"
        aria-checked={on}
        aria-label={label}
        className={cn('relative w-11 h-6 rounded-full transition-colors shrink-0', on ? 'bg-secondary' : 'bg-surface-container-high')}
      >
        <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </div>
  );
}

export default function Settings() {
  const { user, updateUserProfile } = useAuth();
  const { sources, reload } = useAppData();
  const [tab, setTab] = useState<TabKey>('account');

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [role, setRole] = useState(user?.role ?? 'Compliance Lead');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setEmail(user.email ?? '');
      setRole(user.role ?? 'Compliance Lead');
    }
  }, [user]);

  const handleSavePreferences = async () => {
    setSaving(true);
    setSaved(false);
    setErrorMsg(null);
    try {
      await updateUserProfile({
        name,
        email,
        role,
      });
      setSaved(true);
      reload();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Workspace Controls"
        title="Settings"
        description="Manage your account, notification routing, security posture and connected authority feeds."
        actions={
          <Button icon="save" disabled={saving} onClick={() => void handleSavePreferences()}>
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        }
      />

      {saved && (
        <div className="mb-6 flex items-center gap-2 p-3 rounded-lg bg-secondary-container text-on-secondary-container font-label-md text-label-md">
          <Icon name="check_circle" size={18} /> Preferences updated successfully across workspace and Firestore.
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 flex items-center gap-2 p-3 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md">
          <Icon name="error" size={18} /> {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <Card className="p-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-label-md text-label-md transition-colors',
                  tab === t.key ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-container-low',
                )}
              >
                <Icon name={t.icon} size={18} /> {t.label}
              </button>
            ))}
          </Card>
        </div>
        <div className="lg:col-span-9 flex flex-col gap-6 min-w-0">
          {tab === 'account' && (
            <Card className="p-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-4">Account</h2>
              <div className="flex items-center gap-4 mb-5">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-on-primary font-headline-sm text-headline-sm font-bold">
                  {user?.initials ?? 'EV'}
                </span>
                <div className="min-w-0">
                  <p className="font-label-lg text-label-lg text-on-surface font-semibold">{user?.name ?? 'Compliance Lead'}</p>
                  <p className="font-body-sm text-body-sm text-outline">{user?.email ?? '—'}</p>
                </div>
                <Button variant="secondary" icon="photo_camera" className="ml-auto shrink-0">Change Photo</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Full Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3 py-2.5 rounded-lg bg-surface-container-low border border-[#E2E8E5] font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Work Email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3 py-2.5 rounded-lg bg-surface-container-low border border-[#E2E8E5] font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Role</span>
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="px-3 py-2.5 rounded-lg bg-surface-container-low border border-[#E2E8E5] font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Sign-in Provider</span>
                  <input
                    disabled
                    value={user?.provider === 'google.com' ? 'Google Workspace' : 'Email & Password'}
                    className="px-3 py-2.5 rounded-lg bg-surface-container-high border border-[#E2E8E5] font-body-md text-body-md text-on-surface-variant cursor-not-allowed"
                  />
                </label>
              </div>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card className="p-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-2">Notification Routing</h2>
              <p className="font-body-sm text-body-sm text-outline mb-4">Choose how Regnify reaches you when a matched regulation changes.</p>
              <Toggle label="Critical alerts by email" description="Immediate email the moment a critical notification matches your profile." defaultOn />
              <Toggle label="Daily intelligence digest" description="One consolidated 08:00 briefing of the previous day's gazette activity." defaultOn />
              <Toggle label="Deadline reminders" description="Escalating reminders at 30, 14, 7 and 1 day before a statutory deadline." defaultOn />
              <Toggle label="WhatsApp escalation" description="Push to the owner's WhatsApp when a task becomes overdue." />
              <Toggle label="Weekly board summary" description="Executive PDF summarising compliance health and exposure." />
            </Card>
          )}

          {tab === 'security' && (
            <>
              <Card className="p-6">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-4">Security</h2>
                <Toggle label="Two-factor authentication" description="Require a one-time code from your authenticator app at every sign-in." defaultOn />
                <Toggle label="Alert on new device sign-in" description="Email me whenever my account is accessed from an unrecognised device." defaultOn />
                <Toggle label="Enforce SSO for the workspace" description="Require all teammates to sign in through your identity provider." />
              </Card>
              <Card className="p-6">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Active Sessions</h2>
                {[
                  { device: 'Chrome • Windows 11', place: 'Pune, IN', when: 'Active now', current: true },
                  { device: 'Regnify Mobile • Android', place: 'Pune, IN', when: '2 hours ago', current: false },
                  { device: 'Safari • macOS', place: 'Mumbai, IN', when: '3 days ago', current: false },
                ].map((s) => (
                  <div key={s.device} className="flex items-center gap-3 py-3 border-b border-[#E2E8E5] last:border-0">
                    <Icon name="devices" size={20} className="text-outline" />
                    <div className="min-w-0 flex-1">
                      <p className="font-label-md text-label-md text-on-surface font-semibold">{s.device}</p>
                      <p className="font-body-sm text-body-sm text-outline">{s.place} • {s.when}</p>
                    </div>
                    {s.current ? <Chip tone="primary">This device</Chip> : <Button variant="ghost" icon="logout">Revoke</Button>}
                  </div>
                ))}
              </Card>
            </>
          )}

          {tab === 'data' && (
            <>
              <Card className="p-6">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-4">Data &amp; Privacy</h2>
                <Toggle label="Include my data in anonymised benchmarks" description="Contribute sector-level statistics without exposing company identity." defaultOn />
                <Toggle label="Allow AI training on my queries" description="Improve matching accuracy using your questions, stripped of identifiers." />
                <Toggle label="Retain audit logs for 7 years" description="Keep an immutable record of every compliance action for statutory audit." defaultOn />
              </Card>
              <Card className="p-6">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">Export &amp; Portability</h2>
                <p className="font-body-sm text-body-sm text-outline mb-4">Download a complete machine-readable copy of your profile, obligations and audit trail.</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" icon="download">Export JSON</Button>
                  <Button variant="secondary" icon="table_view">Export CSV</Button>
                  <Button variant="danger" icon="delete_forever">Delete Workspace</Button>
                </div>
              </Card>
            </>
          )}

          {tab === 'integrations' && (
            <Card className="p-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-2">Connected Authority Feeds</h2>
              <p className="font-body-sm text-body-sm text-outline mb-4">Regnify polls each subscribed authority on a rolling schedule and reconciles duplicates automatically.</p>
              <div className="space-y-3">
                {sources.map((s) => (
                  <div key={s.id} className="flex flex-wrap items-center gap-3 p-4 rounded-lg bg-surface-container-low">
                    <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-label-sm text-label-sm font-bold shrink-0">{s.code}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-label-md text-label-md text-on-surface font-semibold">{s.name}</p>
                      <p className="font-body-sm text-body-sm text-outline">{s.department} • {s.jurisdiction}</p>
                    </div>
                    <div className="text-right">
                      <Chip tone="primary">Connected</Chip>
                      <p className="font-label-sm text-label-sm text-outline mt-1">Synced {s.lastSynced}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="secondary" icon="add" className="mt-4">Connect Another Authority</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
