"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const mobileLinks = [
  { href: "/", label: "HOME" },
  { href: "/shop", label: "SHOP" },
  { href: "/cart", label: "CART" },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <nav
        className="fixed inset-x-0 top-[72px] z-50 bg-surface-container border-b border-primary/20 flex flex-col gap-px"
        aria-label="Mobile navigation"
      >
        {mobileLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={[
                "px-6 py-5 font-headline font-bold uppercase tracking-widest text-sm transition-colors border-b border-on-surface/5 last:border-b-0",
                isActive
                  ? "text-primary border-l-2 border-l-primary pl-5"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface",
              ].join(" ")}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
