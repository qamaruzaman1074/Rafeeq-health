import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useNumerals } from "@/i18n/numerals";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const RING_RADIUS = 42;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type ProgressTone = "teal" | "gold" | "green";

const TONE_CLASSES: Record<ProgressTone, { accent: string; track: string; value: string }> = {
  teal: { accent: "bg-teal-700", track: "text-teal-700/20", value: "text-teal-700" },
  gold: { accent: "bg-gold-500", track: "text-gold-500/25", value: "text-gold-500" },
  green: { accent: "bg-green-600", track: "text-green-600/20", value: "text-green-600" },
};

function subscribeToMotionPreference(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const mediaQuery = window.matchMedia(MOTION_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getMotionPreference(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MOTION_QUERY).matches;
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeToMotionPreference, getMotionPreference, () => true);
}

function useAnimatedPercent(value: number): number {
  const target = Math.min(100, Math.max(0, Math.round(value)));
  const prefersReducedMotion = usePrefersReducedMotion();
  const [animatedValue, setAnimatedValue] = useState(() => (prefersReducedMotion ? target : 0));
  const currentValue = useRef(animatedValue);

  useEffect(() => {
    if (prefersReducedMotion) {
      currentValue.current = target;
      const frame = requestAnimationFrame(() => setAnimatedValue(target));
      return () => cancelAnimationFrame(frame);
    }

    const startValue = currentValue.current;
    if (startValue === target) {
      return;
    }

    let startTime: number | undefined;
    let frame = 0;
    const animate = (time: number) => {
      if (startTime === undefined) {
        startTime = time;
      }
      const progress = Math.min((time - startTime) / 760, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextValue = Math.round(startValue + (target - startValue) * easedProgress);
      currentValue.current = nextValue;
      setAnimatedValue(nextValue);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion, target]);

  return prefersReducedMotion ? target : animatedValue;
}

export function progressPercent(completed: number, total: number): number {
  if (!Number.isFinite(completed) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

export function CircularProgress({
  label,
  detail,
  value,
  tone,
}: {
  label: string;
  detail: string;
  value: number;
  tone: ProgressTone;
}) {
  const { formatNumber } = useNumerals();
  const animatedPercent = useAnimatedPercent(value);
  const tones = TONE_CLASSES[tone];
  const dashOffset = RING_CIRCUMFERENCE * (1 - animatedPercent / 100);
  const formattedPercent = formatNumber(animatedPercent);

  return (
    <article className="motion-card-lift flex h-full flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-card p-5 text-center shadow-xs hover:border-teal-700/40">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={animatedPercent}
        aria-valuetext={`${formattedPercent}%`}
        className="relative h-32 w-32 shrink-0"
      >
        <svg
          aria-hidden="true"
          className={`h-full w-full -rotate-90 ${tones.value}`}
          viewBox="0 0 100 100"
        >
          <circle
            className={tones.track}
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-teal-900"
        >
          {formattedPercent}%
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="flex items-center gap-2 text-base font-semibold text-teal-900">
          <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${tones.accent}`} />
          {label}
        </h3>
        <p className="text-sm text-ink-600">{detail}</p>
      </div>
    </article>
  );
}

export function HorizontalProgress({
  label,
  detail,
  value,
  colorClass,
  accentClass,
  trackClass,
}: {
  label: string;
  detail: string;
  value: number;
  colorClass: string;
  accentClass: string;
  trackClass: string;
}) {
  const { formatNumber } = useNumerals();
  const animatedPercent = useAnimatedPercent(value);
  const formattedPercent = formatNumber(animatedPercent);

  return (
    <article className="motion-card-lift flex flex-col gap-3 rounded-xl border border-border-subtle bg-card p-4 shadow-xs hover:border-teal-700/40">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 font-semibold text-teal-900">
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${accentClass}`} />
            {label}
          </h3>
          <p className="text-sm text-ink-600">{detail}</p>
        </div>
        <span className="shrink-0 font-semibold text-teal-900" aria-hidden="true">
          {formattedPercent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={animatedPercent}
        aria-valuetext={`${formattedPercent}%`}
        className={`h-2.5 overflow-hidden rounded-full ${trackClass}`}
      >
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${animatedPercent}%` }}
        />
      </div>
    </article>
  );
}
