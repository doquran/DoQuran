"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Status = "verifying" | "success" | "error" | "no-token";

export function VerifyEmailClient() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>(token ? "verifying" : "no-token");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (cancelled) return;
        if (res.ok) {
          setStatus("success");
          router.refresh();
        } else {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          setStatus("error");
          setErrorMsg(
            data.error || "Verification failed. The link may have expired.",
          );
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg("Network error. Please try again.");
        }
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [token, router]);

  return (
    <div className="dq-card mx-auto flex max-w-md flex-col items-center gap-5 p-8 text-center sm:p-9">
      {status === "verifying" ? (
        <>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--dq-border)] border-t-[var(--dq-primary)]" />
          <p className="font-outfit text-sm font-medium text-[var(--dq-muted)]">
            Verifying your email…
          </p>
        </>
      ) : status === "no-token" ? (
        <>
          <span className="text-4xl">✕</span>
          <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)]">
            Missing token
          </h1>
          <p className="text-sm text-[var(--dq-muted)]">
            No verification token found in the URL. Please check the link in your email.
          </p>
          <Link
            href="/settings"
            className="font-outfit mt-2 text-sm font-semibold text-[var(--dq-primary)] underline decoration-[var(--dq-border)] underline-offset-2 transition hover:decoration-[var(--dq-primary)]"
          >
            Go to settings to request a new link
          </Link>
        </>
      ) : status === "success" ? (
        <>
          <span className="text-4xl">✓</span>
          <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)]">
            Email verified
          </h1>
          <p className="text-sm text-[var(--dq-muted)]">
            Your email has been confirmed. You can now contribute reflections.
          </p>
          <Link
            href="/contribute"
            className="font-outfit mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--dq-primary)] px-7 py-3 text-sm font-bold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_30%,transparent)] transition hover:brightness-110"
          >
            Start contributing
          </Link>
        </>
      ) : (
        <>
          <span className="text-4xl">✕</span>
          <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)]">
            Verification failed
          </h1>
          <p className="text-sm text-[var(--dq-muted)]">{errorMsg}</p>
          <Link
            href="/settings"
            className="font-outfit mt-2 text-sm font-semibold text-[var(--dq-primary)] underline decoration-[var(--dq-border)] underline-offset-2 transition hover:decoration-[var(--dq-primary)]"
          >
            Go to settings to request a new link
          </Link>
        </>
      )}
    </div>
  );
}
