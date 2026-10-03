import { Icon } from './Icon';
import { Button, Card } from './ui';

// Shared loading / empty / error / retry states (master prompt §18).

export function LoadingState({ label = 'Synchronizing regulatory feeds…' }: { label?: string }) {
  return (
    <Card className="p-10 flex flex-col items-center justify-center text-center gap-4">
      <span className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inline-flex h-full w-full rounded-full bg-secondary/30 animate-ping" />
        <span className="relative inline-flex h-8 w-8 rounded-full bg-primary items-center justify-center">
          <Icon name="radar" className="text-on-primary" size={18} />
        </span>
      </span>
      <div>
        <p className="font-headline-sm text-headline-sm text-on-surface">Running intelligence pipeline</p>
        <p className="font-body-sm text-body-sm text-outline mt-1">{label}</p>
      </div>
      <div className="w-full max-w-sm space-y-2 pt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-2 rounded-full bg-surface-container animate-pulse" style={{ width: `${90 - i * 18}%` }} />
        ))}
      </div>
    </Card>
  );
}

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="p-10 flex flex-col items-center justify-center text-center gap-3">
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-container text-on-surface-variant">
        <Icon name={icon} size={24} />
      </span>
      <div>
        <p className="font-headline-sm text-headline-sm text-on-surface">{title}</p>
        {description && <p className="font-body-sm text-body-sm text-outline mt-1 max-w-md">{description}</p>}
      </div>
      {action}
    </Card>
  );
}

export function ErrorState({
  title = 'Intelligence feed unavailable',
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="p-10 flex flex-col items-center justify-center text-center gap-3 border-error/30">
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-error-container text-on-error-container">
        <Icon name="error" size={24} />
      </span>
      <div>
        <p className="font-headline-sm text-headline-sm text-on-surface">{title}</p>
        <p className="font-body-sm text-body-sm text-outline mt-1 max-w-md">
          {description ?? 'We could not reach the regulatory service. Retry, or continue with the local corpus.'}
        </p>
      </div>
      {onRetry && (
        <Button variant="secondary" icon="refresh" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Card>
  );
}
