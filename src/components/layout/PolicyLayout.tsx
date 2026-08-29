import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PolicyTableOfContents } from "@/components/layout/PolicyTableOfContents";
import { ALL_POLICIES } from "@/data/policies";
import type { InlineNode, Policy, PolicyBlock } from "@/data/policies";

const linkClasses =
  "text-on-surface underline underline-offset-4 decoration-on-surface-primary hover:text-on-surface-primary transition-colors";

function InlineContent({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        if (typeof node === "string") return node;

        return node.href.startsWith("/") ? (
          <Link key={index} href={node.href} className={linkClasses}>
            {node.text}
          </Link>
        ) : (
          <a key={index} href={node.href} className={linkClasses}>
            {node.text}
          </a>
        );
      })}
    </>
  );
}

function Blocks({ blocks }: { blocks: PolicyBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) =>
        block.type === "paragraph" ? (
          <p
            key={index}
            className="text-on-surface-variant font-body text-sm leading-relaxed"
          >
            <InlineContent nodes={block.content} />
          </p>
        ) : (
          <ul key={index} className="space-y-2">
            {block.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-on-surface-variant font-body text-sm leading-relaxed"
              >
                <span aria-hidden className="text-on-surface-primary select-none">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}

export function PolicyLayout({ policy }: { policy: Policy }) {
  const relatedPolicies = ALL_POLICIES.filter(
    (item) => item.slug !== policy.slug,
  );

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-32 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <header className="border-b border-outline-variant pb-10">
            <p className="font-headline font-black text-[10px] tracking-[0.5em] uppercase text-on-surface-primary">
              OasisXVII CORP
            </p>
            <h1 className="mt-4 font-serif font-black text-4xl md:text-6xl uppercase tracking-tighter">
              {policy.title}
            </h1>
            <p className="mt-6 text-[10px] tracking-[0.4em] uppercase font-headline font-black text-on-surface-variant/60">
              Effective {policy.effectiveDate}
            </p>
          </header>

          <div className="mt-12 grid gap-12 lg:grid-cols-[200px_1fr] lg:gap-16">
            <aside className="hidden lg:block">
              <PolicyTableOfContents sections={policy.sections} />
            </aside>

            <article>
              <div className="mb-12">
                <Blocks blocks={policy.intro} />
              </div>

              <div className="space-y-12">
                {policy.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-32"
                  >
                    <h2 className="font-headline font-black text-sm tracking-[0.25em] uppercase text-on-surface-primary mb-4">
                      {section.heading}
                    </h2>
                    <Blocks blocks={section.blocks} />
                  </section>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-24 border-t border-outline-variant pt-10">
            <h2 className="font-headline font-black text-[10px] tracking-[0.4em] uppercase text-on-surface-primary">
              Related Policies
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {relatedPolicies.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={`/${related.slug}`}
                    className="text-on-surface-variant hover:text-on-surface transition-colors text-xs font-headline font-bold tracking-widest uppercase"
                  >
                    {related.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
