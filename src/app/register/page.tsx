import { Suspense } from "react";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <main className="flex flex-1 flex-col justify-center px-4 py-16 sm:py-20">
      <Suspense
        fallback={
          <div className="mx-auto h-64 max-w-md animate-pulse rounded-2xl bg-[var(--dq-muted-bg)]" />
        }
      >
        <RegisterForm />
      </Suspense>
    </main>
  );
}
