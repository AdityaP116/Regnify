// Brand mark reproduced from design-reference/regnify_brand_logo/code.html —
// hexagonal radar emblem + wordmark + "REGULATORY INTELLIGENCE" tagline badge.

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="regnifyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F766E" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="10" fill="url(#regnifyGrad)" />
      <circle cx="24" cy="24" r="14" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.4" fill="none" />
      <circle cx="24" cy="24" r="7" stroke="#FFFFFF" strokeWidth="2.5" fill="#0F766E" />
      <circle cx="24" cy="24" r="3" fill="#38BDF8" />
      <circle cx="34" cy="14" r="2.5" fill="#FFFFFF" />
      <path d="M28 20L34 14" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="14" cy="34" r="2.5" fill="#FFFFFF" />
      <path d="M20 28L14 34" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  size = 34,
  showTagline = false,
  variant = 'light',
  className = '',
}: {
  size?: number;
  showTagline?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
}) {
  const wordColor = variant === 'dark' ? 'text-white' : 'text-primary';
  const tagColor = variant === 'dark' ? 'text-white/50' : 'text-on-surface-variant';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-sans font-extrabold tracking-tight ${wordColor} inline-flex items-center`}
          style={{ fontSize: size * 0.62 }}
        >
          Regnify
          <span
            className="inline-block rounded-full bg-[#14B8A6] ml-1.5"
            style={{ width: size * 0.16, height: size * 0.16 }}
            aria-hidden="true"
          />
        </span>
        {showTagline && (
          <span className={`font-label-sm text-label-sm uppercase tracking-[0.16em] ${tagColor} mt-0.5`}>
            Regulatory Intelligence
          </span>
        )}
      </span>
    </span>
  );
}
