'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type TimelineSourceKind = 'log' | 'note' | 'project';

type TimelineItem = {
  id: string;
  title: string;
  summary: string;
  date: string;
  href: string;
  kind: TimelineSourceKind;
  meta?: string;
  tags?: string[];
};

type TimelineDay = {
  day: number;
  key: string;
  weekday: number;
  items: TimelineItem[];
};

type TimelineMonth = {
  month: number;
  key: string;
  label: string;
  shortLabel: string;
  itemCount: number;
  firstWeekday: number;
  days: TimelineDay[];
};

type TimelineYear = {
  year: number;
  key: string;
  itemCount: number;
  months: TimelineMonth[];
};

type CalendarCell =
  | { key: string; type: 'empty' }
  | { key: string; type: 'day'; day: TimelineDay };

const WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

function getKindLabel(kind: TimelineSourceKind) {
  if (kind === 'log') return '日志';
  if (kind === 'note') return '笔记';
  return '项目';
}

function hasItems(month: TimelineMonth) {
  return month.itemCount > 0;
}

function monthSummary(month: TimelineMonth) {
  const activeDays = month.days.filter((day) => day.items.length > 0).length;
  if (month.itemCount === 0) return '本月还没有挂内容';
  return `${activeDays} 天留下记录 · 共 ${month.itemCount} 条更新`;
}

function buildCalendarCells(month: TimelineMonth): CalendarCell[] {
  const leadingEmpty = Array.from({ length: month.firstWeekday }, (_, index) => ({
    key: `${month.key}-empty-start-${index}`,
    type: 'empty' as const,
  }));
  const dayCells = month.days.map((day) => ({
    key: day.key,
    type: 'day' as const,
    day,
  }));
  const total = leadingEmpty.length + dayCells.length;
  const trailingCount = total % 7 === 0 ? 0 : 7 - (total % 7);
  const trailingEmpty = Array.from({ length: trailingCount }, (_, index) => ({
    key: `${month.key}-empty-end-${index}`,
    type: 'empty' as const,
  }));

  return [...leadingEmpty, ...dayCells, ...trailingEmpty];
}

export function TimelinePreview({ years }: { years: TimelineYear[] }) {
  const [selectedYear, setSelectedYear] = useState<string>(() => years.find((year) => year.itemCount > 0)?.key ?? years[years.length - 1]?.key ?? '');

  const activeYear = useMemo(
    () => years.find((year) => year.key === selectedYear) ?? years[years.length - 1],
    [years, selectedYear],
  );

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const year = years.find((entry) => entry.key === selectedYear) ?? years[years.length - 1];
    return year?.months.find((month) => month.itemCount > 0)?.key ?? year?.months[new Date().getMonth()]?.key ?? year?.months[0]?.key ?? '';
  });

  const resolvedMonthKey = activeYear?.months.some((month) => month.key === selectedMonth)
    ? selectedMonth
    : activeYear?.months.find((month) => month.itemCount > 0)?.key ?? activeYear?.months[new Date().getMonth()]?.key ?? activeYear?.months[0]?.key ?? '';

  const activeMonth = activeYear?.months.find((month) => month.key === resolvedMonthKey) ?? activeYear?.months[0];
  const activeDayCount = activeMonth ? activeMonth.days.filter((day) => day.items.length > 0).length : 0;
  const latestYearWithContent = [...years].reverse().find((year) => year.itemCount > 0);
  const calendarCells = activeMonth ? buildCalendarCells(activeMonth) : [];

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,248,240,0.02),rgba(255,248,240,0.005))] px-4 py-5 md:px-5 md:py-6 2xl:px-6 2xl:py-7">
      <div className="flex flex-col gap-4 border-b border-white/[0.05] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">Nested Timeline Explorer</p>
          <div className="space-y-1">
            <h3 className="font-cjk text-[1.08rem] font-medium text-stone-100 md:text-[1.18rem]">先在十年里定位，再沿年份、月份，最后落到一个月的月历细部。</h3>
            <p className="max-w-[44rem] text-sm leading-7 text-stone-400">
              上层看跨度，下层看密度。没有内容的时间节点也保留在那里，提醒这个系统仍有空白、也仍可继续生长。
            </p>
          </div>
        </div>

        <div className="grid gap-2 text-[12px] leading-6 text-stone-500 sm:grid-cols-2 lg:text-right">
          <div>
            <p className="uppercase tracking-[0.16em] text-stone-600">Years</p>
            <p>{years.length} 年总览</p>
          </div>
          <div>
            <p className="uppercase tracking-[0.16em] text-stone-600">Latest signal</p>
            <p>{latestYearWithContent ? `${latestYearWithContent.year} 仍有内容挂载` : '还没有可展示的数据'}</p>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative min-w-[880px] px-2 pb-1 pt-7 md:min-w-[980px]">
            <div className="pointer-events-none absolute left-4 right-4 top-[2.15rem] h-px bg-[linear-gradient(90deg,rgba(255,248,240,0.035),rgba(255,248,240,0.16),rgba(255,248,240,0.035))]" />
            <div className="grid grid-cols-10 gap-3 md:gap-4">
              {years.map((year) => {
                const isActive = activeYear?.key === year.key;
                const hasContent = year.itemCount > 0;

                return (
                  <button
                    key={year.key}
                    type="button"
                    onClick={() => {
                      setSelectedYear(year.key);
                      setSelectedMonth(year.months.find((month) => month.itemCount > 0)?.key ?? year.months[new Date().getMonth()]?.key ?? year.months[0]?.key ?? '');
                    }}
                    className={cn(
                      'group relative flex min-h-[8rem] flex-col items-center rounded-[24px] px-2 pb-4 pt-1 text-center transition duration-200',
                      isActive ? 'bg-white/[0.045]' : 'hover:bg-white/[0.02]',
                    )}
                  >
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <span
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded-full border transition',
                          isActive
                            ? 'border-amber-100/55 bg-amber-50/80 shadow-[0_0_0_6px_rgba(255,248,220,0.04)]'
                            : hasContent
                              ? 'border-amber-100/25 bg-amber-100/35'
                              : 'border-white/[0.08] bg-white/[0.08]',
                        )}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', isActive ? 'bg-stone-950/70' : hasContent ? 'bg-amber-50/80' : 'bg-white/[0.3]')} />
                      </span>
                      <div className="space-y-1">
                        <p className={cn('font-cjk text-[1rem] tracking-[0.03em]', isActive ? 'text-stone-100' : 'text-stone-300')}>
                          {year.year}
                        </p>
                        <p className={cn('text-[11px] uppercase tracking-[0.18em]', hasContent ? 'text-stone-500' : 'text-stone-600')}>
                          {hasContent ? `${year.itemCount} entries` : 'empty'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeYear ? (
          <div className="mt-6 rounded-[26px] border border-white/[0.05] bg-black/10 p-4 md:p-5">
            <div className="flex flex-col gap-3 border-b border-white/[0.05] pb-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Year {activeYear.year}</p>
                <h4 className="font-cjk text-[1.02rem] font-medium text-stone-100">从这一年往下看 12 个月，哪里真正留下了学习痕迹。</h4>
              </div>
              <p className="text-sm leading-7 text-stone-400">{activeYear.itemCount > 0 ? `这一年共有 ${activeYear.itemCount} 条真实更新。` : '这一年暂时还是空白，但仍保留在时间线上。'}</p>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
              <div className="relative pl-6">
                <div className="pointer-events-none absolute bottom-3 left-[0.95rem] top-2 w-px bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.14),rgba(255,255,255,0.03))]" />
                <div className="grid gap-3">
                  {activeYear.months.map((month) => {
                    const isActive = activeMonth?.key === month.key;
                    const withContent = hasItems(month);
                    return (
                      <button
                        key={month.key}
                        type="button"
                        onClick={() => setSelectedMonth(month.key)}
                        className={cn(
                          'group relative flex items-start gap-3 rounded-[18px] border px-4 py-3 text-left transition',
                          isActive
                            ? 'border-white/[0.1] bg-white/[0.045]'
                            : 'border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.03]',
                        )}
                      >
                        <span
                          className={cn(
                            'absolute left-[-1.03rem] top-5 h-3.5 w-3.5 rounded-full border',
                            isActive
                              ? 'border-amber-100/45 bg-amber-50/70 shadow-[0_0_0_6px_rgba(255,248,220,0.03)]'
                              : withContent
                                ? 'border-amber-100/20 bg-amber-100/35'
                                : 'border-white/[0.08] bg-[#141311]',
                          )}
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className={cn('font-cjk text-[0.98rem]', isActive ? 'text-stone-100' : 'text-stone-300')}>{month.label}</p>
                            <span className="text-[11px] uppercase tracking-[0.16em] text-stone-500">{month.itemCount || '—'}</span>
                          </div>
                          <p className="text-xs leading-6 text-stone-500">{monthSummary(month)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeMonth ? (
                <div className="space-y-4 rounded-[22px] border border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4 md:p-5">
                  <div className="flex flex-col gap-2 border-b border-white/[0.05] pb-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Month · {activeMonth.shortLabel}</p>
                      <h5 className="font-cjk text-[1rem] font-medium text-stone-100">点开月份后，不再横向排日，而是直接看这个月的整张月历。</h5>
                    </div>
                    <p className="text-sm text-stone-400">{activeMonth.itemCount > 0 ? `${activeDayCount} 天有更新` : '这个月还没有挂任何内容'}</p>
                  </div>

                  <div className="grid grid-cols-7 gap-2 border-b border-white/[0.05] pb-3 text-center">
                    {WEEKDAY_LABELS.map((label) => (
                      <div key={label} className="text-[10px] uppercase tracking-[0.22em] text-stone-500">
                        {label}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
                    {calendarCells.map((cell) => {
                      if (cell.type === 'empty') {
                        return <div key={cell.key} className="min-h-[7.5rem] rounded-[18px] border border-transparent bg-transparent" />;
                      }

                      const { day } = cell;
                      const hasContent = day.items.length > 0;
                      const preview = day.items[0];
                      const extraCount = day.items.length - 1;

                      return (
                        <div
                          key={day.key}
                          className={cn(
                            'group min-h-[7.5rem] rounded-[18px] border px-2.5 py-2.5 transition sm:min-h-[8.5rem] sm:px-3 sm:py-3',
                            hasContent
                              ? 'border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.028))]'
                              : 'border-white/[0.04] bg-white/[0.015]',
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <p className={cn('text-[12px] tracking-[0.08em]', hasContent ? 'text-stone-100' : 'text-stone-500')}>
                                {String(day.day).padStart(2, '0')}
                              </p>
                              <p className="text-[10px] uppercase tracking-[0.18em] text-stone-600">{WEEKDAY_LABELS[day.weekday]}</p>
                            </div>
                            <span
                              className={cn(
                                'mt-0.5 h-2 w-2 rounded-full',
                                hasContent ? 'bg-amber-200/70 shadow-[0_0_0_4px_rgba(251,191,36,0.08)]' : 'bg-white/[0.08]',
                              )}
                            />
                          </div>

                          <div className="mt-4 space-y-2">
                            {hasContent ? (
                              <>
                                <p className="text-[10px] uppercase tracking-[0.16em] text-stone-500">{getKindLabel(preview.kind)}</p>
                                <Link href={preview.href} className="block text-[12px] leading-5 text-stone-300 transition hover:text-stone-100">
                                  <span className="line-clamp-2">{preview.title}</span>
                                </Link>
                                <div className="flex items-center gap-1.5 pt-1">
                                  {day.items.slice(0, 3).map((item) => (
                                    <span key={item.id} className="h-1.5 w-1.5 rounded-full bg-amber-100/75" />
                                  ))}
                                  {extraCount > 0 ? <span className="text-[10px] text-stone-500">+{extraCount}</span> : null}
                                </div>
                              </>
                            ) : (
                              <div className="pt-6 text-[11px] leading-5 text-stone-600">留白</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-[18px] border border-dashed border-white/[0.06] bg-black/10 px-4 py-3 text-sm leading-7 text-stone-400">
                    {activeMonth.itemCount > 0 ? (
                      <p>第三层现在改成完整月历：所有日期都在网格里出现，有内容的日期只做轻量强调，用短标题、数量和点状标记提示密度。</p>
                    ) : (
                      <p>这个月目前没有对应内容，但整张月历仍完整保留，后续新增记录时可以自然挂回具体日期。</p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export type { TimelineItem, TimelineDay, TimelineMonth, TimelineYear };
