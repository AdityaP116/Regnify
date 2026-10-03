import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Field, InlineError } from '../components/FormFields';
import { Button } from '../components/ui';
import { Icon } from '../components/Icon';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) {
      setError('Enter the email associated with your workspace.');
      return;
    }
    setBusy(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 600));
    setBusy(false);
    setSent(true);
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a secure link to reset your Regnify credentials."
      footer={
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Remembered it?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center text-center gap-3 py-6">
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container">
            <Icon name="mark_email_read" size={24} />
          </span>
          <p className="font-headline-sm text-headline-sm text-on-surface">Check your inbox</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
            If an account exists for <span className="font-semibold">{email}</span>, a reset link is on its way. The link expires in 30 minutes.
          </p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <InlineError>{error}</InlineError>}
          <Field label="Work email" icon="mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
          <Button type="submit" className="w-full" disabled={busy} icon="send">
            {busy ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
