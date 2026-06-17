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

/** Embedded — a smaller form nested inside a larger one (inside your teams). */
export function EmbedIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <rect x="8.5" y="8.5" width="7" height="7" rx="1.5" />
    </Svg>
  );
}

/** Outcomes — a measured result reached (the number moved). */
export function OutcomeIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12 11 15 16 9" />
    </Svg>
  );
}

/** Hand-off — transfer from us to your team (A → B). */
export function HandoffIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="5" cy="12" r="2.5" />
      <circle cx="19" cy="12" r="2.5" />
      <path d="M8 12h6" />
      <path d="M12.5 9.5 15 12 12.5 14.5" />
    </Svg>
  );
}

/** Network — connected nodes (a platform at scale). */
export function NetworkIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="6" cy="7" r="2.4" />
      <circle cx="18" cy="7" r="2.4" />
      <circle cx="12" cy="18" r="2.4" />
      <path d="M8.4 7h7.2" />
      <path d="M7.2 9.1 10.8 15.9" />
      <path d="M16.8 9.1 13.2 15.9" />
    </Svg>
  );
}

/** Labs — a flask (experimentation, R&D). */
export function LabsIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9 3h6" />
      <path d="M10 3v6l-4.8 8.4A1.3 1.3 0 0 0 6.4 19.5h11.2a1.3 1.3 0 0 0 1.2-2.1L14 9V3" />
      <path d="M8.2 14h7.6" />
    </Svg>
  );
}
