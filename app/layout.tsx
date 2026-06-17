import type { Metadata, Viewport } from "next";
import { Newsreader, Archivo } from "next/font/google";
import "./globals.css";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import SiteChrome from "@/components/chrome/SiteChrome";
import SiteFooter from "@/components/chrome/SiteFooter";

// Display serif — headlines, big numbers (matches the handoff's Newsreader).
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

// UI / body sans (matches the handoff's Archivo).
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const SITE_URL = "https://preecursor.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Preecursor — Where strategic clarity meets applied AI",
    template: "%s · Preecursor",
  },
  description:
    "Preecursor is an applied-AI studio for leaders who need more than advice. Senior strategists paired with engineers who ship production AI systems.",
  openGraph: {
    type: "website",
    siteName: "Preecursor",
    url: SITE_URL,
    title: "Preecursor — Where strategic clarity meets applied AI",
    description:
      "An applied-AI studio for leaders who need more than advice — strategy and production engineering in one continuous engagement.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Preecursor — applied-AI studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Preecursor — Where strategic clarity meets applied AI",
    description:
      "An applied-AI studio for leaders who need more than advice.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  // Tints the mobile browser chrome to match the top of the page (the hero
  // wash), so the address bar blends into the design instead of clashing.
  themeColor: "#dce8f7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${newsreader.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden bg-paper text-ink font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema(), websiteSchema()]),
          }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteChrome>
          <main id="main-content" tabIndex={-1} className="flex-1">
            {children}
          </main>
        </SiteChrome>
        <SiteFooter />
      </body>
    </html>
  );
}
