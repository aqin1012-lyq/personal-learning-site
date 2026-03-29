export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/4 p-10 text-center">
      <h3 className="text-lg font-medium text-stone-100">{title}</h3>
      {description ? <p className="mt-2 text-sm text-stone-400">{description}</p> : null}
    </div>
  );
}
