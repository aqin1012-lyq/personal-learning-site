export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="section-shell reveal-surface border-dashed text-center">
      <div className="relative mx-auto max-w-xl space-y-3 py-4">
        <p className="section-label">No Matching Content</p>
        <h3 className="font-cjk text-[1.35rem] font-medium text-stone-100">{title}</h3>
        {description ? <p className="text-sm leading-8 text-stone-400">{description}</p> : null}
      </div>
    </div>
  );
}
