export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div
      role="status"
      data-state="empty"
      className="flex flex-col gap-2 rounded-lg border border-teal-500 bg-sand-100 p-4"
    >
      <p className="text-lg font-medium text-teal-900">{title}</p>
      {body !== undefined ? <p className="text-ink-600">{body}</p> : null}
    </div>
  );
}
