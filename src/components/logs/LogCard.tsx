import Link from 'next/link';
import type { LogItem } from '@/types/log';
import { formatDate, formatDuration } from '@/lib/utils';
import { InteractiveSurface } from '@/components/common/InteractiveSurface';

export function LogCard({ item }: { item: LogItem }) {
  return (
    <InteractiveSurface className="surface-card surface-card-hover reveal-surface block rounded-[24px]">
      <Link href={`/logs/${item.slug}`} className="block p-6 md:p-7">
        <div className="relative space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
            <span>{formatDate(item.date)}</span>
            <span>·</span>
            <span>{formatDuration(item.durationMinutes)}</span>
            <span>·</span>
            <span className="capitalize text-amber-200/80">{item.type}</span>
          </div>
          <div className="space-y-2">
            <h3 className="font-cjk text-[1.22rem] font-medium tracking-tight text-stone-100">{item.title}</h3>
            <p className="text-[0.98rem] leading-8 text-stone-400">{item.summary}</p>
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
