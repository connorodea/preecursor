/**
 * components/Analytics.tsx — Google Analytics 4 (GA4), env-gated.
 *
 * Renders the standard gtag.js install snippet as raw <script> tags — the same
 * pattern the root layout already uses for JSON-LD. Raw tags land directly in
 * the static export, so this works with `output: 'export'` (no server runtime,
 * no extra dependency).
 *
 * Gated on NEXT_PUBLIC_GA_ID, which Next inlines at build time. With no id set
 * the component renders nothing, so the integration is completely inert until a
 * measurement id is supplied to the build (see the deploy workflow + .env.example).
 *
 * Note: once an id is set this fires GA4 on every page load. A cookie-consent
 * banner / GA Consent Mode is the recommended follow-up before enabling it in
 * jurisdictions that require opt-in. IP anonymization is on by default below.
 */
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html:
            `window.dataLayer=window.dataLayer||[];` +
            `function gtag(){dataLayer.push(arguments);}` +
            `gtag('js',new Date());` +
            `gtag('config','${id}',{anonymize_ip:true});`,
        }}
      />
    </>
  );
}
