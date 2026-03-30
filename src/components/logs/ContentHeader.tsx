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
    <section className="section-shell overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(214,186,152,0.22)] to-transparent" />
      <div className="pointer-events-none absolute right-8 top-6 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(193,160,124,0.14),transparent_68%)] blur-3xl" />

      <div className="relative max-w-4xl space-y-6">
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
          <h1 className="font-cjk text-[2.05rem] font-medium leading-[1.28] tracking-[-0.025em] text-stone-100 md:text-[2.8rem]">
            {title}
          </h1>
          <p className="max-w-3xl text-[0.98rem] leading-8 text-stone-400 md:text-[1.05rem]">{summary}</p>
        </div>

        {tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="pill-tag text-stone-400">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
