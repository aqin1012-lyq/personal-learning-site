import { formatDate, formatDuration } from '@/lib/utils';

export function ContentHeader({
  title,
  summary,
  date,
  durationMinutes,
  tags,
}: {
  title: string;
  summary: string;
  date?: string;
  durationMinutes?: number;
  tags?: string[];
}) {
  return (
    <section className="max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
        {date ? <span>{formatDate(date)}</span> : null}
        {durationMinutes ? (
          <>
            <span>·</span>
            <span>{formatDuration(durationMinutes)}</span>
          </>
        ) : null}
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-100 md:text-4xl">{title}</h1>
        <p className="text-base leading-8 text-stone-400 md:text-lg">{summary}</p>
      </div>
      {tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/[0.08] bg-white/5 px-3 py-1 text-sm text-stone-400">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
