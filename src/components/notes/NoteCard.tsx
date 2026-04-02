import Link from 'next/link';
import type { NoteItem } from '@/types/note';
import { cn } from '@/lib/utils';
import { InteractiveSurface } from '@/components/common/InteractiveSurface';

export function NoteCard({ item, compact = false, href }: { item: NoteItem; compact?: boolean; href?: string }) {
  return (
    <InteractiveSurface className="surface-card surface-card-hover note-card-accent reveal-surface block rounded-[24px]">
      <Link href={href || `/notes/${item.slug}`} className={cn('block', compact ? 'p-4' : 'p-6')}>
        <div className="relative space-y-3">
          <div className="flex items-center justify-between gap-3 text-sm text-stone-500">
            <span className="pill-tag border-[rgba(122,174,203,0.14)] bg-[rgba(122,174,203,0.08)] text-[rgba(201,223,235,0.92)]">{item.category}</span>
            <span>{item.updatedAt}</span>
          </div>
          <div className="space-y-2">
            <h3 className="font-cjk text-[1.08rem] font-medium text-stone-100">{item.title}</h3>
            <p className="text-sm leading-8 text-stone-400">{item.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
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
