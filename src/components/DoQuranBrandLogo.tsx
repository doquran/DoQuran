import Image from "next/image";

type Props = { className?: string };

/** Full-color lockup (book + اقرأ + DoQuran); parent link supplies `aria-label`. */
export function DoQuranBrandLogo({ className }: Props) {
  return (
    <Image
      src="/doquran-logo.png"
      alt=""
      width={1024}
      height={571}
      priority
      sizes="(max-width: 1023px) 52vw, 28rem"
      className={className}
    />
  );
}
