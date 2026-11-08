export function Skeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" data-state="loading" className="flex flex-col gap-3">
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="block h-6 w-2/3 rounded-md bg-teal-100 motion-safe:animate-pulse"
      />
      <span
        aria-hidden="true"
        className="block h-24 w-full rounded-md bg-teal-100 motion-safe:animate-pulse"
      />
      <span
        aria-hidden="true"
        className="block h-24 w-full rounded-md bg-teal-100 motion-safe:animate-pulse"
      />
    </div>
  );
}
