import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';
import { cn, relevanceTone, statusTone, taskStatusTone } from '../lib/format';
import type { RegulationStatus, Relevance } from '../lib/types';

// ---------------------------------------------------------------------------
// Surface + typography primitives (DESIGN.md §Components, §Elevation & Depth)
// ---------------------------------------------------------------------------

export function Card({
  children,
  className = '',
  as: Tag = 'div',
  ...rest
}: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article' } & HTMLAttributes<HTMLDivElement>) {
  return (
    <Tag
      className={cn(
        'bg-surface-container-lowest border border-[#E2E8E5] rounded-xl',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function SectionHeader({
  icon,
  title,
  action,
  subtitle,
}: {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        {icon && <Icon name={icon} className="text-primary" size={20} />}
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{title}</h2>
          {subtitle && <p className="font-body-sm text-body-sm text-outline">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

type Variant = 'primary' | 'secondary' | 'ai' | 'ghost' | 'danger';

const variantClass: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-container active:bg-primary border border-transparent',
  secondary:
    'bg-surface-container-lowest text-on-surface border border-[#E2E8E5] hover:border-primary hover:bg-surface-container-low',
  ai: 'bg-[rgba(99,102,241,0.08)] text-ai-indigo border border-[rgba(99,102,241,0.3)] hover:bg-[rgba(99,102,241,0.15)]',
  ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low',
  danger: 'bg-error text-on-error hover:bg-[#9c1616] border border-transparent',
};

export function Button({
  children,
  variant = 'primary',
  icon,
  className = '',
  ...rest
}: {
  children?: ReactNode;
  variant?: Variant;
  icon?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-label-md text-label-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variantClass[variant],
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Categorical badges (DESIGN.md §Chips & Badges)
// ---------------------------------------------------------------------------

export function RelevanceBadge({ relevance, score }: { relevance: Relevance; score?: number }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm',
        relevanceTone[relevance],
      )}
    >
      <Icon name="bolt" size={13} />
      {score !== undefined ? `${score}% Match` : relevance.toUpperCase()}
    </span>
  );
}

export function StatusBadge({ status }: { status: RegulationStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm',
        statusTone(status),
      )}
    >
      {status}
    </span>
  );
}

export function TaskStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm capitalize',
        taskStatusTone(status),
      )}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

/** Outlined "official gazette" provenance marker. */
export function OfficialSourceBadge({ label = 'Official Source Verified' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E2E8E5] bg-surface-container-lowest font-label-sm text-label-sm text-[#64748B]">
      <Icon name="verified" size={14} />
      {label}
    </span>
  );
}

/** Indigo "AI interpretation" provenance marker — never mixed with official. */
export function AiBadge({ label = 'Regnify AI Analyzed' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF2FF] font-label-sm text-label-sm font-bold text-ai-indigo">
      <Icon name="auto_awesome" size={14} />
      {label}
    </span>
  );
}

export function Chip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'primary' | 'warning' }) {
  const tones = {
    neutral: 'bg-surface-container text-on-surface-variant',
    primary: 'bg-primary/10 text-primary',
    warning: 'bg-[#fef3c7] text-[#b45309]',
  } as const;
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded font-label-sm text-label-sm font-semibold', tones[tone])}>
      {children}
    </span>
  );
}

/** Failure-safe image/avatar initial tile. */
export function Initials({ value, tone = 'primary' }: { value: string; tone?: 'primary' | 'secondary' }) {
  const tones = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
  } as const;
  return (
    <span className={cn('flex items-center justify-center w-9 h-9 rounded font-label-md text-label-md font-bold', tones[tone])}>
      {value}
    </span>
  );
}
