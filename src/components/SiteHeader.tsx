"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { DoQuranBrandLogo } from "@/components/DoQuranBrandLogo";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  displayName?: string | null;
  avatarSeed?: string;
};

type Props = { initialUser: SessionUser | null };

function navLinkClass(active: boolean, fullWidth = false) {
  return [
    fullWidth ? "flex w-full justify-center py-3.5 text-center" : "px-4 py-2.5",
    "rounded-lg text-[0.9375rem] font-semibold tracking-wide transition-colors duration-200 lg:text-base",
    active
      ? "bg-[color-mix(in_srgb,var(--dq-primary)_14%,transparent)] text-[var(--dq-primary)] ring-2 ring-[color-mix(in_srgb,var(--dq-gold)_35%,transparent)]"
      : "text-[var(--dq-ink)] hover:bg-[color-mix(in_srgb,var(--dq-primary)_7%,transparent)] hover:text-[var(--dq-primary)]",
  ].join(" ");
}

/** Logged-in primary action: reads clearly next to the logo. */
function contributeNavClass(active: boolean, fullWidth = false) {
  const pad = fullWidth
    ? "flex w-full justify-center py-3.5 text-center"
    : "px-5 py-2.5 lg:px-6 lg:py-3";
  if (active) {
    return [
      pad,
      "rounded-full text-[0.9375rem] font-semibold tracking-wide transition lg:text-base",
      "bg-[color-mix(in_srgb,var(--dq-primary)_18%,var(--dq-surface))] text-[var(--dq-primary)]",
      "ring-2 ring-[color-mix(in_srgb,var(--dq-gold)_40%,transparent)] shadow-[var(--dq-shadow-sm)]",
    ].join(" ");
  }
  return [
    pad,
    "rounded-full text-[0.9375rem] font-semibold tracking-wide transition lg:text-base",
    "border-2 border-[color-mix(in_srgb,var(--dq-primary)_45%,var(--dq-border))]",
    "bg-[color-mix(in_srgb,var(--dq-primary)_8%,var(--dq-surface))] text-[var(--dq-primary)]",
    "shadow-[var(--dq-shadow-sm)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_22%,transparent)]",
    "hover:bg-[color-mix(in_srgb,var(--dq-primary)_14%,var(--dq-surface))] hover:brightness-[1.02]",
  ].join(" ");
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-5 w-5 text-[var(--dq-ink)]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function SiteHeader({ initialUser }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const t = window.setTimeout(() => setMenuOpen(false), 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  async function logout() {
    setMenuOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--dq-border)_75%,var(--dq-gold)_25%)] bg-[color-mix(in_srgb,var(--dq-surface)_86%,transparent)] shadow-[var(--dq-shadow-sm)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--dq-surface)_72%,transparent)]">
      {menuOpen ? (
        <div
          role="presentation"
          className="fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--dq-ink)_28%,transparent)] backdrop-blur-[2px] transition-opacity duration-200 lg:hidden"
          aria-hidden
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--dq-gold)_35%,transparent)] to-transparent"
        aria-hidden
      />
      <div
        className="relative z-50 flex w-full max-w-none items-center justify-between gap-2 px-[max(0.75rem,env(safe-area-inset-left))] py-2 pr-[max(0.75rem,env(safe-area-inset-right))] pt-[max(0.5rem,env(safe-area-inset-top))] lg:gap-4 lg:px-0 lg:py-0 lg:pt-0"
      >
        <Link
          href="/"
          aria-label="DoQuran home"
          onClick={() => setMenuOpen(false)}
          className="group flex min-w-0 shrink items-center outline-none ring-[var(--dq-primary)] ring-offset-2 ring-offset-[var(--dq-bg)] focus-visible:rounded-lg focus-visible:ring-2"
        >
          <DoQuranBrandLogo className="h-12 w-auto max-w-[min(11rem,56vw)] sm:h-16 sm:max-w-[min(18rem,72vw)] lg:h-[5.5rem] lg:max-w-[min(32rem,92vw)] xl:h-[6.5rem] xl:max-w-none" />
        </Link>

        <button
          type="button"
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[var(--dq-surface)] text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] transition hover:bg-[var(--dq-muted-bg)] lg:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <MenuIcon open={menuOpen} />
        </button>

        <nav
          className="hidden flex-wrap items-center justify-end gap-2 lg:flex lg:gap-3"
          aria-label="Main"
        >
          <Link
            href="/contribute"
            className={
              user
                ? contributeNavClass(pathname === "/contribute")
                : navLinkClass(pathname === "/contribute")
            }
            aria-current={pathname === "/contribute" ? "page" : undefined}
          >
            Contribute
          </Link>
          {user ? (
            <>
              <Link
                href={`/profile/${user.id}`}
                className="hidden items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--dq-border)_82%,var(--dq-gold)_18%)] bg-[var(--dq-surface-muted)] px-3 py-1.5 text-[0.9375rem] font-semibold tracking-wide text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] transition hover:border-[color-mix(in_srgb,var(--dq-primary)_25%,var(--dq-border))] sm:inline-flex lg:text-base"
                title={user.email}
              >
                {user.avatarSeed ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(user.avatarSeed)}&size=56&backgroundColor=transparent`}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full"
                  />
                ) : null}
                <span className="max-w-[10rem] truncate">
                  {user.displayName?.trim() || user.name?.trim() || user.email.split("@")[0]}
                </span>
              </Link>
              <Link
                href="/settings"
                className={navLinkClass(pathname === "/settings")}
                aria-current={pathname === "/settings" ? "page" : undefined}
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={() => void logout()}
                className="rounded-lg border-2 border-[color-mix(in_srgb,var(--dq-border)_88%,var(--dq-gold)_14%)] bg-[var(--dq-surface)] px-4 py-2.5 text-[0.9375rem] font-semibold tracking-wide text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] transition duration-200 hover:border-[color-mix(in_srgb,var(--dq-primary)_28%,var(--dq-border))] hover:bg-[var(--dq-muted-bg)] lg:text-base"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={navLinkClass(pathname === "/login")}
                aria-current={pathname === "/login" ? "page" : undefined}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[var(--dq-primary)] px-5 py-2.5 text-[0.9375rem] font-semibold tracking-wide text-[color-mix(in_srgb,white_96%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_28%,transparent)] transition duration-200 hover:brightness-110 active:scale-[0.98] lg:px-6 lg:py-3 lg:text-base"
                aria-current={pathname === "/register" ? "page" : undefined}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      <div
        id={menuId}
        hidden={!menuOpen}
        className="relative z-50 border-t border-[color-mix(in_srgb,var(--dq-border)_80%,var(--dq-gold)_20%)] bg-[color-mix(in_srgb,var(--dq-surface)_94%,transparent)] px-[max(0.75rem,env(safe-area-inset-left))] py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pr-[max(0.75rem,env(safe-area-inset-right))] shadow-[var(--dq-shadow-md)] backdrop-blur-md lg:hidden"
      >
        {menuOpen ? (
          <nav className="flex flex-col gap-1" aria-label="Main mobile">
            <Link
              href="/contribute"
              className={
                user
                  ? contributeNavClass(pathname === "/contribute", true)
                  : navLinkClass(pathname === "/contribute", true)
              }
              aria-current={pathname === "/contribute" ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              Contribute
            </Link>
            {user ? (
              <>
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center justify-center gap-2.5 rounded-full border border-[color-mix(in_srgb,var(--dq-border)_82%,var(--dq-gold)_18%)] bg-[var(--dq-surface-muted)] px-4 py-2.5 text-center text-[0.9375rem] font-semibold tracking-wide text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] transition hover:border-[color-mix(in_srgb,var(--dq-primary)_25%,var(--dq-border))]"
                  title={user.email}
                  onClick={() => setMenuOpen(false)}
                >
                  {user.avatarSeed ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(user.avatarSeed)}&size=56&backgroundColor=transparent`}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full"
                    />
                  ) : null}
                  <span className="truncate">
                    {user.displayName?.trim() || user.name?.trim() || user.email.split("@")[0]}
                  </span>
                </Link>
                <Link
                  href="/settings"
                  className={navLinkClass(pathname === "/settings", true)}
                  aria-current={pathname === "/settings" ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="rounded-lg border-2 border-[color-mix(in_srgb,var(--dq-border)_88%,var(--dq-gold)_14%)] bg-[var(--dq-surface)] py-3.5 text-center text-[0.9375rem] font-semibold tracking-wide text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] transition hover:bg-[var(--dq-muted-bg)]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={navLinkClass(pathname === "/login", true)}
                  aria-current={pathname === "/login" ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="mt-1 flex w-full justify-center rounded-full bg-[var(--dq-primary)] px-5 py-3.5 text-[0.9375rem] font-semibold tracking-wide text-[color-mix(in_srgb,white_96%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_28%,transparent)] transition hover:brightness-110"
                  aria-current={pathname === "/register" ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
