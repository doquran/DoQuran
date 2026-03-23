"use client";

import { useState } from "react";

export function ShareSubmissionButton({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const shareData = { title, url };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* user cancelled */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <button
      type="button"
      onClick={() => void share()}
      className="font-outfit inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--dq-primary)_30%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-primary)_6%,var(--dq-surface))] px-4 py-2 text-xs font-bold tracking-wide text-[var(--dq-primary)] transition hover:bg-[color-mix(in_srgb,var(--dq-primary)_12%,var(--dq-surface))] active:scale-[0.97]"
    >
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
