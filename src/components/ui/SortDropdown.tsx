"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Best Selling", value: "best-selling" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Date: Newest", value: "newest" },
] as const;

function SortSelect({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (nextSort: string) => void;
}) {
  return (
    <div className="relative w-full md:w-64">
      <label htmlFor="product-sort" className="sr-only">
        Sort Products
      </label>
      <select
        id="product-sort"
        value={selected}
        onChange={(event) => onSelect(event.target.value)}
        className="appearance-none bg-surface-container border-b-2 border-primary text-on-surface py-2 pr-12 pl-4 font-headline font-bold uppercase w-full"
        style={{ backgroundColor: "#18181F", color: "#E4E1E9", colorScheme: "dark" }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-primary pointer-events-none">
        expand_more
      </span>
    </div>
  );
}

// Prerendered in place of SortDropdown, which cannot be statically rendered
// because it reads the search params.
export function SortDropdownFallback() {
  return <SortSelect selected="featured" onSelect={() => {}} />;
}

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSort = searchParams.get("sort") ?? "featured";

  function handleSortChange(nextSort: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextSort === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }

    params.delete("page");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  return <SortSelect selected={selectedSort} onSelect={handleSortChange} />;
}
