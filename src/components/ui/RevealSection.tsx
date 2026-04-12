"use client";

import type { ElementType, ReactNode, RefObject } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  stagger?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  as?: ElementType;
}

export function RevealSection({
  children,
  className = "",
  stagger,
  as: Tag = "div",
}: RevealSectionProps) {
  const { ref, inView } = useIntersectionObserver();
  const staggerClass = stagger ? `stagger-${stagger}` : "";

  return (
    <Tag
      ref={ref as RefObject<HTMLElement>}
      className={`animate-reveal ${inView ? "in-view" : ""} ${staggerClass} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
