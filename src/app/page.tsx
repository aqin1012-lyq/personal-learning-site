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
import { TimelinePreview } from '@/components/home/TimelinePreview';
import { SectionHeader } from '@/components/common/SectionHeader';
import { InteractiveSurface } from '@/components/common/InteractiveSurface';
import { LogCard } from '@/components/logs/LogCard';
import { NoteCard } from '@/components/notes/NoteCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { FeaturePanel } from '@/components/common/FeaturePanel';

export default function HomePage() {
  const logs = getAllLogs();
  const notes = getAllNotes();
  const projects = getAllProjects();
  const featuredLogs = logs.slice(0, 3);
  const featuredNotes = notes.filter((item) => item.featured).slice(0, 3);
  const featuredProjects = projects.slice(0, 2);
  const latestLog = featuredLogs[0];
  const latestNote = featuredNotes[0];
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
    { label: 'Now', title: '7-day activity rail', note: '先判断最近一周的节奏与重心' },
    { label: 'Focus', title: '当前在学', note: '看正在持续推进的主题，而不是一次性热点' },
    { label: 'Output', title: '最新内容与项目', note: '沿着日志、知识卡片、实践继续深入' },
  ];

  const timelineItems = [
    ...logs.slice(0, 5).map((item) => ({
      id: `log-${item.id}`,
      title: item.title,
      summary: item.summary,
      date: item.date,
      href: `/logs/${item.slug}`,
      kind: 'log' as const,
      meta: item.type,
      tags: item.tags,
    })),
    ...notes.slice(0, 4).map((item) => ({
      id: `note-${item.id}`,
      title: item.title,
      summary: item.summary,
      date: item.updatedAt,
      href: `/notes/${item.slug}`,
      kind: 'note' as const,
      meta: item.category,
      tags: item.tags,
    })),
    ...projects.slice(0, 2).map((item, index) => ({
      id: `project-${item.id}`,
      title: item.title,
      summary: item.summary,
      date: item.period?.split('—')[0]?.trim() || item.period || `2026-03-0${index + 1}`,
      href: item.href || `/projects/${item.slug}`,
      kind: 'project' as const,
      meta: item.status,
      tags: item.tags,
    })),
  ]
    .filter((item) => item.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 11);

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

            <div className="grid gap-5 2xl:grid-cols-[minmax(280px,18vw)_minmax(0,1fr)] 2xl:items-start 2xl:gap-7">
              <aside className="space-y-4 2xl:sticky 2xl:top-24">
                <section className="section-shell stagger-surface space-y-5 rounded-[30px] xl:min-h-[calc(100vh-7.5rem)] xl:px-6 xl:py-7">
                  <div className="space-y-3 border-b border-white/[0.06] pb-5">
                    <p className="section-label">Study Deck</p>
                    <h2 className="font-cjk text-[1.22rem] font-medium leading-[1.55] tracking-tight text-stone-100">
                      这里先给索引，
                      <br />
                      再把主舞台留给最近的学习现场。
                    </h2>
                    <p className="text-sm leading-7 text-stone-400">
                      左列像目录、路标和阅读说明；右侧才是本周轨道、当前重点与最近输出的工作台。
                    </p>
                  </div>

                  <div className="space-y-3 rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Desk Index</p>
                      <span className="pill-tag">Stable Nav</span>
                    </div>
                    <div className="grid gap-2.5">
                      {quickMap.map((item, index) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group flex items-start gap-3 rounded-[18px] border border-white/[0.05] bg-black/10 px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-white/[0.1]"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.05] bg-white/[0.03] text-[11px] tracking-[0.16em] text-stone-400">
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

                  <div className="space-y-3 rounded-[24px] border border-white/[0.06] bg-black/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Reading Order</p>
                      <span className="pill-tag">Flow</span>
                    </div>
                    <div className="grid gap-2.5">
                      {deckSections.map((section, index) => (
                        <div key={section.label} className="rounded-[18px] border border-white/[0.05] bg-white/[0.025] px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-stone-500">0{index + 1} · {section.label}</p>
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-200/55" />
                          </div>
                          <p className="mt-2 font-cjk text-[0.98rem] text-stone-100">{section.title}</p>
                          <p className="mt-1 text-xs leading-6 text-stone-500">{section.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <InteractiveSurface className="surface-card rounded-[24px] p-5">
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-2">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">How to Read</p>
                          <h3 className="font-cjk text-[1.02rem] font-medium text-stone-100">先看轨道，再沿分支进入细节</h3>
                        </div>
                        <span className="pill-tag">Guide</span>
                      </div>
                      <div className="space-y-3 text-sm leading-7 text-stone-400">
                        <p>先看右侧这 7 天的轨道，判断最近的输入、沉淀与推进落在哪几天。</p>
                        <p>如果想快速进入，日志看过程，知识卡片看结构，项目页看理解是否真的落地。</p>
                      </div>
                    </div>
                  </InteractiveSurface>
                </section>
              </aside>

              <div className="space-y-5">
                <section className="section-shell stagger-surface overflow-hidden rounded-[32px]">
                  <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.9fr)] 2xl:items-stretch">
                    <div className="space-y-5">
                      <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-5 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-2">
                          <p className="section-label">Main Board</p>
                          <h2 className="font-cjk text-[1.45rem] font-medium leading-[1.45] tracking-tight text-stone-100 md:text-[1.8rem]">
                            把最近 7 天放到首页正中央，
                            <br className="hidden md:block" />
                            让节奏与重心先被看见。
                          </h2>
                          <p className="max-w-2xl text-sm leading-8 text-stone-400">
                            先读 top band，再进入 centerpiece。这样首页更像一张被持续使用的桌面，而不是整齐堆叠的内容列表。
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="pill-tag">Top Band</span>
                          <span className="pill-tag">Centerpiece</span>
                          <span className="pill-tag">Lower Modules</span>
                        </div>
                      </div>

                      <TimelinePreview items={timelineItems} />
                    </div>

                    <div className="grid gap-4 content-start xl:grid-rows-[auto_auto_1fr]">
                      <FeaturePanel
                        eyebrow="Current Focus"
                        title="把学习过程变成一个可回看、可复用、可迭代的系统"
                        description="当前更在意结构之间怎么互相支撑：日志保留上下文，笔记收束结构，项目负责把抽象重新压回现实。"
                        href="/about"
                      />

                      <InteractiveSurface className="surface-card rounded-[24px] p-5 md:p-6">
                        <div className="relative space-y-4">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-cjk text-[1.05rem] font-medium text-stone-100">工作台状态</h3>
                            <span className="pill-tag">Live</span>
                          </div>
                          <div className="grid gap-3">
                            {latestLog ? (
                              <Link href={`/logs/${latestLog.slug}`} className="rounded-[18px] border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition hover:-translate-y-0.5 hover:border-white/[0.12]">
                                <p className="text-[11px] uppercase tracking-[0.16em] text-stone-500">Latest log</p>
                                <p className="mt-2 font-cjk text-[1rem] text-stone-100">{latestLog.title}</p>
                                <p className="mt-1 line-clamp-2 text-xs leading-6 text-stone-500">{latestLog.summary}</p>
                              </Link>
                            ) : null}
                            {latestNote ? (
                              <Link href={`/notes/${latestNote.slug}`} className="rounded-[18px] border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition hover:-translate-y-0.5 hover:border-white/[0.12]">
                                <p className="text-[11px] uppercase tracking-[0.16em] text-stone-500">Latest note</p>
                                <p className="mt-2 font-cjk text-[1rem] text-stone-100">{latestNote.title}</p>
                                <p className="mt-1 line-clamp-2 text-xs leading-6 text-stone-500">{latestNote.summary}</p>
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </InteractiveSurface>

                      <InteractiveSurface className="surface-card rounded-[24px] p-5 md:p-6">
                        <div className="relative space-y-4">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-cjk text-[1.05rem] font-medium text-stone-100">这个站点怎么用</h3>
                            <span className="pill-tag">Method</span>
                          </div>
                          <p className="text-sm leading-8 text-stone-400">
                            它不是把内容平铺出来给人“逛”，而是按学习流动来组织：前面记录过程，中间沉淀结构，后面用项目检验理解。
                          </p>
                          <div className="grid gap-2 border-t border-white/[0.06] pt-4 text-sm text-stone-500">
                            <p>01. 最近发生了什么 → 看日志与轨道</p>
                            <p>02. 其中哪些值得留下 → 看知识卡片</p>
                            <p>03. 理解是否站得住 → 看项目实践</p>
                          </div>
                        </div>
                      </InteractiveSurface>
                    </div>
                  </div>
                </section>

                <section className="section-shell stagger-surface rounded-[32px]">
                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1.32fr)_minmax(300px,0.88fr)] xl:items-start 2xl:grid-cols-[minmax(0,1.42fr)_minmax(340px,0.82fr)]">
                    <div className="space-y-5">
                      <SectionHeader title="当前在学" description="最近正在持续推进的主题，不求铺太开，但求稳定往前走。" />
                      <div className="grid gap-4 md:grid-cols-2">
                        {currentLearning.map((item) => (
                          <CurrentLearningCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 content-start">
                      <section className="rounded-[24px] border border-white/[0.06] bg-white/[0.025] p-5">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="section-label">Focus Note</p>
                            <span className="pill-tag">Bridge</span>
                          </div>
                          <h3 className="font-cjk text-[1.08rem] font-medium text-stone-100">让“在学什么”成为主舞台周边的次级模块</h3>
                          <p className="text-sm leading-8 text-stone-400">
                            这里不和 7-day rail 抢中心，而是作为右侧主板下方的延伸：说明近期正在持续投入哪些方向，以及它们和日志、笔记、项目怎样互相支撑。
                          </p>
                        </div>
                      </section>

                      {latestProject ? (
                        <Link href={latestProject.href || `/projects/${latestProject.slug}`} className="group block rounded-[24px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(131,140,194,0.12),rgba(255,255,255,0.02))] p-5 transition hover:-translate-y-0.5 hover:border-white/[0.12]">
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
                </section>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1.42fr)_minmax(360px,0.9fr)] xl:items-start 2xl:grid-cols-[minmax(0,1.5fr)_minmax(390px,0.86fr)]">
                  <section className="section-shell stagger-surface overflow-hidden rounded-[32px]">
                    <SectionHeader title="最近留下的内容" description="最新更新的学习日志，保留过程而不是只展示结论。" actionLabel="查看全部" actionHref="/logs" />
                    <div className="grid gap-4">
                      {featuredLogs.map((item) => (
                        <LogCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>

                  <div className="grid gap-5">
                    <section className="section-shell stagger-surface rounded-[32px]">
                      <SectionHeader title="快速复习入口" description="如果不想从长文开始，可以先看最近整理出来的知识卡片。" actionLabel="进入知识库" actionHref="/notes" />
                      <div className="grid gap-3">
                        {featuredNotes.slice(0, 2).map((item) => (
                          <NoteCard key={item.id} item={item} compact />
                        ))}
                      </div>
                    </section>

                    <section className="section-shell stagger-surface rounded-[32px]">
                      <SectionHeader title="项目 / 实践" description="学习不是收藏信息，而是用真实产出来检验理解。" actionLabel="查看项目" actionHref="/projects" />
                      <div className="grid gap-4">
                        {featuredProjects.map((item) => (
                          <ProjectCard key={item.id} item={item} />
                        ))}
                      </div>
                    </section>
                  </div>
                </section>

                <section className="section-shell stagger-surface rounded-[32px]">
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
