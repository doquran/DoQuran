import { Suspense } from "react";
import { VerifyEmailClient } from "@/components/VerifyEmailClient";

export const metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <main className="flex flex-1 flex-col justify-center px-4 py-16 sm:py-20">
      <Suspense
        fallback={
          <div className="mx-auto h-48 max-w-md animate-pulse rounded-2xl bg-[var(--dq-muted-bg)]" />
        }
      >
        <VerifyEmailClient />
      </Suspense>
    </main>
  );
}
