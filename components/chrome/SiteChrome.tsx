"use client";

/**
 * SiteChrome — the client wrapper that owns the mega-menu open/close state.
 *
 * Renders the fixed header and the overlay menu, and passes its children
 * straight through. The footer is rendered separately in the root layout (it is
 * a server component) so it stays out of this client boundary.
 */

import { useState } from "react";
import SiteHeader from "./SiteHeader";
import MegaMenu from "./MegaMenu";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <SiteHeader onOpenMenu={() => setMenuOpen(true)} />
      <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {children}
    </>
  );
}
