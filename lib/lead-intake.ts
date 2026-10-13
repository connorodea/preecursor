export const ATTRIBUTION_KEY = "preecursor-campaign-v1";
export const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

/** Public configuration only. Never put service credentials in these URLs. */
export function publicHttpsUrl(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

export function campaignFromSearch(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const campaign: Record<string, string> = {};
  for (const key of CAMPAIGN_KEYS) {
    const value = params.get(key);
    if (value) campaign[key] = value.slice(0, 160);
  }
  return campaign;
}

export function readAttribution(): Record<string, string> {
  const current = campaignFromSearch(window.location.search);
  try {
    const stored = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}");
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return current;
    const result: Record<string, string> = {};
    for (const key of CAMPAIGN_KEYS) {
      if (typeof stored[key] === "string") result[key] = stored[key].slice(0, 160);
    }
    return Object.keys(result).length ? result : current;
  } catch {
    return current;
  }
}
