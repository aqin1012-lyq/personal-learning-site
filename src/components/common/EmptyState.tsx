import Link from 'next/link';

export function EmptyState({
  title,
  description,
  label = 'No Matching Content',
  action,
}: {
  title: string;
  description?: string;
  label?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="section-shell reveal-surface border-dashed text-center">
      <div className="relative mx-auto max-w-xl space-y-3 py-4">
        <p className="section-label">{label}</p>
        <h3 className="font-cjk text-[1.35rem] font-medium text-stone-100">{title}</h3>
        {description ? <p className="text-sm leading-8 text-stone-400">{description}</p> : null}
        {action ? (
          <div className="pt-2">
            <Link href={action.href} className="hero-button-secondary inline-flex">
              {action.label}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
