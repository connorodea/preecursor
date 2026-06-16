import type { Metadata } from "next";
import { Newsreader, Archivo } from "next/font/google";
import "./globals.css";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Preecursor — Where strategic clarity meets applied AI",
    description:
      "An applied-AI studio for leaders who need more than advice.",
  },
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
        {children}
      </body>
    </html>
  );
}
