"use client";

import { useEffect, useState } from "react";
import type { PolicySection } from "@/data/policies";

interface PolicyTableOfContentsProps {
  sections: PolicySection[];
}

export function PolicyTableOfContents({
  sections,
}: PolicyTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Top offset clears the fixed navbar; bottom margin keeps a single
      // section active instead of the whole viewport lighting up.
      { rootMargin: "-128px 0px -60% 0px" },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className="sticky top-32">
      <h2 className="font-headline font-black text-[10px] tracking-[0.4em] uppercase text-on-surface-primary">
        On This Page
      </h2>
      <ul className="mt-4 space-y-2 border-l border-outline-variant">
        {sections.map((section) => {
          const isActive = section.id === activeId;

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`block -ml-px border-l pl-4 py-1 text-[11px] font-headline font-bold tracking-widest uppercase transition-colors ${
                  isActive
                    ? "border-primary text-on-surface"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {section.heading}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
