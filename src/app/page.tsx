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

            <TimelinePreview items={timelineItems} />

            <section className="section-shell stagger-surface">
              <SectionHeader
                title="这个站点怎么用"
                description="它更像一个持续生长的学习工作台：前面记录过程，中间沉淀结构，后面通过项目检验理解。"
              />
              <div className="grid gap-4 md:grid-cols-3">
                {quickMap.map((item) => (
                  <InteractiveSurface key={item.href} className="surface-card surface-card-hover block rounded-[24px]">
                    <Link href={item.href} className="group block p-5 md:p-6">
                      <div className="relative space-y-4">
                        <span className="pill-tag inline-flex">{item.badge}</span>
                        <div className="space-y-2">
                          <h3 className="font-cjk text-[1.05rem] font-medium text-stone-100">{item.title}</h3>
                          <p className="text-sm leading-8 text-stone-400">{item.description}</p>
                        </div>
                        <div className="border-t border-white/[0.06] pt-3">
                          <p className="text-sm text-stone-500 transition group-hover:text-stone-300">进入看看 →</p>
                        </div>
                      </div>
                    </Link>
                  </InteractiveSurface>
                ))}
              </div>
            </section>

          <section className="section-shell stagger-surface">
            <SectionHeader title="当前在学" description="最近正在持续推进的主题，不求铺太开，但求稳定往前走。" />
            <div className="grid gap-4 xl:grid-cols-[1.55fr_0.95fr]">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                {currentLearning.map((item) => (
                  <CurrentLearningCard key={item.id} item={item} />
                ))}
              </div>
              <FeaturePanel
                eyebrow="Current Focus"
                title="把学习过程变成一个可回看、可复用、可迭代的系统"
                description="当前优化方向不是拼命堆内容，而是把页面结构、内容类型与视觉节奏统一起来，让记录、提炼、复习之间形成自然流动。"
                href="/about"
              />
            </div>
          </section>

          <section className="section-shell stagger-surface overflow-hidden">
            <SectionHeader title="最近留下的内容" description="最新更新的学习日志，保留过程而不是只展示结论。" actionLabel="查看全部" actionHref="/logs" />
            <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
              <div className="grid gap-4">
                {featuredLogs.map((item) => (
                  <LogCard key={item.id} item={item} />
                ))}
              </div>
              <div className="grid gap-4">
                <InteractiveSurface className="surface-card block rounded-[24px]">
                  <div className="relative p-5 md:p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-cjk text-[1.05rem] font-medium text-stone-100">快速复习入口</h3>
                        <span className="pill-tag">Review</span>
                      </div>
                      <p className="text-sm leading-8 text-stone-400">
                        如果不想从长文开始，可以先看最近整理出来的知识卡片，再决定是否回到完整日志查看上下文。
                      </p>
                      <div className="border-t border-white/[0.06] pt-4">
                        <div className="grid gap-3">
                        {featuredNotes.slice(0, 2).map((item) => (
                          <NoteCard key={item.id} item={item} compact />
                        ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </InteractiveSurface>
              </div>
            </div>
          </section>

          <section className="section-shell stagger-surface">
            <SectionHeader title="精选知识卡片" description="这些内容更偏“结构化沉淀”，适合回顾概念、方法和框架。" actionLabel="进入知识库" actionHref="/notes" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredNotes.map((item) => (
                <NoteCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className="section-shell stagger-surface">
            <SectionHeader title="项目 / 实践" description="学习不是收藏信息，而是用真实产出来检验理解。" actionLabel="查看项目" actionHref="/projects" />
            <div className="grid gap-4 md:grid-cols-2">
              {featuredProjects.map((item) => (
                <ProjectCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className="surface-card stagger-surface p-7 md:p-9">
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
          </SiteContainer>
        </HomeMotion>
      </main>
      <Footer />
    </>
  );
}
