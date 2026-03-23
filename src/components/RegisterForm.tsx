"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: name.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        error?: string | Record<string, string[]>;
      };
      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : "Could not create account.";
        setError(msg);
        setBusy(false);
        return;
      }
      setRegistered(true);
      router.refresh();
    } catch {
      setError("Network error.");
      setBusy(false);
    }
  }

  if (registered) {
    return (
      <div className="dq-card mx-auto flex max-w-md flex-col items-center gap-5 p-8 text-center sm:p-9">
        <span className="text-4xl">📧</span>
        <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)]">
          Welcome to DoQuran!
        </h1>
        <p className="text-sm leading-relaxed text-[var(--dq-muted)]">
          We sent a verification email to{" "}
          <strong className="text-[var(--dq-ink)]">{email}</strong>. Please
          check your inbox and click the link to verify your account.
        </p>
        <p className="text-xs text-[var(--dq-muted)]">
          You can browse the platform while you wait, but you&apos;ll need to
          verify before contributing.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="font-outfit inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--dq-primary)] px-7 py-3 text-sm font-bold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_30%,transparent)] transition hover:brightness-110"
          >
            Explore DoQuran
          </Link>
          <Link
            href="/settings"
            className="font-outfit inline-flex min-h-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[var(--dq-surface)] px-6 py-3 text-sm font-bold tracking-wide text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] transition hover:bg-[var(--dq-muted-bg)]"
          >
            Set up your profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="dq-card mx-auto flex max-w-md flex-col gap-5 p-8 sm:p-9"
    >
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)]">
          Create an account
        </h1>
        <p className="mt-1 text-sm text-[var(--dq-muted)]">
          Email and password — optional display name.
        </p>
      </div>
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-[var(--dq-ink)]"
        >
          Display name <span className="font-normal text-[var(--dq-muted)]">(optional)</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="dq-input"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-[var(--dq-ink)]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="dq-input"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-[var(--dq-ink)]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="dq-input"
        />
        <p className="mt-1.5 text-xs text-[var(--dq-muted)]">
          At least 8 characters.
        </p>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-[var(--dq-primary)] py-3.5 text-sm font-semibold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_28%,transparent)] transition duration-200 hover:brightness-110 disabled:opacity-50"
      >
        {busy ? "Creating…" : "Register"}
      </button>
      <p className="text-center text-sm text-[var(--dq-muted)]">
        Already have an account?{" "}
        <Link
          href={
            nextUrl !== "/"
              ? `/login?next=${encodeURIComponent(nextUrl)}`
              : "/login"
          }
          className="font-semibold text-[var(--dq-primary)] underline decoration-[var(--dq-border)] underline-offset-2 hover:decoration-[var(--dq-primary)]"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
