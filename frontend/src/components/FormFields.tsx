import type { InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';
import { cn } from '../lib/format';

export function Field({
  label,
  icon,
  id,
  className = '',
  ...rest
}: { label: string; icon?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
      <div className="relative mt-1.5">
        {icon && <Icon name={icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />}
        <input
          id={id}
          className={cn(
            'w-full bg-surface-container-lowest border border-[#E2E8E5] rounded-lg py-2.5 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/70',
            'focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/15',
            icon ? 'pl-10 pr-3' : 'px-3',
            className,
          )}
          {...rest}
        />
      </div>
    </label>
  );
}

export function InlineError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-error-container text-on-error-container border border-error/20">
      <Icon name="error" size={18} className="mt-0.5 shrink-0" />
      <span className="font-body-sm text-body-sm">{children}</span>
    </div>
  );
}

export function GoogleButton({ onClick, label = 'Continue with Google' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 border border-[#E2E8E5] bg-surface-container-lowest rounded-lg py-2.5 font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.3-.4-3.5z" />
      </svg>
      {label}
    </button>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex-1 h-px bg-[#E2E8E5]" />
      <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">{label}</span>
      <span className="flex-1 h-px bg-[#E2E8E5]" />
    </div>
  );
}