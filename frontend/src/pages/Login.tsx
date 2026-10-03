import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Divider, Field, GoogleButton, InlineError } from '../components/FormFields';
import { Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signInEmail, signInGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/app/overview';

  const [email, setEmail] = useState('elena.vance@precisionfab.in');
  const [password, setPassword] = useState('regnify-demo');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signInEmail(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Check your credentials.');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError(null);
    try {
      await signInGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign in failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Regnify regulatory intelligence workspace."
      footer={
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          New to Regnify?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <InlineError>{error}</InlineError>}
        <Field label="Work email" icon="mail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field label="Password" icon="lock" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-primary" />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-label-md text-label-md text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={busy} icon={busy ? undefined : 'login'}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
        <Divider label="or" />
        <GoogleButton onClick={handleGoogle} />
        <p className="font-body-sm text-body-sm text-outline text-center pt-1">
          Demo mode: any email + password signs you in with the seeded Precision Fab Ltd workspace.
        </p>
      </form>
    </AuthLayout>
  );
}
