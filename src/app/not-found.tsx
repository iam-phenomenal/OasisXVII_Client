import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface px-6 text-center pt-24">
        <p className="font-headline text-[20vw] font-black leading-none tracking-tighter text-primary opacity-20 select-none pointer-events-none">
          404
        </p>
        <h1 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tight -mt-8 mb-6">
          Lost in the void.
        </h1>
        <p className="text-on-surface-variant font-body uppercase tracking-widest text-sm mb-12">
          This page doesn&apos;t exist.
        </p>
        <Link href="/">
          <Button variant="primary">Return to the Oasis</Button>
        </Link>
      </main>
    </>
  );
}
