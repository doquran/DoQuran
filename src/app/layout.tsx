import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Amiri, Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DoQuran — daily verse & community reflections",
    template: "%s · DoQuran",
  },
  description:
    "A verse each day with Arabic and English, plus community reflections you can rate.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await getSessionUserId();
  const sessionUser = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      })
    : null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${display.variable} h-full antialiased`}
    >
      <body className="dq-body min-h-full flex flex-col">
        <a href="#main-content" className="dq-skip">
          Skip to main content
        </a>
        <SiteHeader
          key={sessionUser?.id ?? "anon"}
          initialUser={sessionUser}
        />
        <div id="main-content" className="flex-1 outline-none" tabIndex={-1}>
          {children}
        </div>
        <footer className="relative mt-auto border-t border-[color-mix(in_srgb,var(--dq-border)_70%,var(--dq-gold)_30%)] bg-[color-mix(in_srgb,var(--dq-surface)_78%,transparent)] py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] backdrop-blur-md">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--dq-gold)_45%,transparent)] to-transparent"
            aria-hidden
          />
          <div className="mx-auto max-w-5xl px-5 text-center">
            <div className="dq-ornament mb-5">
              <span className="dq-ornament__line" aria-hidden />
              <span className="dq-ornament__dot" aria-hidden />
              <span className="dq-ornament__line dq-ornament__line--r" aria-hidden />
            </div>
            <p className="font-display text-xl font-semibold tracking-wide text-[var(--dq-ink)]">
              DoQuran
            </p>
            <p className="mx-auto mt-3 max-w-md text-[0.8125rem] leading-relaxed text-[var(--dq-muted)]">
              Quranic text and English rendering are fetched from{" "}
              <a
                href="https://alquran.cloud/api"
                className="font-medium text-[var(--dq-primary)] underline decoration-[color-mix(in_srgb,var(--dq-gold)_35%,var(--dq-border))] underline-offset-[3px] transition hover:decoration-[var(--dq-gold)]"
              >
                Al Quran Cloud
              </a>
              . Community posts are user-submitted.
            </p>
            <nav
              className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.8125rem] font-medium text-[var(--dq-muted)]"
              aria-label="Legal"
            >
              <Link
                href="/privacy"
                className="text-[var(--dq-primary)] underline decoration-[color-mix(in_srgb,var(--dq-gold)_35%,var(--dq-border))] underline-offset-[3px] transition hover:decoration-[var(--dq-gold)]"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-[var(--dq-primary)] underline decoration-[color-mix(in_srgb,var(--dq-gold)_35%,var(--dq-border))] underline-offset-[3px] transition hover:decoration-[var(--dq-gold)]"
              >
                Terms
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
