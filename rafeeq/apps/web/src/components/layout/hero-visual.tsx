import { cn } from "@/lib/utils";

export type HeroVisualProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

/** Transparent hero artwork — no photo frame; page background shows through. */
export function HeroVisual({
  src,
  alt,
  width,
  height,
  className,
  priority = true,
}: HeroVisualProps) {
  return (
    <figure
      className={cn(
        "hero-visual motion-safe:hero-visual-float relative ms-auto me-auto flex w-full max-w-xl items-center justify-center lg:max-w-none",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        // React 18 only forwards the lowercase attribute name.
        {...{ fetchpriority: priority ? "high" : "auto" }}
        className="h-auto w-full max-h-[min(36rem,72vh)] object-contain object-center"
      />
    </figure>
  );
}
