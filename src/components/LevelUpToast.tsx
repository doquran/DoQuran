"use client";

import { useEffect, useState } from "react";
import { SEAL_TIER_LABELS, type SealTier } from "@/lib/levels";

export type LevelUpEvent = {
  sealSlug: string;
  sealLabel: string;
  newLevel: number;
};

const LEVEL_UP_EVENT = "dq:levelup";

/** Fire from anywhere to trigger the toast. */
export function dispatchLevelUp(detail: LevelUpEvent) {
  window.dispatchEvent(new CustomEvent(LEVEL_UP_EVENT, { detail }));
}

export function LevelUpToast() {
  const [toast, setToast] = useState<LevelUpEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<LevelUpEvent>).detail;
      setToast(detail);
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setToast(null), 400);
      }, 5000);
      return () => clearTimeout(t);
    }
    window.addEventListener(LEVEL_UP_EVENT, handler);
    return () => window.removeEventListener(LEVEL_UP_EVENT, handler);
  }, []);

  if (!toast) return null;

  const tierName = SEAL_TIER_LABELS[toast.newLevel as SealTier] ?? "Unknown";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 transition-all duration-400 lg:bottom-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="font-outfit flex items-center gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--dq-gold)_50%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-surface)_95%,var(--dq-gold)_5%)] px-6 py-4 shadow-[var(--dq-shadow-lg)] backdrop-blur-md">
        <span className="text-2xl" aria-hidden>
          ✨
        </span>
        <div>
          <p className="text-sm font-bold tracking-wide text-[var(--dq-ink)]">
            Level up!
          </p>
          <p className="mt-0.5 text-xs font-medium text-[var(--dq-muted)]">
            You reached{" "}
            <strong className="text-[var(--dq-primary)]">
              {tierName} {toast.sealLabel}
            </strong>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setTimeout(() => setToast(null), 400);
          }}
          className="ml-2 rounded-full p-1 text-[var(--dq-muted)] transition hover:bg-[var(--dq-muted-bg)] hover:text-[var(--dq-ink)]"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
