import Image from "next/image";
import Link from "next/link";
import { SocialRow } from "./SocialRow";

const directoryLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop", label: "Archive" },
];

const legalLinks = [
  { href: "/terms", label: "Terms and Policies" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund", label: "Refund Policy" },
  { href: "/shipping", label: "Shipping Policy" },
];

const columnHeadingClasses =
  "font-headline font-black text-[11px] tracking-[0.4em] uppercase text-on-surface-primary";

const linkClasses =
  "text-on-surface-variant hover:text-on-surface transition-colors text-xs font-headline font-bold tracking-widest uppercase";

const fineprintClasses =
  "text-[9px] tracking-[0.5em] uppercase font-headline font-black text-on-surface-variant/40";

function LinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className={columnHeadingClasses}>{heading}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className={linkClasses}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-surface-container-lowest border-t border-primary/20 px-6 pt-16 pb-8 md:pt-20">
      {/* Wine glow bleeding in from the right, per the DESIGN.md depth rule:
          tinted light rather than grey shadow. Sits behind the content and
          takes no pointer events. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-20 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(138,26,73,0.18)_0%,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Image
              src="https://ik.imagekit.io/pxus1osjev/OasisXVII/IMG_6961.PNG"
              alt="OasisXVII"
              // The asset is a square 256x256 mark, not a wordmark — declaring
              // it square keeps Next from reserving a wrong-ratio box.
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />

            <p className="mt-7 max-w-xs font-body text-sm leading-relaxed text-on-surface-variant">
              Objects built for quiet extremes — engineered in small runs,
              priced for those who already know why.
            </p>

            <div className="mt-8">
              <SocialRow />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:col-start-9 lg:gap-6">
            <LinkColumn heading="Directory" links={directoryLinks} />
            <LinkColumn heading="Legal" links={legalLinks} />
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-center gap-4 border-t border-outline-variant/40 pt-8 text-center md:mt-20 md:flex-row md:justify-between md:gap-6 md:text-left">
          <p className={fineprintClasses}>© 2026 OasisXVII Corp</p>
          <p className={fineprintClasses}>
            Designed for the modern void · EST. XVII
          </p>
        </div>
      </div>
    </footer>
  );
}
