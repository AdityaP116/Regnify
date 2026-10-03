import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { Logo } from './Logo';

// Split layout: form on the left, brand/intelligence panel on the right.
// Mirrors the calm editorial tone of the design system.

const highlights = [
  { icon: 'radar', title: 'Continuous monitoring', detail: '48+ federal & state portals scraped and verified daily.' },
  { icon: 'neurology', title: 'AI synthesis', detail: 'Plain-language explanations grounded in official gazettes.' },
  { icon: 'task_alt', title: 'Closed-loop compliance', detail: 'Every change becomes an owner-assigned, deadline-tracked task.' },
];

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface">
      <div className="flex flex-col px-6 sm:px-10 lg:px-16 py-8">
        <Link to="/" className="self-start">
          <Logo size={30} showTagline />
        </Link>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto py-10">
            <h1 className="font-display font-headline-lg text-headline-lg text-primary tracking-tight">{title}</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-center">{footer}</div>}
          </div>
        </div>
        <p className="font-body-sm text-body-sm text-outline">© 2025 Regnify Intelligence Systems</p>
      </div>

      <div className="hidden lg:flex flex-col justify-center relative overflow-hidden bg-primary text-on-primary px-16">
        <div className="absolute inset-0 pointer-events-none bg-blueprint-light opacity-10" />
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-primary-container/40 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-md">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider mb-6">
            <Icon name="verified_user" size={16} /> Regulatory Intelligence Platform
          </span>
          <h2 className="font-display font-headline-lg text-headline-lg leading-tight text-balance">Know the Change. Take Action.</h2>
          <p className="font-body-md text-body-md text-on-primary-container mt-4">
            Regnify converts dense government notifications into prioritized, audit-ready compliance action.
          </p>
          <div className="mt-10 space-y-5">
            {highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 shrink-0">
                  <Icon name={h.icon} size={20} />
                </span>
                <div>
                  <p className="font-label-md text-label-md font-semibold">{h.title}</p>
                  <p className="font-body-sm text-body-sm text-on-primary-container">{h.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
