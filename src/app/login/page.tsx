import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col justify-center px-4 py-16 sm:py-20">
      <Suspense
        fallback={
          <div className="mx-auto h-64 max-w-md animate-pulse rounded-2xl bg-[var(--dq-muted-bg)]" />
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
