import Link from 'next/link';
import type { NoteItem } from '@/types/note';
import { cn } from '@/lib/utils';

export function NoteCard({ item, compact = false }: { item: NoteItem; compact?: boolean }) {
  return (
    <Link
      href={`/notes/${item.slug}`}
      className={cn('surface-card surface-card-hover reveal-surface block', compact ? 'p-4' : 'p-6')}
    >
      <div className="relative space-y-3">
        <div className="flex items-center justify-between gap-3 text-sm text-stone-500">
          <span className="pill-tag text-stone-300">{item.category}</span>
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
  );
}
