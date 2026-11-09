import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Scroll-triggered stagger for direct child elements (cards, list items). */
export function RevealStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (node === null) {
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={cn("stagger-reveal", visible && "is-visible", className)}>
      {children}
    </div>
  );
}
