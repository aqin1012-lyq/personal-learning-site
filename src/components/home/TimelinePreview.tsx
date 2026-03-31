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
  tags?: string[];
};

type DaySlot = {
  key: string;
  date: Date;
  label: string;
  weekLabel: string;
  shortLabel: string;
  items: TimelineEntry[];
  leadItem: TimelineEntry | null;
};

function normalizeDateKey(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toISOString().slice(0, 10);
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }).format(date);
}

function formatShortLabel(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', { day: '2-digit' }).format(date);
}

function formatWeekLabel(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', { weekday: 'short' }).format(date);
}

function buildDaySlots(items: TimelineEntry[]) {
  const sorted = [...items].sort((a, b) => (a.date < b.date ? -1 : 1));
  const latestDate = sorted.length > 0 ? new Date(sorted[sorted.length - 1].date) : new Date();
  const end = Number.isNaN(latestDate.getTime()) ? new Date() : latestDate;
  end.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const dayItems = sorted.filter((item) => normalizeDateKey(item.date) === key);

    return {
      key,
      date,
      label: formatDayLabel(date),
      weekLabel: formatWeekLabel(date),
      shortLabel: formatShortLabel(date),
      items: dayItems,
      leadItem: dayItems[0] ?? null,
    } satisfies DaySlot;
  });
}

function getKindLabel(kind: TimelineEntry['kind']) {
  if (kind === 'log') return '日志';
  if (kind === 'note') return '笔记';
  return '项目';
}

export function TimelinePreview({ items }: { items: TimelineEntry[] }) {
  const daySlots = buildDaySlots(items);
  const activeDays = daySlots.filter((day) => day.items.length > 0).length;
  const totalEntries = daySlots.reduce((sum, day) => sum + day.items.length, 0);
  const latestActiveDay = [...daySlots].reverse().find((day) => day.items.length > 0);

  return (
    <section className="stagger-surface overflow-hidden rounded-[28px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,248,240,0.026),rgba(255,248,240,0.01))] p-4 md:rounded-[30px] md:p-5 2xl:p-6">
      <div className="space-y-5 2xl:space-y-6">
        <div className="flex flex-col gap-4 border-b border-white/[0.06] pb-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="section-label">Recent 7 Days</p>
            <h2 className="font-cjk text-[1.4rem] font-medium leading-[1.45] tracking-tight text-stone-100 md:text-[1.72rem] 2xl:text-[1.82rem]">
              最近 7 天更新轨道
            </h2>
            <p className="max-w-[42rem] text-sm leading-8 text-stone-400 2xl:text-[15px]">
              不再把每一天展开成板块，只保留一条横向基线，让更新发生的日期被轻轻标出，再用简短标题提示最近在学什么、做什么。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="pill-tag">{activeDays}/7 active days</span>
            <Link href="/logs" className="refined-link">
              <span>查看全部记录</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <InteractiveSurface className="surface-card rounded-[28px] p-5 md:p-6 2xl:p-7">
          <div className="relative space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Activity Rail</p>
                <p className="max-w-[34rem] text-sm leading-7 text-stone-400">
                  一周内共有 {totalEntries} 次更新，分布在 {activeDays} 天。主视觉只回答一件事：最近的学习/项目推进落在什么时候。
                </p>
              </div>
              {latestActiveDay?.leadItem ? (
                <p className="text-xs leading-6 text-stone-500">
                  最新更新 · {latestActiveDay.label} · {latestActiveDay.leadItem.title}
                </p>
              ) : null}
            </div>

            <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="min-w-[760px] px-2 py-10 md:px-4">
                <div className="relative grid grid-cols-7 gap-3 md:gap-4">
                  <div className="pointer-events-none absolute left-[calc(100%/14)] right-[calc(100%/14)] top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,rgba(255,248,240,0.08),rgba(255,248,240,0.26),rgba(255,248,240,0.08))]" />

                  {daySlots.map((day, index) => {
                    const isActive = day.items.length > 0;
                    const alignTop = index % 2 === 0;

                    return (
                      <div key={day.key} className="relative flex min-h-[15rem] flex-col items-center justify-center text-center">
                        <div className={`absolute ${alignTop ? 'bottom-[calc(50%+2rem)]' : 'top-[calc(50%+2rem)]'} left-1/2 flex w-[10rem] -translate-x-1/2 flex-col items-center gap-2`}>
                          {isActive && day.leadItem ? (
                            <Link
                              href={day.leadItem.href}
                              className="group inline-flex max-w-full flex-col items-center gap-1.5 rounded-[18px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-white/[0.12]"
                            >
                              <span className="text-[10px] uppercase tracking-[0.16em] text-stone-500">
                                {getKindLabel(day.leadItem.kind)}{day.items.length > 1 ? ` · +${day.items.length - 1}` : ''}
                              </span>
                              <span className="line-clamp-2 text-sm leading-6 text-stone-200 group-hover:text-white">
                                {day.leadItem.title}
                              </span>
                            </Link>
                          ) : (
                            <div className="h-[3.25rem]" aria-hidden />
                          )}
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-3">
                          <div className="flex flex-col items-center gap-1.5 text-[11px] tracking-[0.14em] text-stone-500">
                            <span>{day.weekLabel}</span>
                            <span className="text-stone-600">{day.shortLabel}</span>
                          </div>

                          <div className="relative flex h-5 w-5 items-center justify-center">
                            <span className="absolute h-2 w-px bg-white/[0.12]" />
                            <span
                              className={`relative rounded-full border ${
                                isActive
                                  ? 'h-3.5 w-3.5 border-amber-100/50 bg-amber-100/80 shadow-[0_0_0_6px_rgba(214,188,150,0.08)]'
                                  : 'h-2.5 w-2.5 border-white/[0.08] bg-white/[0.08]'
                              }`}
                            />
                          </div>

                          <p className="text-[11px] tracking-[0.16em] text-stone-500">{day.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-4 text-xs leading-6 text-stone-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-100/80 shadow-[0_0_0_5px_rgba(214,188,150,0.08)]" />
                有更新的日期
              </span>
              <span>标题只保留代表性学习 / 项目主题；同一天多条内容以 +n 收拢。</span>
            </div>
          </div>
        </InteractiveSurface>
      </div>
    </section>
  );
}
