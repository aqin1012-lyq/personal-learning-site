'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
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

function getKindTone(kind: TimelineSourceKind) {
  if (kind === 'log') return 'text-violet-200/85';
  if (kind === 'note') return 'text-cyan-200/80';
  return 'text-amber-200/80';
}

function getKindDot(kind: TimelineSourceKind) {
  if (kind === 'log') return 'bg-violet-300/80';
  if (kind === 'note') return 'bg-cyan-300/75';
  return 'bg-amber-300/75';
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

function getPreferredMonthKey(year?: TimelineYear) {
  if (!year) return '';
  return year.months.find((month) => month.itemCount > 0)?.key ?? year.months[new Date().getMonth()]?.key ?? year.months[0]?.key ?? '';
}

function getPreferredDayKey(month?: TimelineMonth) {
  if (!month) return '';
  const latestDayWithContent = [...month.days].reverse().find((day) => day.items.length > 0);
  return latestDayWithContent?.key ?? month.days[new Date().getDate() - 1]?.key ?? month.days[0]?.key ?? '';
}

export function TimelinePreview({ years }: { years: TimelineYear[] }) {
  const [selectedYear, setSelectedYear] = useState<string>(() => years.find((year) => year.itemCount > 0)?.key ?? years[years.length - 1]?.key ?? '');

  const activeYear = useMemo(
    () => years.find((year) => year.key === selectedYear) ?? years[years.length - 1],
    [years, selectedYear],
  );

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const year = years.find((entry) => entry.key === selectedYear) ?? years[years.length - 1];
    return getPreferredMonthKey(year);
  });

  const resolvedMonthKey = activeYear?.months.some((month) => month.key === selectedMonth) ? selectedMonth : getPreferredMonthKey(activeYear);
  const activeMonth = activeYear?.months.find((month) => month.key === resolvedMonthKey) ?? activeYear?.months[0];

  const [selectedDay, setSelectedDay] = useState<string>(() => getPreferredDayKey(activeMonth));

  useEffect(() => {
    if (!activeMonth) return;
    if (!activeMonth.days.some((day) => day.key === selectedDay)) {
      setSelectedDay(getPreferredDayKey(activeMonth));
    }
  }, [activeMonth, selectedDay]);

  const activeDay = activeMonth?.days.find((day) => day.key === selectedDay) ?? activeMonth?.days.find((day) => day.key === getPreferredDayKey(activeMonth)) ?? activeMonth?.days[0];
  const activeDayCount = activeMonth ? activeMonth.days.filter((day) => day.items.length > 0).length : 0;
  const latestYearWithContent = [...years].reverse().find((year) => year.itemCount > 0);
  const calendarCells = activeMonth ? buildCalendarCells(activeMonth) : [];
  const activeTrail = activeMonth && activeDay ? `${activeYear?.year} / ${activeMonth.shortLabel} / ${String(activeDay.day).padStart(2, '0')}日` : activeMonth ? `${activeYear?.year} / ${activeMonth.shortLabel}` : activeYear ? `${activeYear.year}` : 'Timeline';

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.024),rgba(255,255,255,0.01))] px-4 py-5 md:px-5 md:py-6 2xl:px-6 2xl:py-7">
      <div className="flex flex-col gap-4 border-b border-white/[0.05] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-stone-500">
            <span>Nested Timeline Explorer</span>
            <span className="h-1 w-1 rounded-full bg-violet-300/55" />
            <span>{activeTrail}</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-cjk text-[1.08rem] font-medium text-stone-100 md:text-[1.18rem]">先在十年里定位，再沿年份、月份，最后落到一个月的月历细部。</h3>
            <p className="max-w-[44rem] text-sm leading-7 text-stone-400">
              现在会把当前浏览路径持续挂在界面里：年份是入口，月份是下钻层，月历则是当前观察面。展开不再像三个分离模块，而像同一条时间脉络被逐层打开。
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
            <div className="pointer-events-none absolute left-4 right-4 top-[2.15rem] h-px bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(136,117,216,0.2),rgba(255,255,255,0.04))]" />
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
                      const nextMonthKey = getPreferredMonthKey(year);
                      setSelectedMonth(nextMonthKey);
                      setSelectedDay(getPreferredDayKey(year.months.find((month) => month.key === nextMonthKey) ?? year.months[0]));
                    }}
                    className={cn(
                      'group relative flex min-h-[8.4rem] flex-col items-center rounded-[24px] border px-2 pb-4 pt-1 text-center transition duration-200',
                      isActive
                        ? 'border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(136,117,216,0.08))] shadow-[0_16px_36px_rgba(0,0,0,0.16)]'
                        : 'border-transparent hover:border-white/[0.05] hover:bg-white/[0.02]',
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none absolute inset-x-[32%] top-[1.1rem] h-[1px] transition',
                        isActive ? 'bg-[linear-gradient(90deg,transparent,rgba(157,139,242,0.88),transparent)]' : 'bg-transparent',
                      )}
                    />
                    <span
                      className={cn(
                        'pointer-events-none absolute left-1/2 top-[calc(100%-1px)] h-6 w-px -translate-x-1/2 transition',
                        isActive ? 'bg-[linear-gradient(180deg,rgba(157,139,242,0.55),rgba(157,139,242,0))]' : 'bg-transparent',
                      )}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <span
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded-full border transition',
                          isActive
                            ? 'border-violet-200/55 bg-violet-300/80 shadow-[0_0_0_6px_rgba(136,117,216,0.08)]'
                            : hasContent
                              ? 'border-violet-200/30 bg-violet-300/35'
                              : 'border-white/[0.08] bg-white/[0.06]',
                        )}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', isActive ? 'bg-[#13161b]' : hasContent ? 'bg-violet-50/85' : 'bg-white/[0.3]')} />
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
          <div className="mt-6 rounded-[26px] border border-white/[0.05] bg-black/14 p-4 md:p-5">
            <div className="rounded-[20px] border border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.026),rgba(255,255,255,0.012))] px-4 py-3.5 md:px-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Current Context</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-stone-300">
                    <span className="rounded-full border border-violet-300/24 bg-violet-300/10 px-3 py-1 text-stone-200">{activeYear.year} 年</span>
                    <span className="text-stone-600">→</span>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-stone-300">{activeMonth?.label ?? '未选月份'}</span>
                    {activeDay ? (
                      <>
                        <span className="text-stone-600">→</span>
                        <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-stone-400">{String(activeDay.day).padStart(2, '0')} 日</span>
                      </>
                    ) : null}
                  </div>
                </div>
                <p className="max-w-[30rem] text-sm leading-7 text-stone-400">
                  {activeMonth?.itemCount
                    ? `当前正在查看 ${activeMonth.label}，这一层共有 ${activeMonth.itemCount} 条内容，分布在 ${activeDayCount} 个日期上。`
                    : `当前停在 ${activeMonth?.label ?? '这个月份'}，月历仍完整保留，空白也被视为时间结构的一部分。`}
                </p>
              </div>
            </div>

            <div className="relative mt-5 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-6">
              <div className="relative pl-6">
                <div className="pointer-events-none absolute bottom-3 left-[0.95rem] top-2 w-px bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(157,139,242,0.4),rgba(255,255,255,0.02))]" />
                <div className="mb-3 rounded-[18px] border border-white/[0.05] bg-white/[0.02] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Year Stage</p>
                  <p className="mt-1 font-cjk text-[1rem] text-stone-100">{activeYear.year} 年展开为 12 个时间切片</p>
                </div>
                <div className="grid gap-3">
                  {activeYear.months.map((month) => {
                    const isActive = activeMonth?.key === month.key;
                    const withContent = hasItems(month);
                    return (
                      <button
                        key={month.key}
                        type="button"
                        onClick={() => {
                          setSelectedMonth(month.key);
                          setSelectedDay(getPreferredDayKey(month));
                        }}
                        className={cn(
                          'group relative flex items-start gap-3 rounded-[18px] border px-4 py-3 text-left transition',
                          isActive
                            ? 'border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(136,117,216,0.06))] shadow-[0_14px_34px_rgba(0,0,0,0.14)]'
                            : 'border-white/[0.04] bg-white/[0.018] hover:border-white/[0.07] hover:bg-white/[0.028]',
                        )}
                      >
                        <span
                          className={cn(
                            'absolute left-[-1.03rem] top-5 h-3.5 w-3.5 rounded-full border transition',
                            isActive
                              ? 'border-violet-200/48 bg-violet-300/75 shadow-[0_0_0_6px_rgba(136,117,216,0.07)]'
                              : withContent
                                ? 'border-violet-200/20 bg-violet-300/32'
                                : 'border-white/[0.08] bg-[#14181d]',
                          )}
                        />
                        <span
                          className={cn(
                            'pointer-events-none absolute inset-y-3 right-0 w-[2px] rounded-full transition',
                            isActive ? 'bg-[linear-gradient(180deg,rgba(157,139,242,0),rgba(157,139,242,0.88),rgba(157,139,242,0))]' : 'bg-transparent',
                          )}
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className={cn('font-cjk text-[0.98rem]', isActive ? 'text-stone-100' : 'text-stone-300')}>{month.label}</p>
                            <span className={cn('text-[11px] uppercase tracking-[0.16em]', isActive ? 'text-violet-200/82' : 'text-stone-500')}>
                              {month.itemCount || '—'}
                            </span>
                          </div>
                          <p className="text-xs leading-6 text-stone-500">{monthSummary(month)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeMonth ? (
                <div className="relative space-y-4 rounded-[22px] border border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.024),rgba(255,255,255,0.012))] p-4 md:p-5">
                  <div className="pointer-events-none absolute -left-3 top-8 hidden h-px w-3 bg-[linear-gradient(90deg,rgba(157,139,242,0.7),rgba(157,139,242,0))] lg:block" />
                  <div className="pointer-events-none absolute -left-3 top-8 hidden h-10 w-px bg-[linear-gradient(180deg,rgba(157,139,242,0),rgba(157,139,242,0.65),rgba(157,139,242,0))] lg:block" />
                  <div className="flex flex-col gap-2 border-b border-white/[0.05] pb-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1.5">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Month Stage · {activeMonth.shortLabel}</p>
                      <h5 className="font-cjk text-[1rem] font-medium text-stone-100">月份被点亮后，右侧直接接住它，展开成这一月的完整月历。</h5>
                      <p className="text-xs leading-6 text-stone-500">{activeYear.year} 年 → {activeMonth.label} → 月历视图</p>
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
                      const isFocused = activeDay?.key === day.key;

                      return (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => setSelectedDay(day.key)}
                          className={cn(
                            'group min-h-[7.5rem] rounded-[18px] border px-2.5 py-2.5 text-left transition sm:min-h-[8.5rem] sm:px-3 sm:py-3',
                            isFocused
                              ? 'border-violet-200/34 bg-[linear-gradient(180deg,rgba(136,117,216,0.18),rgba(255,255,255,0.03))] shadow-[0_16px_34px_rgba(0,0,0,0.16),inset_0_0_0_1px_rgba(157,139,242,0.12)]'
                              : hasContent
                                ? 'border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] hover:border-violet-200/18 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(136,117,216,0.04))]'
                                : 'border-white/[0.04] bg-white/[0.012] hover:border-white/[0.07] hover:bg-white/[0.025]',
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <p className={cn('text-[12px] tracking-[0.08em]', isFocused ? 'text-stone-50' : hasContent ? 'text-stone-100' : 'text-stone-500')}>
                                {String(day.day).padStart(2, '0')}
                              </p>
                              <p className={cn('text-[10px] uppercase tracking-[0.18em]', isFocused ? 'text-violet-100/75' : 'text-stone-600')}>
                                {WEEKDAY_LABELS[day.weekday]}
                              </p>
                            </div>
                            <span
                              className={cn(
                                'mt-0.5 h-2.5 w-2.5 rounded-full transition',
                                isFocused
                                  ? 'bg-violet-200 shadow-[0_0_0_5px_rgba(136,117,216,0.12)]'
                                  : hasContent
                                    ? 'bg-violet-300/75 shadow-[0_0_0_4px_rgba(136,117,216,0.08)]'
                                    : 'bg-white/[0.08]',
                              )}
                            />
                          </div>

                          <div className="mt-4 space-y-2">
                            {hasContent ? (
                              <>
                                <p className={cn('text-[10px] uppercase tracking-[0.16em]', isFocused ? 'text-violet-100/78' : getKindTone(preview.kind))}>{getKindLabel(preview.kind)}</p>
                                <span className={cn('block text-[12px] leading-5 transition', isFocused ? 'text-stone-100' : 'text-stone-300 group-hover:text-stone-100')}>
                                  <span className="line-clamp-2">{preview.title}</span>
                                </span>
                                <div className="flex items-center gap-1.5 pt-1">
                                  {day.items.slice(0, 3).map((item) => (
                                    <span key={item.id} className={cn('h-1.5 w-1.5 rounded-full', getKindDot(item.kind))} />
                                  ))}
                                  {extraCount > 0 ? <span className="text-[10px] text-stone-500">+{extraCount}</span> : null}
                                </div>
                              </>
                            ) : (
                              <div className={cn('pt-6 text-[11px] leading-5', isFocused ? 'text-stone-400' : 'text-stone-600')}>留白</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(220px,0.85fr)]">
                    <div className="rounded-[18px] border border-dashed border-white/[0.06] bg-black/12 px-4 py-3 text-sm leading-7 text-stone-400">
                      {activeDay?.items.length ? (
                        <div className="space-y-2">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Focused Day</p>
                          <p>
                            当前聚焦在 <span className="text-stone-200">{String(activeDay.day).padStart(2, '0')} 日</span>，这一天挂了 {activeDay.items.length} 条内容；月历中的高亮不只表示“有内容”，也表示“你此刻正在看这里”。
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Focused Day</p>
                          <p>当前聚焦日期是留白日。它仍保留在时间结构里，提醒这个月并不是被内容填满，而是在真实节奏里推进。</p>
                        </div>
                      )}
                    </div>

                    <div className="rounded-[18px] border border-white/[0.05] bg-white/[0.018] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Explorer Note</p>
                      <p className="mt-2 text-sm leading-7 text-stone-400">从年份落点、月份切片到单日聚焦，整个区域现在更像同一台时间探索器，而不是三块并列的信息卡。</p>
                    </div>
                  </div>

                  {activeDay?.items.length ? (
                    <div className="rounded-[20px] border border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.014))] p-4 md:p-4.5">
                      <div className="flex flex-col gap-3 border-b border-white/[0.05] pb-3 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-1">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Day Panel · {String(activeDay.day).padStart(2, '0')} 日</p>
                          <h6 className="font-cjk text-[0.98rem] text-stone-100">这一天是当前月历里的聚焦点。</h6>
                        </div>
                        <p className="text-sm text-stone-400">{activeDay.items.length} 条内容</p>
                      </div>

                      <div className="mt-3 grid gap-3">
                        {activeDay.items.slice(0, 3).map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            className="group rounded-[16px] border border-white/[0.05] bg-black/12 px-4 py-3 transition hover:border-white/[0.08] hover:bg-white/[0.028]"
                          >
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]">
                              <span className={getKindTone(item.kind)}>{getKindLabel(item.kind)}</span>
                              {item.meta ? <span className="text-stone-600">{item.meta}</span> : null}
                            </div>
                            <p className="mt-2 font-cjk text-[0.96rem] text-stone-100 group-hover:text-white">{item.title}</p>
                            <p className="mt-1 text-sm leading-6 text-stone-400">{item.summary}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
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
