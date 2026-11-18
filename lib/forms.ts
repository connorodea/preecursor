/**
 * Client helper for the site's forms. The site is a static export, so form
 * posts go to the `preecursor-forms` Cloudflare Worker (workers/forms/).
 * Override the endpoint at build time with NEXT_PUBLIC_FORMS_ENDPOINT.
 */
export const FORMS_ENDPOINT = (
  process.env.NEXT_PUBLIC_FORMS_ENDPOINT ||
  "https://preecursor-forms.connorodea.workers.dev"
).replace(/\/$/, "");

export type FormKind = "contact" | "subscribe";
export type FormStatus = "idle" | "sending" | "sent" | "error";

export type SubmitResult = { ok: true } | { ok: false; error: string };

const FALLBACK_ERROR =
  "We couldn't send that just now. Please try again, or email us directly.";

/** POST the fields as JSON. Never throws: network failures become `ok:false`. */
export async function submitForm(
  kind: FormKind,
  fields: Record<string, string>,
): Promise<SubmitResult> {
  try {
    const res = await fetch(`${FORMS_ENDPOINT}/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    const body = (await res.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;
    if (res.ok && body?.ok) return { ok: true };
    return { ok: false, error: body?.error || FALLBACK_ERROR };
  } catch {
    return { ok: false, error: FALLBACK_ERROR };
  }
}

/** Read a <form>'s named fields into a plain string map. */
export function readForm(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {};
  new FormData(form).forEach((v, k) => {
    if (typeof v === "string") out[k] = v;
  });
  return out;
}
