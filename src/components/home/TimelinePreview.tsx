import Link from 'next/link';

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
  isWeekStart: boolean;
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

const RAIL_DAYS = 21;

function buildDaySlots(items: TimelineEntry[]) {
  const sorted = [...items].sort((a, b) => (a.date < b.date ? -1 : 1));
  const latestDate = sorted.length > 0 ? new Date(sorted[sorted.length - 1].date) : new Date();
  const end = Number.isNaN(latestDate.getTime()) ? new Date() : latestDate;
  end.setHours(0, 0, 0, 0);

  return Array.from({ length: RAIL_DAYS }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (RAIL_DAYS - 1 - index));
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
      isWeekStart: index % 7 === 0,
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
  const latestActiveDay = [...daySlots].reverse().find((day) => day.items.length > 0);
  const weekLabels = ['三周前', '两周前', '本周'];

  return (
    <section className="overflow-hidden rounded-[24px] border border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,248,240,0.02),rgba(255,248,240,0.008))] px-3 py-5 md:px-4 md:py-6 2xl:px-5">
      <div className="flex flex-col gap-3 border-b border-white/[0.05] pb-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Recent 3 Weeks</p>
          <p className="text-sm leading-7 text-stone-400">
            {activeDays} 天有更新，只保留节点和短标题。
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs leading-6 text-stone-500">
          {latestActiveDay?.leadItem ? <span>最新 · {latestActiveDay.label}</span> : null}
          <Link href="/logs" className="refined-link">
            <span>查看记录</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto pt-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="min-w-[1080px] px-2 pb-2 pt-6 md:px-3">
          <div className="mb-6 grid grid-cols-3 gap-3 text-[11px] uppercase tracking-[0.16em] text-stone-500">
            {weekLabels.map((label, index) => (
              <div key={label} className={`px-1 ${index === weekLabels.length - 1 ? 'text-stone-300' : ''}`}>
                {label}
              </div>
            ))}
          </div>

          <div className="relative grid grid-cols-21 gap-2.5 md:gap-3">
            <div className="pointer-events-none absolute left-[calc(100%/42)] right-[calc(100%/42)] top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,rgba(255,248,240,0.06),rgba(255,248,240,0.22),rgba(255,248,240,0.06))]" />
            <div className="pointer-events-none absolute bottom-0 left-1/3 top-0 w-px -translate-x-1/2 bg-white/[0.04]" />
            <div className="pointer-events-none absolute bottom-0 left-2/3 top-0 w-px -translate-x-1/2 bg-white/[0.04]" />

            {daySlots.map((day, index) => {
              const isActive = day.items.length > 0;
              const alignTop = index % 2 === 0;
              const showLabel = isActive || day.isWeekStart || index === daySlots.length - 1;

              return (
                <div key={day.key} className="relative flex min-h-[10.5rem] flex-col items-center justify-center text-center">
                  <div className={`absolute ${alignTop ? 'bottom-[calc(50%+1.35rem)]' : 'top-[calc(50%+1.35rem)]'} left-1/2 flex w-[7.25rem] -translate-x-1/2 flex-col items-center gap-1.5`}>
                    {isActive && day.leadItem ? (
                      <Link href={day.leadItem.href} className="group inline-flex max-w-full flex-col items-center gap-1 rounded-[14px] px-2 py-1.5 transition hover:-translate-y-0.5">
                        <span className="text-[10px] uppercase tracking-[0.16em] text-stone-500">
                          {getKindLabel(day.leadItem.kind)}{day.items.length > 1 ? ` · +${day.items.length - 1}` : ''}
                        </span>
                        <span className="line-clamp-2 text-[12px] leading-5 text-stone-300 group-hover:text-stone-100">
                          {day.leadItem.title}
                        </span>
                      </Link>
                    ) : (
                      <div className="h-8" aria-hidden />
                    )}
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`flex flex-col items-center gap-1 text-[10px] tracking-[0.14em] ${showLabel ? 'text-stone-500' : 'text-transparent'}`}>
                      <span>{day.weekLabel}</span>
                      <span className={showLabel ? 'text-stone-600' : ''}>{day.shortLabel}</span>
                    </div>

                    <div className="relative flex h-5 w-5 items-center justify-center">
                      <span
                        className={`relative rounded-full border ${
                          isActive
                            ? 'h-3 w-3 border-amber-100/45 bg-amber-100/75 shadow-[0_0_0_5px_rgba(214,188,150,0.08)]'
                            : day.isWeekStart
                              ? 'h-2.5 w-2.5 border-white/[0.1] bg-white/[0.12]'
                              : 'h-2 w-2 border-white/[0.05] bg-white/[0.06]'
                        }`}
                      />
                    </div>

                    <p className={`text-[10px] tracking-[0.16em] ${showLabel ? 'text-stone-500' : 'text-transparent'}`}>{showLabel ? day.label : '00/00'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
