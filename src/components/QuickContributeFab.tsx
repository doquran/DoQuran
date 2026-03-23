"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDE_PREFIXES = ["/contribute", "/login", "/register"];

function hideFab(pathname: string) {
  return HIDE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

/** One-tap path to write — mobile / tablet only; keeps desktop minimal. */
export function QuickContributeFab() {
  const pathname = usePathname();
  if (hideFab(pathname)) return null;

  return (
    <Link
      href="/contribute"
      className="font-outfit fixed bottom-[max(1.1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 flex h-[3.25rem] min-h-[3.25rem] items-center gap-2 rounded-full bg-[var(--dq-primary)] pl-4 pr-5 text-sm font-bold tracking-wide text-[color-mix(in_srgb,white_94%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-2 ring-[color-mix(in_srgb,var(--dq-gold)_32%,transparent)] transition duration-200 hover:brightness-110 active:scale-[0.97] lg:hidden"
      aria-label="Write a reflection"
    >
      <svg
        className="h-5 w-5 shrink-0 opacity-95"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
      <span>Write</span>
    </Link>
  );
}
