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
  items: TimelineItem[];
};

type TimelineMonth = {
  month: number;
  key: string;
  label: string;
  shortLabel: string;
  itemCount: number;
  days: TimelineDay[];
};

type TimelineYear = {
  year: number;
  key: string;
  itemCount: number;
  months: TimelineMonth[];
};

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

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,248,240,0.02),rgba(255,248,240,0.005))] px-4 py-5 md:px-5 md:py-6 2xl:px-6 2xl:py-7">
      <div className="flex flex-col gap-4 border-b border-white/[0.05] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">Nested Timeline Explorer</p>
          <div className="space-y-1">
            <h3 className="font-cjk text-[1.08rem] font-medium text-stone-100 md:text-[1.18rem]">先在十年里定位，再沿年份、月份、日期慢慢下钻。</h3>
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
                      <h5 className="font-cjk text-[1rem] font-medium text-stone-100">从 {activeMonth.label} 的节点向右展开，把这一个月的每天排开。</h5>
                    </div>
                    <p className="text-sm text-stone-400">{activeMonth.itemCount > 0 ? `${activeDayCount} 天有更新` : '这个月还没有挂任何内容'}</p>
                  </div>

                  <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="relative min-w-max px-3 py-4">
                      <div className="pointer-events-none absolute left-3 right-3 top-[2.45rem] h-px bg-[linear-gradient(90deg,rgba(255,248,240,0.04),rgba(255,248,240,0.14),rgba(255,248,240,0.02))]" />
                      <div className="flex items-start gap-3">
                        {activeMonth.days.map((day) => {
                          const isActiveDay = day.items.length > 0;
                          return (
                            <div key={day.key} className="flex w-[104px] shrink-0 flex-col items-center text-center">
                              <div className="flex h-9 items-end">
                                {isActiveDay ? (
                                  <div className="space-y-1">
                                    {day.items.slice(0, 2).map((item) => (
                                      <Link
                                        key={item.id}
                                        href={item.href}
                                        className="block rounded-[14px] border border-white/[0.05] bg-white/[0.04] px-3 py-2 text-left transition hover:-translate-y-0.5 hover:border-white/[0.1]"
                                      >
                                        <p className="text-[9px] uppercase tracking-[0.16em] text-stone-500">{getKindLabel(item.kind)}</p>
                                        <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-stone-300">{item.title}</p>
                                      </Link>
                                    ))}
                                    {day.items.length > 2 ? <p className="text-[10px] text-stone-500">+{day.items.length - 2} 条</p> : null}
                                  </div>
                                ) : (
                                  <div className="h-8 text-[10px] leading-5 text-stone-600">空白</div>
                                )}
                              </div>

                              <div className="relative z-10 mt-3 flex flex-col items-center gap-2">
                                <span
                                  className={cn(
                                    'h-3.5 w-3.5 rounded-full border',
                                    isActiveDay ? 'border-amber-100/35 bg-amber-100/50' : 'border-white/[0.07] bg-white/[0.08]',
                                  )}
                                />
                                <div className="space-y-0.5">
                                  <p className={cn('text-[11px] tracking-[0.14em]', isActiveDay ? 'text-stone-300' : 'text-stone-600')}>
                                    {String(day.day).padStart(2, '0')}
                                  </p>
                                  <p className="text-[10px] uppercase tracking-[0.14em] text-stone-600">day</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-dashed border-white/[0.06] bg-black/10 px-4 py-3 text-sm leading-7 text-stone-400">
                    {activeMonth.itemCount > 0 ? (
                      <p>
                        这个月的内容来自日志、笔记与项目条目，日级只保留简短标题，让时间结构先于信息堆叠被看见。
                      </p>
                    ) : (
                      <p>这个月目前没有对应内容，横轴仍完整展开，方便以后继续把新记录挂回这段时间。</p>
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
