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

/** Shield — protection / detection (fraud & AML). */
export function ShieldIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3 4.5 6.2v5.3c0 4.4 3.2 7.6 7.5 8.7 4.3-1.1 7.5-4.3 7.5-8.7V6.2Z" />
      <path d="M9 11.7 11.3 14 15.2 9.4" />
    </Svg>
  );
}

/** Document — a page with a folded corner and text (data extraction). */
export function DocumentIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7Z" />
      <path d="M14 3v4h4" />
      <path d="M9 12.5h6" />
      <path d="M9 16h4" />
    </Svg>
  );
}

/** Chat — a speech bubble (customer-support copilots). */
export function ChatIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-4 3.5V15H5.5A1.5 1.5 0 0 1 4 13.5Z" />
      <path d="M8.5 9.5h.01" />
      <path d="M12 9.5h.01" />
      <path d="M15.5 9.5h.01" />
    </Svg>
  );
}

/** Gauge — a dial with a needle (risk assessment, underwriting & credit). */
export function GaugeIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 16a7 7 0 0 1 14 0" />
      <path d="M12 16 15.5 11.5" />
      <path d="M12 16h.01" />
    </Svg>
  );
}

/** Pulse — an ECG trace (clinical documentation). */
export function PulseIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M2 12h4l3 8 6-16 3 8h4" />
    </Svg>
  );
}

/** Gear — a cog (predictive maintenance). */
export function GearIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 6.4v2.4" />
      <path d="M12 15.2v2.4" />
      <path d="M6.4 12h2.4" />
      <path d="M15.2 12h2.4" />
      <path d="M8 8 9.7 9.7" />
      <path d="M14.3 14.3 16 16" />
      <path d="M16 8 14.3 9.7" />
      <path d="M8 16 9.7 14.3" />
    </Svg>
  );
}

/** Search — a magnifier (knowledge retrieval & RAG). */
export function SearchIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20 15.5 15.5" />
    </Svg>
  );
}

/** Spark — a four-point sparkle (content generation). */
export function SparkIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3.5 13.6 9.2a2 2 0 0 0 1.2 1.2L20.5 12l-5.7 1.6a2 2 0 0 0-1.2 1.2L12 20.5l-1.6-5.7a2 2 0 0 0-1.2-1.2L3.5 12l5.7-1.6a2 2 0 0 0 1.2-1.2Z" />
    </Svg>
  );
}

/** Checklist — a clipboard with a check (contract & policy review). */
export function ChecklistIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="5" y="4.5" width="14" height="16" rx="1.8" />
      <path d="M9 4.5V3.6A1.1 1.1 0 0 1 10.1 2.5h3.8A1.1 1.1 0 0 1 15 3.6v.9Z" />
      <path d="M8.5 11 10 12.5 13 9.5" />
      <path d="M8.5 16h7" />
    </Svg>
  );
}
