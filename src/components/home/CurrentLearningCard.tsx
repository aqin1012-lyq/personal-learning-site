import Link from 'next/link';
import type { CurrentLearningItem } from '@/types/home';
import { InteractiveSurface } from '@/components/common/InteractiveSurface';

export function CurrentLearningCard({ item }: { item: CurrentLearningItem }) {
  return (
    <InteractiveSurface className="surface-card surface-card-hover reveal-surface block rounded-[24px] h-full">
      <Link href={item.href || '/'} className="block h-full p-6 2xl:p-6">
        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div className="space-y-2">
              {item.progressText ? <p className="section-label text-amber-200/75">{item.progressText}</p> : null}
              <h3 className="font-cjk text-[1.05rem] font-medium text-stone-100">{item.title}</h3>
            </div>
            <span className="pill-tag shrink-0">{item.status}</span>
          </div>
          <p className="text-sm leading-8 text-stone-400">{item.summary}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {item.tags.map((tag) => (
              <span key={tag} className="pill-tag text-stone-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </InteractiveSurface>
  );
}
