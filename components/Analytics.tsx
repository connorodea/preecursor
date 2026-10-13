"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";

const CONSENT_KEY = "preecursor-optional-analytics-v1";
let memoryChoice: string | null = null;
function readChoice() {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return memoryChoice; }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("preecursor-consent", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("preecursor-consent", callback);
  };
}

/** Optional analytics never loads before a visitor opts in. The private sales
 * ledger records inquiry/booking events independently, without a tracking pixel. */
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const choice = useSyncExternalStore(subscribe, readChoice, () => null);
  useEffect(() => {
    if (!id) return;
    const runtime = window as unknown as Record<string, unknown>;
    runtime[`ga-disable-${id}`] = choice !== "accepted";
    const gtag = runtime.gtag as ((...args: unknown[]) => void) | undefined;
    gtag?.("consent", "update", { analytics_storage: choice === "accepted" ? "granted" : "denied" });
  }, [choice, id]);
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;

  function choose(value: "accepted" | "declined") {
    memoryChoice = value;
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* keep the in-memory choice */ }
    const runtime = window as unknown as Record<string, unknown>;
    runtime[`ga-disable-${id}`] = value !== "accepted";
    const gtag = runtime.gtag as ((...args: unknown[]) => void) | undefined;
    gtag?.("consent", "update", { analytics_storage: value === "accepted" ? "granted" : "denied" });
    window.dispatchEvent(new Event("preecursor-consent"));
  }

  return <>
    {choice === "accepted" && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="preecursor-ga" strategy="afterInteractive">{`
        window.dataLayer=window.dataLayer||[];
        window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
        gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
        gtag('js',new Date());
        gtag('config','${id}',{allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+location.pathname,page_referrer:''});
      `}</Script>
    </>}
    <aside aria-label="Analytics preferences" style={{ background: "#f4f6fa", color: "#112138", padding: "14px 24px", fontSize: 13 }}>
      {choice === null ? <>
        <span>Allow optional visit analytics? </span>
        <button type="button" onClick={() => choose("accepted")} style={{ marginInline: 12 }}>Allow</button>
        <button type="button" onClick={() => choose("declined")}>Decline</button>
      </> : <button type="button" onClick={() => choose(choice === "accepted" ? "declined" : "accepted")}>
        {choice === "accepted" ? "Disable optional analytics" : "Allow optional analytics"}
      </button>}
    </aside>
  </>;
}
