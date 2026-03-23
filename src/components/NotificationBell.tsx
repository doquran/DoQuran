"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d: { notifications: Notification[]; unreadCount: number }) => {
        setNotifications(d.notifications);
        setUnread(d.unreadCount);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function markRead() {
    if (unread === 0) return;
    await fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
    setUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) void markRead();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[var(--dq-surface)] text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] transition hover:bg-[var(--dq-muted-bg)]"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[0.6rem] font-bold tabular-nums text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[var(--dq-surface)] shadow-[var(--dq-shadow-lg)] sm:w-96">
          <div className="border-b border-[var(--dq-border)] px-4 py-3">
            <p className="font-outfit text-sm font-bold tracking-wide text-[var(--dq-ink)]">
              Notifications
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-[var(--dq-muted)]">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <NotificationRow
                  key={n.id}
                  notification={n}
                  onClose={() => setOpen(false)}
                />
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NotificationRow({
  notification: n,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const timeAgo = getTimeAgo(n.createdAt);
  const content = (
    <div
      className={`flex gap-3 px-4 py-3 transition hover:bg-[var(--dq-muted-bg)] ${!n.read ? "bg-[color-mix(in_srgb,var(--dq-primary)_4%,var(--dq-surface))]" : ""}`}
    >
      <div className="mt-0.5 text-lg" aria-hidden>
        {n.type === "vote" ? "▲" : n.type === "level_up" ? "✨" : "📣"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--dq-ink)]">{n.title}</p>
        <p className="mt-0.5 truncate text-xs text-[var(--dq-muted)]">
          {n.body}
        </p>
        <p className="mt-1 text-[0.65rem] text-[var(--dq-muted)]">{timeAgo}</p>
      </div>
      {!n.read ? (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--dq-primary)]" />
      ) : null}
    </div>
  );

  if (n.href) {
    return (
      <Link href={n.href} onClick={onClose}>
        {content}
      </Link>
    );
  }
  return content;
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { dateStyle: "short" });
}
