import Link from 'next/link';
import { InteractiveSurface } from '@/components/common/InteractiveSurface';

type TimelineEntry = {
  id: string;
  title: string;
  summary: string;
  date: string;
  href: string;
  kind: 'log' | 'note' | 'project';
  meta?: string;
};

const kindMap: Record<TimelineEntry['kind'], string> = {
  log: '学习日志',
  note: '知识卡片',
  project: '项目实践',
};

function formatTimelineDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
  }).format(parsed);
}

function formatTimelineMonth(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
  }).format(parsed);
}

function formatTimelineMonthGroup(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return `${parsed.getFullYear()} / ${String(parsed.getMonth() + 1).padStart(2, '0')}`;
}

export function TimelinePreview({ items }: { items: TimelineEntry[] }) {
  const groups = items.reduce<Array<{ label: string; items: TimelineEntry[] }>>((acc, item) => {
    const label = formatTimelineMonthGroup(item.date);
    const existing = acc.find((group) => group.label === label);
    if (existing) {
      existing.items.push(item);
    } else {
      acc.push({ label, items: [item] });
    }
    return acc;
  }, []);

  return (
    <section className="section-shell stagger-surface overflow-hidden">
      <div className="relative space-y-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="section-label">Recent Timeline</p>
            <h2 className="font-cjk text-[1.55rem] font-medium leading-[1.4] tracking-tight text-stone-100 md:text-[1.9rem]">
              最近的学习轨迹
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-stone-400">
              改成横向展开后，可以看到更长一段时间里做了什么、整理了什么，以及不同类型内容是如何并行推进的。
            </p>
          </div>
          <Link href="/logs" className="refined-link">
            <span>查看更多记录</span>
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="relative overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-flex min-w-max gap-8 pr-4 pt-6">
            {groups.map((group) => (
              <div key={group.label} className="w-[min(86vw,980px)] min-w-[860px] space-y-5">
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-[0.24em] text-stone-500">{group.label}</span>
                  <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(186,149,110,0.4),rgba(186,149,110,0.06))]" />
                </div>

                <div className="relative pt-14">
                  <div className="pointer-events-none absolute left-0 right-0 top-[2.35rem] h-px bg-[linear-gradient(90deg,rgba(186,149,110,0.18),rgba(186,149,110,0.55),rgba(186,149,110,0.18))]" />
                  <div className="grid grid-flow-col auto-cols-[minmax(240px,1fr)] gap-4 xl:auto-cols-[minmax(260px,1fr)]">
                    {group.items.map((item, index) => (
                      <div key={item.id} className="relative">
                        <div className="relative mb-5 h-16">
                          <span className="absolute left-0 top-0 text-[11px] uppercase tracking-[0.2em] text-stone-500">
                            {formatTimelineMonth(item.date)}
                          </span>
                          <span className="absolute left-0 top-6 text-sm text-stone-300">{formatTimelineDate(item.date)}</span>
                          <span className="absolute left-0 top-[3.25rem] z-10 h-2.5 w-2.5 rounded-full border border-[rgba(214,186,152,0.42)] bg-[rgba(193,160,124,0.92)] shadow-[0_0_0_6px_rgba(186,149,110,0.08)]" />
                          {index < group.items.length - 1 ? (
                            <span className="pointer-events-none absolute left-[10px] top-[3.55rem] h-px w-[calc(100%+0.75rem)] bg-[linear-gradient(90deg,rgba(186,149,110,0.42),rgba(186,149,110,0.1))]" />
                          ) : null}
                        </div>

                        <InteractiveSurface className="surface-card surface-card-hover block min-h-[220px] rounded-[24px]">
                          <Link href={item.href} className="block h-full p-5 md:p-6">
                            <div className="relative flex h-full flex-col justify-between gap-5">
                              <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                                  <span className="pill-tag">{kindMap[item.kind]}</span>
                                  {item.meta ? <span>{item.meta}</span> : null}
                                </div>
                                <div className="space-y-2">
                                  <h3 className="font-cjk text-[1.08rem] font-medium text-stone-100 md:text-[1.14rem]">{item.title}</h3>
                                  <p className="text-sm leading-8 text-stone-400">{item.summary}</p>
                                </div>
                              </div>
                              <p className="text-sm text-stone-500">继续查看 →</p>
                            </div>
                          </Link>
                        </InteractiveSurface>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
