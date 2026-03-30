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

export function TimelinePreview({ items }: { items: TimelineEntry[] }) {
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
              用一条连续时间线回看最近这段时间做了什么、整理了什么，以及哪些内容开始逐渐连成结构。
            </p>
          </div>
          <Link href="/logs" className="refined-link">
            <span>查看更多记录</span>
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="relative pl-4 md:pl-6">
          <div className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px bg-[linear-gradient(180deg,rgba(186,149,110,0.5),rgba(186,149,110,0.08))] md:left-[11px]" />
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="relative grid gap-3 md:grid-cols-[84px_minmax(0,1fr)] md:gap-5">
                <div className="relative flex items-start md:justify-end">
                  <div className="relative z-10 inline-flex items-center gap-3 md:flex-col md:items-end md:gap-2">
                    <span className="absolute left-[-11px] top-2.5 h-2.5 w-2.5 rounded-full border border-[rgba(214,186,152,0.4)] bg-[rgba(193,160,124,0.9)] shadow-[0_0_0_6px_rgba(186,149,110,0.08)] md:left-auto md:right-[-17px]" />
                    <span className="pl-5 text-xs uppercase tracking-[0.18em] text-stone-500 md:pl-0">
                      {formatTimelineDate(item.date)}
                    </span>
                  </div>
                </div>

                <InteractiveSurface className="surface-card surface-card-hover block rounded-[24px]">
                  <Link href={item.href} className="block p-5 md:p-6">
                    <div className="relative space-y-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                        <span className="pill-tag">{kindMap[item.kind]}</span>
                        {item.meta ? <span>{item.meta}</span> : null}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-cjk text-[1.08rem] font-medium text-stone-100 md:text-[1.18rem]">{item.title}</h3>
                        <p className="text-sm leading-8 text-stone-400">{item.summary}</p>
                      </div>
                    </div>
                  </Link>
                </InteractiveSurface>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
