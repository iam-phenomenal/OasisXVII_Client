"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { useCart } from "@/context/CartContext";
import { MobileMenu } from "./MobileMenu";

interface NavbarProps {
  variant?: "default" | "checkout";
}

const defaultLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

export function Navbar({ variant = "default" }: NavbarProps) {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleCloseMenu = useCallback(() => setMenuOpen(false), []);

  if (variant === "checkout") {
    return (
      <header className="fixed top-0 w-full z-50 h-20 bg-surface/90 backdrop-blur-md border-b border-on-surface/5 flex items-center px-6 lg:px-12">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" aria-label="Go to home">
              <Image
                src="https://ik.imagekit.io/pxus1osjev/OasisXVII/IMG_6961.PNG"
                alt="OasisXVII"
                width={140}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>

            <div className="hidden md:flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase font-headline">
              <span className="text-primary italic">Information</span>
              <span className="text-on-surface/10 font-normal">&gt;</span>
              <span className="text-on-surface-variant">Shipping</span>
              <span className="text-on-surface/10 font-normal">&gt;</span>
              <span className="text-on-surface-variant">Payment</span>
            </div>
          </div>

          <Link
            href="/cart"
            className="group text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-all font-headline inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            Back to Cart
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-nav border-b border-primary/20 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Go to home">
            <Image
              src="https://ik.imagekit.io/pxus1osjev/OasisXVII/IMG_6961.PNG"
              alt="OasisXVII"
              width={160}
              height={40}
              className="h-8 md:h-10 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex gap-6">
            {defaultLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "font-headline font-bold tracking-tight uppercase text-sm transition-colors",
                    isActive
                      ? "text-on-surface border-b-2 border-primary pb-1"
                      : "text-on-surface-variant hover:text-on-surface",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            aria-label="Open cart"
            className="relative text-primary border-b-2 border-primary pb-1 inline-flex"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold px-1 min-w-[16px] h-4 flex items-center justify-center">
                {cartCount}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden text-on-surface"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="material-symbols-outlined">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={handleCloseMenu} />
    </header>
  );
}
