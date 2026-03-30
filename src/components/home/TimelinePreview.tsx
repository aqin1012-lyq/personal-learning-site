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

type RailLane = {
  id: string;
  label: string;
  hint: string;
  accent: string;
  glow: string;
  items: TimelineEntry[];
};

const laneMeta = {
  input: {
    label: '输入 / 学习',
    hint: '阅读、精读、系统吸收',
    accent: 'rgba(178, 150, 112, 0.95)',
    glow: 'rgba(178, 150, 112, 0.2)',
  },
  structure: {
    label: '整理 / 沉淀',
    hint: '知识卡片、结构归档',
    accent: 'rgba(142, 144, 200, 0.95)',
    glow: 'rgba(142, 144, 200, 0.18)',
  },
  practice: {
    label: '实践 / 推进',
    hint: '项目、练习、复盘推进',
    accent: 'rgba(102, 152, 167, 0.95)',
    glow: 'rgba(102, 152, 167, 0.18)',
  },
} as const;

function formatDayLabel(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }).format(parsed);
}

function formatWeekLabel(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return new Intl.DateTimeFormat('zh-CN', { weekday: 'short' }).format(parsed);
}

function getLaneId(item: TimelineEntry): keyof typeof laneMeta {
  if (item.kind === 'note') return 'structure';
  if (item.kind === 'project') return 'practice';
  if (item.meta === 'review' || item.meta === 'practice' || item.meta === 'project') return 'practice';
  if (item.meta === 'writing') return 'structure';
  return 'input';
}

export function TimelinePreview({ items }: { items: TimelineEntry[] }) {
  const sortedItems = [...items].sort((a, b) => (a.date > b.date ? 1 : -1));

  const uniqueDays = Array.from(new Set(sortedItems.map((item) => item.date))).slice(-7);

  const lanes: RailLane[] = Object.entries(laneMeta).map(([id, meta]) => ({
    id,
    label: meta.label,
    hint: meta.hint,
    accent: meta.accent,
    glow: meta.glow,
    items: sortedItems.filter((item) => getLaneId(item) === id),
  }));

  return (
    <section className="section-shell stagger-surface overflow-hidden">
      <div className="relative space-y-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="section-label">Activity Rail</p>
            <h2 className="font-cjk text-[1.55rem] font-medium leading-[1.4] tracking-tight text-stone-100 md:text-[1.9rem]">
              最近 7 天学习轨道
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-stone-400">
              先做一版可看的 activity rail：上面是时间维度，左边是学习类别，中间用横向轨道展示最近几天都在推进什么。
            </p>
          </div>
          <Link href="/logs" className="refined-link">
            <span>查看全部记录</span>
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="min-w-[980px] space-y-4">
            <div className="grid grid-cols-[220px_repeat(7,minmax(0,1fr))] gap-3">
              <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-4 text-sm text-stone-400">
                用时间维度看最近一周的输入、整理与实践分布。
              </div>
              {uniqueDays.map((day) => (
                <div key={day} className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-3 py-4 text-center">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-stone-500">{formatWeekLabel(day)}</p>
                  <p className="mt-2 text-sm text-stone-200">{formatDayLabel(day)}</p>
                </div>
              ))}
            </div>

            {lanes.map((lane) => (
              <div key={lane.id} className="grid grid-cols-[220px_repeat(7,minmax(0,1fr))] gap-3">
                <InteractiveSurface className="surface-card block rounded-[24px] p-4">
                  <div className="relative space-y-2">
                    <p className="font-cjk text-[1.02rem] font-medium text-stone-100">{lane.label}</p>
                    <p className="text-xs leading-6 text-stone-500">{lane.hint}</p>
                  </div>
                </InteractiveSurface>

                {uniqueDays.map((day) => {
                  const dayItems = lane.items.filter((item) => item.date === day);

                  return (
                    <InteractiveSurface key={`${lane.id}-${day}`} className="surface-card surface-card-hover block rounded-[24px] p-3">
                      <div className="relative min-h-[132px] space-y-2 overflow-hidden rounded-[18px]">
                        <div className="absolute inset-x-0 top-7 h-px bg-white/[0.05]" />
                        <div className="absolute inset-x-0 top-[3.4rem] h-px bg-white/[0.04]" />
                        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/[0.035]" />

                        {dayItems.length > 0 ? (
                          dayItems.slice(0, 2).map((item, index) => (
                            <Link
                              key={item.id}
                              href={item.href}
                              className="relative block rounded-[16px] border px-3 py-3 transition hover:-translate-y-0.5"
                              style={{
                                borderColor: lane.glow,
                                background: `linear-gradient(180deg, ${lane.glow}, rgba(255,255,255,0.02))`,
                                marginTop: index === 0 ? 0 : '0.55rem',
                                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.02), 0 10px 24px rgba(0,0,0,0.12)`,
                              }}
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                                  <span
                                    className="inline-block h-2 w-2 rounded-full"
                                    style={{ backgroundColor: lane.accent, boxShadow: `0 0 0 4px ${lane.glow}` }}
                                  />
                                  <span>{item.kind === 'log' ? '日志' : item.kind === 'note' ? '笔记' : '项目'}</span>
                                </div>
                                <p className="line-clamp-2 text-sm leading-6 text-stone-200">{item.title}</p>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="flex min-h-[108px] items-center justify-center rounded-[16px] border border-dashed border-white/[0.05] bg-white/[0.015] text-xs text-stone-600">
                            暂无记录
                          </div>
                        )}
                      </div>
                    </InteractiveSurface>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
