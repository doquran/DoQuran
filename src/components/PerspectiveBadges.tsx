import Link from "next/link";
import type { BadgeChip } from "@/lib/badges";
import { perspectiveBadgeClasses } from "@/lib/badges";

type Props = {
  badges: BadgeChip[];
  size?: "sm" | "md";
  className?: string;
  /** When true, pills link to /?seal={slug}#recent to filter the feed. */
  linkable?: boolean;
};

export function PerspectiveBadges({
  badges,
  size = "sm",
  className = "",
  linkable = true,
}: Props) {
  if (badges.length === 0) return null;

  const pillSizeClass =
    size === "md"
      ? "px-3 py-1.5 text-xs tracking-[0.14em] sm:text-[0.8125rem]"
      : "";

  return (
    <ul
      className={`flex flex-wrap items-center gap-2 ${className}`}
      aria-label="Perspective seals"
    >
      {badges.map((b) => {
        const inner = (
          <span
            className={`${perspectiveBadgeClasses(b.variant)} ${pillSizeClass} ${
              linkable ? "transition hover:brightness-[1.08]" : ""
            }`}
          >
            <span className="font-display font-semibold normal-case tracking-normal">
              {b.label}
            </span>
          </span>
        );

        return (
          <li key={b.slug} title={b.tagline}>
            {linkable ? (
              <Link href={`/?seal=${b.slug}#recent`}>{inner}</Link>
            ) : (
              inner
            )}
          </li>
        );
      })}
    </ul>
  );
}
