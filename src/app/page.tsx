import Link from 'next/link';
import { siteConfig } from '@/data/site';
import { currentLearning } from '@/data/current-learning';
import { getAllLogs, getAllNotes, getAllProjects } from '@/lib/content';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { Hero } from '@/components/home/Hero';
import { HomeMotion } from '@/components/home/HomeMotion';
import { CurrentLearningCard } from '@/components/home/CurrentLearningCard';
import { TimelinePreview, type TimelineItem, type TimelineMonth, type TimelineYear } from '@/components/home/TimelinePreview';
import { SectionHeader } from '@/components/common/SectionHeader';
import { InteractiveSurface } from '@/components/common/InteractiveSurface';
import { LogCard } from '@/components/logs/LogCard';
import { NoteCard } from '@/components/notes/NoteCard';
import { ProjectCard } from '@/components/projects/ProjectCard';

export default function HomePage() {
  const logs = getAllLogs();
  const notes = getAllNotes();
  const projects = getAllProjects();
  const featuredLogs = logs.slice(0, 3);
  const featuredNotes = notes.filter((item) => item.featured).slice(0, 3);
  const featuredProjects = projects.slice(0, 2);
  const latestProject = featuredProjects[0];

  const stats = [
    { label: 'Learning Logs', value: String(logs.length).padStart(2, '0'), note: '持续记录输入、实践与复盘' },
    { label: 'Knowledge Notes', value: String(notes.length).padStart(2, '0'), note: '把零散理解整理成可复用卡片' },
    { label: 'Projects', value: String(projects.length).padStart(2, '0'), note: '用项目验证抽象，而不只停留在阅读' },
  ];

  const quickMap = [
    {
      title: '学习日志',
      description: '按时间查看最近在学什么、卡在哪里、下一步做什么。',
      href: '/logs',
      badge: 'Timeline',
    },
    {
      title: '知识库',
      description: '把重复出现的概念、方法和结构沉淀成随时可取用的条目。',
      href: '/notes',
      badge: 'Knowledge Base',
    },
    {
      title: '项目实践',
      description: '把学习结果落到真实产出里，避免“看过等于会了”的错觉。',
      href: '/projects',
      badge: 'Practice',
    },
  ];

  const deckSections = [
    { label: 'Now', title: '10-year timeline', note: '先在近十年里定位内容主要落在哪些年份' },
    { label: 'Drill Down', title: '年 / 月 / 月历展开', note: '从年份进入月份，再用整张月历查看该月分布' },
    { label: 'Output', title: '最新内容与项目', note: '沿着日志、知识卡片、实践继续深入' },
  ];

  const parseProjectDate = (period?: string) => {
    if (!period) return '';
    const matched = period.match(/(\d{4})\.(\d{1,2})/);
    if (!matched) return '';
    const [, year, month] = matched;
    return `${year}-${String(month).padStart(2, '0')}-01`;
  };

  const timelineItems: TimelineItem[] = [
    ...logs.map((item) => ({
      id: `log-${item.id}`,
      title: item.title,
      summary: item.summary,
      date: item.date,
      href: `/logs/${item.slug}`,
      kind: 'log' as const,
      meta: item.type,
      tags: item.tags,
    })),
    ...notes.map((item) => ({
      id: `note-${item.id}`,
      title: item.title,
      summary: item.summary,
      date: item.updatedAt,
      href: `/notes/${item.slug}`,
      kind: 'note' as const,
      meta: item.category,
      tags: item.tags,
    })),
    ...projects.map((item) => ({
      id: `project-${item.id}`,
      title: item.title,
      summary: item.summary,
      date: parseProjectDate(item.period),
      href: item.href || `/projects/${item.slug}`,
      kind: 'project' as const,
      meta: item.status,
      tags: item.tags,
    })),
  ].filter((item) => item.date);

  const currentYear = new Date().getFullYear();
  const timelineYears: TimelineYear[] = Array.from({ length: 10 }, (_, index) => currentYear - 9 + index).map((year) => {
    const months: TimelineMonth[] = Array.from({ length: 12 }, (_, monthIndex) => {
      const month = monthIndex + 1;
      const daysInMonth = new Date(year, month, 0).getDate();
      const monthItems = timelineItems
        .filter((item) => item.date.startsWith(`${year}-${String(month).padStart(2, '0')}`))
        .sort((a, b) => (a.date < b.date ? 1 : -1));

      const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;

      return {
        key: `${year}-${String(month).padStart(2, '0')}`,
        month,
        label: new Intl.DateTimeFormat('zh-CN', { month: 'long' }).format(new Date(year, monthIndex, 1)),
        shortLabel: `${String(month).padStart(2, '0')}月`,
        itemCount: monthItems.length,
        firstWeekday,
        days: Array.from({ length: daysInMonth }, (_, dayIndex) => {
          const day = dayIndex + 1;
          const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          return {
            day,
            key,
            weekday: (firstWeekday + dayIndex) % 7,
            items: monthItems.filter((item) => item.date === key),
          };
        }),
      };
    });

    return {
      year,
      key: String(year),
      itemCount: months.reduce((total, month) => total + month.itemCount, 0),
      months,
    };
  });

  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <HomeMotion>
          <SiteContainer className="space-y-10 py-8 md:space-y-12 md:py-12">
            <Hero
              title={siteConfig.tagline}
              subtitle={siteConfig.description}
              primaryAction={{ label: '查看学习日志', href: '/logs' }}
              secondaryAction={{ label: '进入知识库', href: '/notes' }}
              stats={stats}
            />

            <div className="grid gap-5 2xl:grid-cols-[minmax(248px,15.5vw)_minmax(0,1fr)] 2xl:items-start 2xl:gap-8">
              <aside className="space-y-4 2xl:sticky 2xl:top-24">
                <InteractiveSurface as="section" className="section-shell interactive-section-shell stagger-surface space-y-5 rounded-[30px] xl:min-h-[calc(100vh-7.5rem)] xl:px-5 xl:py-6 2xl:space-y-4">
                  <div className="space-y-3 border-b border-white/[0.05] pb-5">
                    <p className="section-label">Study Deck</p>
                    <h2 className="font-cjk text-[1.14rem] font-medium leading-[1.6] tracking-tight text-stone-100 2xl:text-[1.18rem]">
                      这里先给索引，
                      <br />
                      再把主舞台留给最近的学习现场。
                    </h2>
                    <p className="text-[13px] leading-7 text-stone-400 2xl:text-sm">
                      左列像目录、路标和阅读说明；右侧先给出十年时间总览，再往下展开当前重点与最近输出。
                    </p>
                  </div>

                  <div className="space-y-3 rounded-[24px] border border-white/[0.05] bg-white/[0.018] p-4 2xl:p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Desk Index</p>
                      <span className="pill-tag">Stable Nav</span>
                    </div>
                    <div className="grid gap-2.5">
                      {quickMap.map((item, index) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="interactive-card-link group flex items-start gap-3 rounded-[18px] border border-white/[0.05] bg-black/12 px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-white/[0.1] 2xl:px-3.5"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.05] bg-white/[0.02] text-[11px] tracking-[0.16em] text-stone-400">
                            0{index + 1}
                          </div>
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="font-cjk text-[1rem] font-medium text-stone-100">{item.title}</h3>
                              <span className="text-sm text-stone-500 transition group-hover:text-stone-300">→</span>
                            </div>
                            <p className="text-xs leading-6 text-stone-400">{item.description}</p>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-stone-500">{item.badge}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-[24px] border border-white/[0.05] bg-black/12 p-4 2xl:p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Reading Order</p>
                      <span className="pill-tag">Flow</span>
                    </div>
                    <div className="grid gap-2.5">
                      {deckSections.map((section, index) => (
                        <div key={section.label} className="rounded-[18px] border border-white/[0.05] bg-white/[0.018] px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-stone-500">0{index + 1} · {section.label}</p>
                            <span className="h-1.5 w-1.5 rounded-full bg-violet-300/70" />
                          </div>
                          <p className="mt-2 font-cjk text-[0.98rem] text-stone-100">{section.title}</p>
                          <p className="mt-1 text-xs leading-6 text-stone-500">{section.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <InteractiveSurface className="surface-card rounded-[24px] p-5 2xl:p-[1.125rem]">
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-2">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">How to Read</p>
                          <h3 className="font-cjk text-[1.02rem] font-medium text-stone-100">先看年份，再沿月份进入该月的月历细节</h3>
                        </div>
                        <span className="pill-tag">Guide</span>
                      </div>
                      <div className="space-y-3 text-sm leading-7 text-stone-400">
                        <p>先看右侧十年时间轴，判断内容主要落在哪些年份；再点进对应月份，直接看该月月历里哪些日期真正留下了内容。</p>
                        <p>如果想快速进入，日志看过程，知识卡片看结构，项目页看理解是否真的落地。</p>
                      </div>
                    </div>
                  </InteractiveSurface>
                </InteractiveSurface>
              </aside>

              <div className="space-y-6 2xl:space-y-7">
                <InteractiveSurface as="section" className="section-shell interactive-section-shell stagger-surface overflow-hidden rounded-[32px] 2xl:px-10 2xl:py-10">
                  <div className="space-y-5 2xl:space-y-6">
                    <div className="space-y-2 border-b border-white/[0.05] pb-5 2xl:pb-6">
                      <p className="section-label">Main Board</p>
                      <h2 className="font-cjk text-[1.45rem] font-medium leading-[1.45] tracking-tight text-stone-100 md:text-[1.8rem]">
                        时间不只是一条线，
                        <br className="hidden md:block" />
                        也可以是一层层被展开的学习现场。
                      </h2>
                      <p className="max-w-[42rem] text-sm leading-8 text-stone-400 2xl:text-[15px]">
                        先看近十年的总览，再沿年份、月份与该月月历逐层进入；有内容的节点被轻量强调，空白节点也仍然保留。
                      </p>
                    </div>

                    <TimelinePreview years={timelineYears} />
                  </div>
                </InteractiveSurface>

                <InteractiveSurface as="section" className="section-shell interactive-section-shell stagger-surface rounded-[32px] 2xl:px-10 2xl:py-9">
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.38fr)_minmax(300px,0.8fr)] xl:items-start 2xl:grid-cols-[minmax(0,1.52fr)_minmax(320px,0.74fr)]">
                    <div className="space-y-5">
                      <SectionHeader title="当前在学" description="最近正在持续推进的主题，不求铺太开，但求稳定往前走。" />
                      <div className="grid gap-4 md:grid-cols-2 2xl:gap-5">
                        {currentLearning.map((item) => (
                          <CurrentLearningCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 content-start">
                      <section className="interactive-card-link rounded-[24px] border border-white/[0.05] bg-white/[0.018] p-5">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="section-label">Focus Note</p>
                            <span className="pill-tag">Bridge</span>
                          </div>
                          <h3 className="font-cjk text-[1.08rem] font-medium text-stone-100">让“在学什么”成为主舞台周边的次级模块</h3>
                          <p className="text-sm leading-8 text-stone-400">
                            这里不和上方时间探索器抢中心，而是作为右侧主板下方的延伸：说明近期正在持续投入哪些方向，以及它们和日志、笔记、项目怎样互相支撑。
                          </p>
                        </div>
                      </section>

                      {latestProject ? (
                        <Link href={latestProject.href || `/projects/${latestProject.slug}`} className="interactive-card-link group block rounded-[24px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(136,117,216,0.16),rgba(255,255,255,0.022))] p-5 transition hover:-translate-y-0.5 hover:border-white/[0.1]">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="section-label text-stone-400">Practice Pulse</p>
                              <span className="pill-tag">Project</span>
                            </div>
                            <h3 className="font-cjk text-[1.08rem] font-medium text-stone-100 group-hover:text-white">{latestProject.title}</h3>
                            <p className="text-sm leading-8 text-stone-400">{latestProject.summary}</p>
                          </div>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </InteractiveSurface>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1.56fr)_minmax(330px,0.84fr)] xl:items-start 2xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,0.8fr)] 2xl:gap-6">
                  <section className="section-shell stagger-surface overflow-hidden rounded-[32px] 2xl:px-10 2xl:py-9">
                    <SectionHeader title="最近留下的内容" description="最新更新的学习日志，保留过程而不是只展示结论。" actionLabel="查看全部" actionHref="/logs" />
                    <div className="grid gap-4">
                      {featuredLogs.map((item) => (
                        <LogCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>

                  <div className="grid gap-5 2xl:grid-rows-[auto_1fr]">
                    <section className="section-shell stagger-surface rounded-[32px] 2xl:min-h-[22rem]">
                      <SectionHeader title="快速复习入口" description="如果不想从长文开始，可以先从最近整理出来的知识卡片切入，再回到上面的轨道与日志。" actionLabel="进入知识库" actionHref="/notes" />
                      <div className="grid gap-3">
                        {featuredNotes.slice(0, 2).map((item) => (
                          <NoteCard key={item.id} item={item} compact />
                        ))}
                      </div>
                    </section>

                    <section className="section-shell stagger-surface rounded-[32px] 2xl:min-h-[24rem]">
                      <SectionHeader title="项目 / 实践" description="学习不是收藏信息，而是用真实产出来检验理解。" actionLabel="查看项目" actionHref="/projects" />
                      <div className="grid gap-4">
                        {featuredProjects.map((item) => (
                          <ProjectCard key={item.id} item={item} />
                        ))}
                      </div>
                    </section>
                  </div>
                </section>

                <section className="section-shell stagger-surface rounded-[32px] 2xl:px-10 2xl:py-9">
                  <SectionHeader title="精选知识卡片" description="这些内容更偏“结构化沉淀”，适合回顾概念、方法和框架。" actionLabel="进入知识库" actionHref="/notes" />
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {featuredNotes.map((item) => (
                      <NoteCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>

                <section className="surface-card stagger-surface rounded-[32px] p-7 md:p-9">
                  <div className="relative grid gap-4 md:grid-cols-[1.2fr_0.8fr] md:items-end">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">About this site</p>
                      <h2 className="font-cjk text-[1.9rem] font-medium leading-[1.35] tracking-tight text-stone-100 md:text-[2.35rem]">这不是传统博客，而是我长期维护的学习记录系统</h2>
                      <p className="max-w-3xl text-[0.98rem] leading-8 text-stone-300">
                        这里记录学习日志、沉淀知识结构，也保存那些在长期练习中逐渐成形的理解。目标不是“看起来很满”，而是让每一次学习都更容易被找回、连接和继续推进。
                      </p>
                    </div>
                    <div className="grid gap-2 text-sm text-stone-400 md:justify-items-end">
                      <span className="pill-tag">记录输入</span>
                      <span className="pill-tag">整理结构</span>
                      <span className="pill-tag">反复迭代</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </SiteContainer>
        </HomeMotion>
      </main>
      <Footer />
    </>
  );
}
