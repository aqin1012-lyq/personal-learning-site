import Link from 'next/link';
import type { LogItem } from '@/types/log';
import { formatDate, formatDuration } from '@/lib/utils';

export function LogCard({ item }: { item: LogItem }) {
  return (
    <Link href={`/logs/${item.slug}`} className="surface-card surface-card-hover block p-6 md:p-7">
      <div className="relative space-y-5">
        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
          <span>{formatDate(item.date)}</span>
          <span>·</span>
          <span>{formatDuration(item.durationMinutes)}</span>
          <span>·</span>
          <span className="capitalize text-violet-300/80">{item.type}</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium tracking-tight text-stone-100">{item.title}</h3>
          <p className="text-base leading-7 text-stone-400">{item.summary}</p>
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
