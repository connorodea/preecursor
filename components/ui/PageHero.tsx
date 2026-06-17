"use client";

/**
 * PageHero — the standard page-top hero for hub / detail pages.
 *
 * Generalizes the landing Hero: an optional animated ShaderField + light
 * vignette over the heroWash, eyebrow → serif H1 → lede → CTA row, all with a
 * soft page-load entrance.
 *
 * IMPORTANT: a global header is `position:fixed; z-50` (~96px tall) and
 * overlays the top of every page, so the inner padding-top uses
 * `clamp(140px,16vh,180px)` to clear it.
 */

import Link from "next/link";
import { Fragment } from "react";
import ShaderField from "@/components/ShaderField";
import { HeroStagger, HeroItem } from "@/lib/motion";
import { color, gradient, inkA } from "@/lib/theme";
import Eyebrow from "./Eyebrow";
import PillLink from "./PillLink";

type Align = "left" | "center";

type Cta = {
  label: string;
  href: string;
  variant?: "brand" | "azure" | "dark" | "outline" | "ghost";
};

/** One step in the breadcrumb trail. The last item is the current page. */
type Crumb = { label: string; href: string };

type Props = {
  eyebrow?: string;
  title: string;
  lede?: string;
  cta?: Cta;
  secondaryCta?: Cta;
  /**
   * Breadcrumb trail (root → … → current page), rendered as an accessible nav
   * above the eyebrow. The final item is treated as the current page: plain
   * text with `aria-current="page"`, not a link.
   */
  breadcrumbs?: Crumb[];
  /** Render the animated shader mesh + vignette behind the content. */
  shader?: boolean;
  align?: Align;
};

export default function PageHero({
  eyebrow,
  title,
  lede,
  cta,
  secondaryCta,
  breadcrumbs,
  shader = false,
  align = "left",
}: Props) {
  const centered = align === "center";

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: shader ? gradient.heroWash : color.paper,
      }}
    >
      {shader && (
        <>
          <ShaderField style={{ zIndex: 0 }} />
          {/* Light vignette — keeps headline text legible over the mesh. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              background:
                "radial-gradient(115% 100% at 15% 42%, rgba(255,255,255,0.62), rgba(255,255,255,0.12) 46%, rgba(255,255,255,0) 70%)",
            }}
          />
        </>
      )}

      <div
        className="mx-auto w-full max-w-[1340px] px-6 md:px-10 lg:px-[50px]"
        style={{
          position: "relative",
          zIndex: 5,
          // Top pad clears the fixed ~96px header.
          paddingTop: "clamp(120px,16vh,180px)",
          paddingBottom: 72,
        }}
      >
        <HeroStagger
          style={
            centered
              ? {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }
              : undefined
          }
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <HeroItem style={{ marginBottom: 18 }}>
              <nav
                aria-label="Breadcrumb"
                style={{
                  fontSize: 13,
                  letterSpacing: "0.01em",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: centered ? "center" : "flex-start",
                }}
              >
                {breadcrumbs.map((crumb, i) => {
                  const isLast = i === breadcrumbs.length - 1;
                  return (
                    <Fragment key={crumb.href}>
                      {i > 0 && (
                        <span aria-hidden="true" style={{ color: inkA(0.35) }}>
                          ›
                        </span>
                      )}
                      {isLast ? (
                        <span
                          aria-current="page"
                          style={{ color: inkA(0.8), fontWeight: 600 }}
                        >
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          style={{ color: inkA(0.55), textDecoration: "none" }}
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </Fragment>
                  );
                })}
              </nav>
            </HeroItem>
          )}

          {eyebrow && (
            <HeroItem style={{ marginBottom: 26 }}>
              <Eyebrow label={eyebrow} tone="brand" />
            </HeroItem>
          )}

          <HeroItem>
            <h1
              style={{
                fontFamily: "var(--font-newsreader)",
                fontWeight: 500,
                fontSize: "clamp(40px,5vw,76px)",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                color: color.ink,
                maxWidth: "16ch",
                textWrap: "balance",
                ...(centered ? { marginInline: "auto" } : null),
              }}
            >
              {title}
            </h1>
          </HeroItem>

          {lede && (
            <HeroItem>
              <p
                style={{
                  marginTop: 28,
                  fontSize: "clamp(18px,1.6vw,22px)",
                  lineHeight: 1.45,
                  color: inkA(0.66),
                  maxWidth: "46ch",
                  ...(centered ? { marginInline: "auto" } : null),
                }}
              >
                {lede}
              </p>
            </HeroItem>
          )}

          {(cta || secondaryCta) && (
            <HeroItem>
              <div
                style={{
                  marginTop: 36,
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  justifyContent: centered ? "center" : "flex-start",
                }}
              >
                {cta && (
                  <PillLink href={cta.href} variant={cta.variant ?? "brand"}>
                    {cta.label}
                  </PillLink>
                )}
                {secondaryCta && (
                  <PillLink
                    href={secondaryCta.href}
                    variant={secondaryCta.variant ?? "outline"}
                  >
                    {secondaryCta.label}
                  </PillLink>
                )}
              </div>
            </HeroItem>
          )}
        </HeroStagger>
      </div>
    </section>
  );
}
