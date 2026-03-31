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

type LaneId = 'input' | 'structure' | 'practice';

type RailLane = {
  id: LaneId;
  label: string;
  hint: string;
  accent: string;
  glow: string;
};

type DaySlot = {
  key: string;
  date: Date;
  label: string;
  weekLabel: string;
  items: TimelineEntry[];
  topicSummary: string[];
  dominantLane: LaneId | null;
  intensity: number;
};

const laneMeta: Record<LaneId, RailLane> = {
  input: {
    id: 'input',
    label: '输入',
    hint: '阅读、精读、吸收',
    accent: 'rgba(178, 150, 112, 0.96)',
    glow: 'rgba(178, 150, 112, 0.2)',
  },
  structure: {
    id: 'structure',
    label: '沉淀',
    hint: '知识卡片、结构整理',
    accent: 'rgba(145, 144, 199, 0.96)',
    glow: 'rgba(145, 144, 199, 0.18)',
  },
  practice: {
    id: 'practice',
    label: '推进',
    hint: '项目、练习、复盘',
    accent: 'rgba(99, 154, 169, 0.96)',
    glow: 'rgba(99, 154, 169, 0.18)',
  },
};

function normalizeDateKey(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toISOString().slice(0, 10);
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }).format(date);
}

function formatWeekLabel(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', { weekday: 'short' }).format(date);
}

function getLaneId(item: TimelineEntry): LaneId {
  if (item.kind === 'note') return 'structure';
  if (item.kind === 'project') return 'practice';
  if (item.meta === 'review' || item.meta === 'practice' || item.meta === 'project') return 'practice';
  if (item.meta === 'writing') return 'structure';
  return 'input';
}

function buildDaySlots(items: TimelineEntry[]) {
  const sorted = [...items].sort((a, b) => (a.date < b.date ? -1 : 1));
  const latestDate = sorted.length > 0 ? new Date(sorted[sorted.length - 1].date) : new Date();
  const end = Number.isNaN(latestDate.getTime()) ? new Date() : latestDate;
  end.setHours(0, 0, 0, 0);

  const days: DaySlot[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const dayItems = sorted.filter((item) => normalizeDateKey(item.date) === key);

    const laneCounts = dayItems.reduce<Record<LaneId, number>>(
      (acc, item) => {
        const laneId = getLaneId(item);
        acc[laneId] += 1;
        return acc;
      },
      { input: 0, structure: 0, practice: 0 }
    );

    const dominantLane = (Object.entries(laneCounts).sort((a, b) => b[1] - a[1])[0]?.[1] ?? 0) > 0
      ? (Object.entries(laneCounts).sort((a, b) => b[1] - a[1])[0][0] as LaneId)
      : null;

    const topicSummary = Array.from(
      new Set(
        dayItems
          .flatMap((item) => item.tags ?? [])
          .filter(Boolean)
      )
    ).slice(0, 3);

    return {
      key,
      date,
      label: formatDayLabel(date),
      weekLabel: formatWeekLabel(date),
      items: dayItems,
      topicSummary,
      dominantLane,
      intensity: Math.min(dayItems.length, 4),
    };
  });

  return days;
}

function getKindLabel(kind: TimelineEntry['kind']) {
  if (kind === 'log') return '日志';
  if (kind === 'note') return '笔记';
  return '项目';
}

export function TimelinePreview({ items }: { items: TimelineEntry[] }) {
  const lanes = Object.values(laneMeta);
  const daySlots = buildDaySlots(items);
  const totalEntries = daySlots.reduce((sum, day) => sum + day.items.length, 0);
  const activeDays = daySlots.filter((day) => day.items.length > 0).length;
  const peakDay = [...daySlots].sort((a, b) => b.items.length - a.items.length)[0];
  const allTopics = Array.from(new Set(daySlots.flatMap((day) => day.topicSummary))).slice(0, 5);

  return (
    <section className="section-shell stagger-surface overflow-hidden">
      <div className="relative space-y-7">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <p className="section-label">Recent 7 Days</p>
            <h2 className="font-cjk text-[1.55rem] font-medium leading-[1.4] tracking-tight text-stone-100 md:text-[1.9rem]">
              最近 7 天学习轨道
            </h2>
            <p className="max-w-3xl text-sm leading-8 text-stone-400">
              把首页主舞台留给最近一周：先看节奏，再看密度，最后再沿着日志、笔记和项目进入具体内容。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="pill-tag">Input / Structure / Practice</span>
            <Link href="/logs" className="refined-link">
              <span>查看全部记录</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.92fr_2.08fr]">
          <InteractiveSurface className="surface-card rounded-[26px] p-5 md:p-6">
            <div className="relative space-y-5">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Weekly Reading</p>
                <p className="max-w-md text-sm leading-8 text-stone-300">
                  最近一周有 {activeDays} 天留下了实际学习痕迹，共 {totalEntries} 条内容进入轨道。这里不强调精确时刻，而是把一周当成一张学习板：看哪几天更热，哪些主题开始反复出现。
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.025] p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Active Days</p>
                  <p className="mt-3 font-cjk text-[1.5rem] text-stone-100">{String(activeDays).padStart(2, '0')}</p>
                  <p className="mt-2 text-xs leading-6 text-stone-500">不是天天都满，但保持可见的推进。</p>
                </div>
                <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.025] p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Peak Day</p>
                  <p className="mt-3 font-cjk text-[1.5rem] text-stone-100">{peakDay?.label ?? '--'}</p>
                  <p className="mt-2 text-xs leading-6 text-stone-500">活动最密的一天，往往也是不同主题开始互相碰撞的时候。</p>
                </div>
                <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.025] p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Theme Cluster</p>
                  <p className="mt-3 text-sm leading-7 text-stone-200">{allTopics.slice(0, 2).join(' · ') || '持续积累中'}</p>
                  <p className="mt-2 text-xs leading-6 text-stone-500">把零散记录看成渐渐成形的主题簇。</p>
                </div>
              </div>

              <div className="rounded-[22px] border border-white/[0.06] bg-black/10 p-4">
                <div className="flex flex-wrap gap-2">
                  {lanes.map((lane) => (
                    <span
                      key={lane.id}
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[11px] tracking-[0.16em] text-stone-400"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: lane.accent, boxShadow: `0 0 0 5px ${lane.glow}` }} />
                      {lane.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </InteractiveSurface>

          <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="min-w-[980px] rounded-[28px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,248,240,0.025),rgba(255,248,240,0.01))] p-4 md:p-5">
              <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-3">
                {daySlots.map((day) => {
                  const dominantLane = day.dominantLane ? laneMeta[day.dominantLane] : null;

                  return (
                    <InteractiveSurface
                      key={day.key}
                      className="surface-card surface-card-hover rounded-[24px] border-white/[0.05] p-4"
                    >
                      <div className="relative flex h-full min-h-[360px] flex-col gap-4">
                        <div className="space-y-3 border-b border-white/[0.06] pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">{day.weekLabel}</p>
                              <p className="mt-1 text-base text-stone-100">{day.label}</p>
                            </div>
                            <span className="pill-tag">{day.items.length === 0 ? 'Quiet' : `${day.items.length} 条`}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {Array.from({ length: 4 }).map((_, index) => (
                              <span
                                key={index}
                                className="h-1.5 flex-1 rounded-full"
                                style={{
                                  background:
                                    index < day.intensity
                                      ? dominantLane
                                        ? `linear-gradient(90deg, ${dominantLane.accent}, rgba(255,248,240,0.72))`
                                        : 'rgba(255,248,240,0.18)'
                                      : 'rgba(255,248,240,0.06)',
                                  boxShadow: index < day.intensity && dominantLane ? `0 0 14px ${dominantLane.glow}` : 'none',
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          {lanes.map((lane) => {
                            const laneItems = day.items.filter((item) => getLaneId(item) === lane.id);
                            const primary = laneItems[0];

                            return (
                              <div key={`${day.key}-${lane.id}`} className="rounded-[18px] border border-white/[0.05] bg-white/[0.018] p-3">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 text-[11px] tracking-[0.14em] text-stone-400">
                                    <span
                                      className="h-2.5 w-2.5 rounded-full"
                                      style={{ backgroundColor: lane.accent, boxShadow: `0 0 0 5px ${lane.glow}` }}
                                    />
                                    <span>{lane.label}</span>
                                  </div>
                                  <span className="text-[11px] text-stone-600">{laneItems.length || '—'}</span>
                                </div>

                                <div className="mt-3 flex gap-1.5">
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <span
                                      key={index}
                                      className="h-8 flex-1 rounded-[10px]"
                                      style={{
                                        background:
                                          index < Math.min(laneItems.length, 5)
                                            ? `linear-gradient(180deg, ${lane.glow}, rgba(255,255,255,0.05))`
                                            : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${index < laneItems.length ? lane.glow : 'rgba(255,255,255,0.04)'}`,
                                      }}
                                    />
                                  ))}
                                </div>

                                <div className="mt-3 min-h-[42px]">
                                  {primary ? (
                                    <Link href={primary.href} className="block rounded-[14px] border px-3 py-2.5 text-xs leading-6 text-stone-300 transition hover:-translate-y-0.5" style={{ borderColor: lane.glow, background: `linear-gradient(180deg, ${lane.glow}, rgba(255,255,255,0.02))` }}>
                                      <span className="mr-2 text-stone-500">{getKindLabel(primary.kind)}</span>
                                      <span className="line-clamp-2">{primary.title}</span>
                                    </Link>
                                  ) : (
                                    <div className="rounded-[14px] border border-dashed border-white/[0.05] px-3 py-2.5 text-xs text-stone-600">
                                      这一段相对安静
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-auto rounded-[18px] border border-white/[0.05] bg-black/10 p-3.5">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Topic Cluster</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {day.topicSummary.length > 0 ? (
                              day.topicSummary.map((topic) => (
                                <span key={topic} className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] text-stone-300">
                                  {topic}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-stone-600">把空白也留在轨道里，给下一次推进预留空间。</span>
                            )}
                          </div>
                          {day.items[0] ? (
                            <p className="mt-3 line-clamp-3 text-xs leading-6 text-stone-500">{day.items[0].summary}</p>
                          ) : null}
                        </div>
                      </div>
                    </InteractiveSurface>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
