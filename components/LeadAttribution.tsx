"use client";

import { useEffect } from "react";
import { ATTRIBUTION_KEY, campaignFromSearch } from "@/lib/lead-intake";

/** Session-only first campaign attribution; no identity or full URLs retained. */
export default function LeadAttribution() {
  useEffect(() => {
    const campaign = campaignFromSearch(window.location.search);
    if (!Object.keys(campaign).length) return;
    try {
      if (!sessionStorage.getItem(ATTRIBUTION_KEY)) {
        sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(campaign));
      }
    } catch { /* Restricted browser storage must not block the contact form. */ }
  }, []);
  return null;
}
