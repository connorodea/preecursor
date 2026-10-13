"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

export default function LeadVerification({ siteKey, resetKey, onToken }: {
  siteKey: string; resetKey: number; onToken: (token: string) => void;
}) {
  const element = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const callback = useRef(onToken);
  useEffect(() => { callback.current = onToken; }, [onToken]);
  useEffect(() => {
    if (widget.current !== null) window.turnstile?.reset(widget.current);
    callback.current("");
  }, [resetKey]);
  useEffect(() => () => {
    if (widget.current !== null) window.turnstile?.remove(widget.current);
    widget.current = null;
  }, []);
  function mount() {
    if (!element.current || !window.turnstile || widget.current !== null) return;
    widget.current = window.turnstile.render(element.current, {
      sitekey: siteKey, action: "lead-intake", callback: (token: string) => callback.current(token),
      "expired-callback": () => callback.current(""), "error-callback": () => callback.current(""),
    });
  }
  return <>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={mount} />
    <div ref={element} aria-label="Spam verification" style={{ marginBottom: 18 }} />
  </>;
}
