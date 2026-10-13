import type { Metadata } from "next";
import { Section } from "@/components/ui";

export const metadata: Metadata = { title: "Inquiry privacy", description: "How Preecursor handles discovery inquiries." };

export default function PrivacyPage() {
  return <main style={{ paddingTop: 120 }}><Section tone="paper">
    <h1 style={{ fontSize: 40, marginBottom: 28 }}>Your discovery inquiry</h1>
    <div style={{ maxWidth: 760, lineHeight: 1.8 }}>
      <p>We use your name, work email, company, project details, budget and timing to evaluate your request, respond, and arrange a discovery conversation. Please do not submit confidential client files or sensitive personal records.</p>
      <p>When you submit an inquiry, we record your contact permission and the campaign tags associated with your visit. Repeated inquiries may be linked using your email address. An automated score helps prioritize review; a person determines whether a project is a fit.</p>
      <p>When configured, our service providers include Cloudflare Turnstile for spam protection, HubSpot for customer records, Resend for inquiry follow-ups, and Calendly for scheduling. Booking opens the scheduling provider’s site and is subject to its privacy terms. No marketing subscription is created by this form.</p>
      <p>Follow-ups include an unsubscribe link. You can also ask to stop contact, correct your details, or delete your inquiry by emailing <a href="mailto:hello@preecursor.com">hello@preecursor.com</a>. We retain a minimal suppression record to honor requests to stop contact.</p>
      <p>Access is restricted to authorized operators and configured service providers. We review inactive inquiries for deletion after 180 days unless an ongoing business relationship or other retention requirement applies.</p>
    </div>
  </Section></main>;
}
