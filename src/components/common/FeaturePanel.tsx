import Link from 'next/link';

export function FeaturePanel({
  eyebrow,
  title,
  description,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="surface-card surface-card-hover block p-6 md:p-7">
      <div className="relative flex h-full flex-col justify-between gap-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{eyebrow}</p>
          <h3 className="text-xl font-medium text-stone-100">{title}</h3>
          <p className="text-sm leading-7 text-stone-400">{description}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-stone-300">继续阅读</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-stone-400">About</span>
        </div>
      </div>
    </Link>
  );
}
