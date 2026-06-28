import Image from "next/image";
import Link from "next/link";

const directoryLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/archive", label: "Archive" },
];

const legalLinks = [
  { href: "/terms", label: "Terms and Policies" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund", label: "Refund Policy" },
  { href: "/shipping", label: "Shipping Policy" },
];

export function Footer() {
  return (
    <footer className="bg-surface-container border-t border-primary/20 px-6 pt-12">
      <div className="flex flex-col md:flex-row justify-between gap-12 pb-9">
        <div className="max-w-xs">
          <Image
            src="https://ik.imagekit.io/pxus1osjev/OasisXVII/IMG_6961.PNG"
            alt="OasisXVII"
            width={135}
            height={36}
            className="h-9 w-auto object-contain"
          />

          <h2 className="mt-6 font-headline font-black uppercase text-xl text-primary italic">
            Stay Connected
          </h2>

          <p className="mt-3 text-on-surface-variant text-sm font-body leading-relaxed">
            Get updates on new drops, archive releases, and exclusive early
            access.
          </p>

          <form className="mt-6 flex border-b border-primary/50 group focus-within:border-primary transition-colors">
            <input
              type="email"
              required
              placeholder="Your Email"
              className="bg-transparent py-3 w-full focus:outline-none text-sm font-headline uppercase tracking-widest placeholder:text-on-surface-variant/30"
            />
            <button
              type="submit"
              aria-label="Submit email"
              className="px-3 text-primary"
            >
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">
                east
              </span>
            </button>
          </form>

          <p className="hidden md:block mt-4 text-[9px] tracking-[0.5em] uppercase font-headline font-black text-on-surface-variant/40">
            © 2026 OasisXVII CORP
          </p>
        </div>

        <div className="flex flex-col justify-between gap-6">
          <div className="grid grid-cols-2 gap-16">
            <div>
              <h3 className="font-headline font-black text-[11px] tracking-[0.4em] uppercase text-primary">
                Directory
              </h3>
              <ul className="mt-4 space-y-2">
                {directoryLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-on-surface-variant hover:text-on-surface transition-colors text-xs font-headline font-bold tracking-widest uppercase"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-headline font-black text-[11px] tracking-[0.4em] uppercase text-primary">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-on-surface-variant hover:text-on-surface transition-colors text-xs font-headline font-bold tracking-widest uppercase"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <span className="hidden md:block text-[9px] tracking-[0.5em] uppercase font-headline font-black text-on-surface-variant/40">
            Designed for the modern void - EST. XVII
          </span>

          <div className="md:hidden flex flex-col gap-1 items-center text-center">
            <span className="text-[7px] tracking-[0.5em] uppercase font-headline font-black text-on-surface-variant/40">
              Designed for the modern void - EST. XVII
            </span>
            <span className="text-[7px] tracking-[0.5em] uppercase font-headline font-black text-on-surface-variant/40">
              © 2026 OasisXVII CORP
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
