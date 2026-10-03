// Material Symbols Outlined wrapper. The reference screens use this icon set
// throughout; keeping a thin wrapper centralises sizing and the FILL axis.

export function Icon({
  name,
  className = '',
  size,
  fill = false,
}: {
  name: string;
  className?: string;
  size?: number;
  fill?: boolean;
}) {
  return (
    <span
      className={`material-symbols-outlined ${fill ? 'fill' : ''} ${className}`}
      style={size ? { fontSize: `${size}px` } : undefined}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
