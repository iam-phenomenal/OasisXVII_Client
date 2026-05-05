"use client";

import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface px-6 text-center">
      <p className="font-headline text-[20vw] font-black leading-none tracking-tighter text-primary opacity-20 select-none">
        ERR
      </p>
      <h1 className="font-serif text-4xl font-black uppercase tracking-tight -mt-8 mb-6">
        Something broke.
      </h1>
      <p className="text-on-surface-variant font-body uppercase tracking-widest text-sm mb-12 max-w-2xl">
        {error.digest ?? "An unexpected error occurred."}
      </p>
      <Button variant="primary" onClick={reset}>
        Try Again
      </Button>
    </main>
  );
}
