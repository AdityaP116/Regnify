import type { ReactNode } from 'react';
import { Icon } from './Icon';

// Consistent page title block for every /app/* destination.

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-2 pb-6">
      <div className="min-w-0">
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider mb-2">
            <Icon name="auto_awesome" size={13} /> {eyebrow}
          </span>
        )}
        <h1 className="font-display font-headline-lg text-headline-lg text-primary font-medium tracking-tight">{title}</h1>
        {description && <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
