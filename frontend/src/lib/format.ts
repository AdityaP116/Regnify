import type { Relevance, RegulationStatus } from './types';

// Shared presentation helpers. Kept dependency-free so both the shell and the
// API fallback path render identically.

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export const relevanceTone: Record<Relevance, string> = {
  critical: 'bg-error-container text-on-error-container',
  high: 'bg-secondary-container text-on-secondary-container',
  medium: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  low: 'bg-surface-container text-on-surface-variant',
};

export function statusTone(status: RegulationStatus): string {
  switch (status) {
    case 'Action Required':
      return 'bg-error-container text-on-error-container';
    case 'Review Needed':
      return 'bg-[#fef3c7] text-[#b45309]';
    case 'Informational':
      return 'bg-surface-container text-on-surface-variant';
    case 'Compliant':
    case 'In Effect':
      return 'bg-secondary-container text-on-secondary-container';
    default:
      return 'bg-surface-container text-on-surface-variant';
  }
}

export function taskStatusTone(status: string): string {
  switch (status) {
    case 'overdue':
      return 'bg-error-container text-on-error-container';
    case 'in_progress':
      return 'bg-[#fef3c7] text-[#b45309]';
    case 'completed':
      return 'bg-secondary-container text-on-secondary-container';
    default:
      return 'bg-surface-container text-on-surface-variant';
  }
}

export function severityTone(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-error';
    case 'warning':
      return 'text-[#b45309]';
    default:
      return 'text-primary';
  }
}

export function titleCase(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// Simulated network latency so loading/empty/error states are exercised in demo
// mode without ever looking janky.
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
