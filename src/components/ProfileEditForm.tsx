"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initialDisplayName: string;
  initialBio: string;
  avatarSeed: string;
};

function diceBearUrl(seed: string, size = 96): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&size=${size}&backgroundColor=transparent`;
}

export function ProfileEditForm({
  initialDisplayName,
  initialBio,
  avatarSeed: initSeed,
}: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [avatarSeed, setAvatarSeed] = useState(initSeed);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  async function save() {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, bio }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: unknown };
        setError(typeof d.error === "string" ? d.error : "Save failed.");
        return;
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function regenerateAvatar() {
    setRegenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regenerateAvatar: true }),
      });
      if (!res.ok) {
        setError("Could not regenerate avatar.");
        return;
      }
      const d = (await res.json()) as { user: { avatarSeed: string } };
      setAvatarSeed(d.user.avatarSeed);
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={diceBearUrl(avatarSeed)}
          alt=""
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full border-2 border-[color-mix(in_srgb,var(--dq-gold)_40%,var(--dq-border))] bg-[var(--dq-surface-muted)]"
        />
        <button
          type="button"
          disabled={regenerating}
          onClick={() => void regenerateAvatar()}
          className="font-outfit rounded-full border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[var(--dq-surface)] px-4 py-2 text-xs font-bold tracking-wide text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] transition hover:bg-[var(--dq-muted-bg)] disabled:opacity-50"
        >
          {regenerating ? "Generating…" : "New avatar"}
        </button>
      </div>

      <label className="block">
        <span className="font-outfit text-sm font-semibold tracking-wide text-[var(--dq-ink)]">
          Display name
        </span>
        <input
          type="text"
          maxLength={40}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="How you appear to others"
          className="mt-1.5 block w-full rounded-lg border border-[var(--dq-border)] bg-[var(--dq-surface)] px-4 py-3 text-sm text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] outline-none placeholder:text-[var(--dq-muted)] focus:border-[color-mix(in_srgb,var(--dq-primary)_50%,var(--dq-border))] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--dq-primary)_20%,transparent)]"
        />
        <span className="mt-1 block text-[0.7rem] tabular-nums text-[var(--dq-muted)]">
          {displayName.length}/40
        </span>
      </label>

      <label className="block">
        <span className="font-outfit text-sm font-semibold tracking-wide text-[var(--dq-ink)]">
          Bio
        </span>
        <textarea
          maxLength={160}
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A sentence about yourself or your interest in the Qur'an"
          className="mt-1.5 block w-full resize-none rounded-lg border border-[var(--dq-border)] bg-[var(--dq-surface)] px-4 py-3 text-sm leading-relaxed text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] outline-none placeholder:text-[var(--dq-muted)] focus:border-[color-mix(in_srgb,var(--dq-primary)_50%,var(--dq-border))] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--dq-primary)_20%,transparent)]"
        />
        <span className="mt-1 block text-[0.7rem] tabular-nums text-[var(--dq-muted)]">
          {bio.length}/160
        </span>
      </label>

      {error ? (
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={busy}
        onClick={() => void save()}
        className="font-outfit inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--dq-primary)] px-8 py-3 text-sm font-bold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_30%,transparent)] transition duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
      >
        {busy ? "Saving…" : saved ? "Saved!" : "Save profile"}
      </button>
    </div>
  );
}
