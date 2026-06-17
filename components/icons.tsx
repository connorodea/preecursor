/**
 * icons — original, on-brand geometric line icons (stroke uses `currentColor`,
 * so colour follows the surrounding text). Thin, calm, geometric to match the
 * BrandMark's language. Add new icons here as the site needs them.
 */

type IconProps = {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

function Svg({
  size = 24,
  className,
  style,
  title,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : "true"}
      aria-label={title}
    >
      {children}
    </svg>
  );
}

/** Strategy & diagnostics — a focusing target. */
export function StrategyIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** Applied builds — stacked layers/systems. */
export function BuildIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3 21 7.5 12 12 3 7.5Z" />
      <path d="M3 12 12 16.5 21 12" />
      <path d="M3 16.5 12 21 21 16.5" />
    </Svg>
  );
}

/** Scale & operate — ascending bars. */
export function ScaleIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <line x1="5" y1="20" x2="5" y2="14" />
      <line x1="12" y1="20" x2="12" y2="9" />
      <line x1="19" y1="20" x2="19" y2="4" />
    </Svg>
  );
}

/** Capability & enablement — uplift above a baseline (we lift the team). */
export function EnableIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 20h16" />
      <path d="M12 16V6" />
      <path d="M8 10 12 6 16 10" />
    </Svg>
  );
}
