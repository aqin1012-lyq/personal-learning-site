import Link from 'next/link';
import type { CurrentLearningItem } from '@/types/home';

export function CurrentLearningCard({ item }: { item: CurrentLearningItem }) {
  return (
    <Link href={item.href || '/'} className="surface-card surface-card-hover block p-6">
      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            {item.progressText ? <p className="text-xs uppercase tracking-[0.18em] text-violet-300/80">{item.progressText}</p> : null}
            <h3 className="text-lg font-medium text-stone-100">{item.title}</h3>
          </div>
          <span className="pill-tag shrink-0">{item.status}</span>
        </div>
        <p className="text-sm leading-7 text-stone-400">{item.summary}</p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="pill-tag text-stone-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
