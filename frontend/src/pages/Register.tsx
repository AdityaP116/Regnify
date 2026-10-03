import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Divider, Field, GoogleButton, InlineError } from '../components/FormFields';
import { Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { signUpEmail, signInGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/onboarding', { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signUpEmail(name, email, password);
      // Let the useEffect handle navigation when user state updates
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Try a stronger password.');
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError(null);
    try {
      await signInGoogle();
      // Let the useEffect handle navigation when user state updates
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign up failed.');
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Start monitoring regulatory change against your business profile in minutes."
      footer={
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <InlineError>{error}</InlineError>}
        <Field label="Full name" icon="person" value={name} onChange={(e) => setName(e.target.value)} placeholder="Elena Vance" required />
        <Field label="Work email" icon="mail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
        <Field label="Password" icon="lock" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" required />
        <label className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded accent-primary" />
          I agree to the Regnify terms and acknowledge AI interpretations are clearly labelled from official sources.
        </label>
        <Button type="submit" className="w-full" disabled={busy} icon={busy ? undefined : 'person_add'}>
          {busy ? 'Creating workspace…' : 'Create account'}
        </Button>
        <Divider label="or" />
        <GoogleButton onClick={handleGoogle} label="Sign up with Google" />
      </form>
    </AuthLayout>
  );
}
