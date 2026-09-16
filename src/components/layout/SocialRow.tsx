import { SOCIAL_LINKS, type SocialLink } from "@/lib/social";

function SocialIcon({ link }: { link: SocialLink }) {
  const paint =
    link.variant === "fill"
      ? { fill: "currentColor" }
      : {
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.5,
          strokeLinecap: "round" as const,
          strokeLinejoin: "round" as const,
        };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[15px] w-[15px]">
      {link.paths.map((d) => (
        <path key={d} d={d} {...paint} />
      ))}
    </svg>
  );
}

export function SocialRow() {
  return (
    <ul className="flex items-center gap-3">
      {SOCIAL_LINKS.map((link) => {
        const isExternal = link.href.startsWith("http");

        return (
          <li key={link.label}>
            <a
              href={link.href}
              // mailto: has no target to open and no origin to leak.
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              aria-label={link.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/60 text-on-surface-variant transition-colors duration-300 hover:border-on-surface-primary/60 hover:text-on-surface-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest"
            >
              <SocialIcon link={link} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
