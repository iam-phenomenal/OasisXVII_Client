"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Best Selling", value: "best-selling" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Date: Newest", value: "newest" },
] as const;

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

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div className="relative w-full md:w-64">
      <label htmlFor="product-sort" className="sr-only">
        Sort Products
      </label>
      <select
        id="product-sort"
        value={selectedSort}
        onChange={(event) => handleSortChange(event.target.value)}
        className="appearance-none bg-surface-container border-b-2 border-primary text-on-surface py-2 pr-12 pl-4 font-headline font-bold uppercase w-full"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
        expand_more
      </span>
    </div>
  );
}
