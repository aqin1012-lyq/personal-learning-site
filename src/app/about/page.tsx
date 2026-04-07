import { aboutData } from '@/data/about';
import { siteConfig } from '@/data/site';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { InteractiveSurface } from '@/components/common/InteractiveSurface';

export default function AboutPage() {
  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <SiteContainer className="space-y-10 py-12 md:space-y-12 md:py-16">
          <PageHeader title="关于" description="关于这个学习站点为什么存在、我现在在学什么，以及我希望它如何长期生长。" />

          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <article className="section-shell">
              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="section-label">Why this exists</p>
                  <h2 className="font-cjk text-[1.65rem] font-medium leading-[1.45] tracking-tight text-stone-100 md:text-[2rem]">
                    我不想把学习变成一堆散落的收藏，而是希望它们能彼此连接、反复复用、慢慢长成系统。
                  </h2>
                  <p className="max-w-3xl text-[0.98rem] leading-8 text-stone-300">{aboutData.intro}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InteractiveSurface className="surface-card rounded-[24px] p-5 md:p-6">
                    <div className="relative space-y-3">
                      <p className="section-label">Learning focus</p>
                      <h3 className="font-cjk text-[1.05rem] font-medium text-stone-100">当前关注的学习方向</h3>
                      <ul className="space-y-3 text-sm leading-8 text-stone-400">
                        {aboutData.focus.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-200/70" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </InteractiveSurface>

                  <InteractiveSurface className="surface-card rounded-[24px] p-5 md:p-6">
                    <div className="relative space-y-3">
                      <p className="section-label">Working principles</p>
                      <h3 className="font-cjk text-[1.05rem] font-medium text-stone-100">更新原则</h3>
                      <ul className="space-y-3 text-sm leading-8 text-stone-400">
                        {aboutData.principles.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-200/70" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </InteractiveSurface>
                </div>
              </div>
            </article>

            <aside className="grid gap-4">
              <InteractiveSurface as="section" className="surface-card rounded-[24px] p-6 md:p-7">
                <div className="relative space-y-4">
                  <p className="section-label">Site intent</p>
                  <h3 className="font-cjk text-[1.2rem] font-medium leading-8 text-stone-100">{aboutData.siteIntent || '这更像一个长期维护的学习界面，而不是一次性写完的博客首页。'}</h3>
                  <p className="text-sm leading-8 text-stone-400">
                    前面用日志保留过程，中间用知识卡片整理结构，后面用项目验证理解。每个页面都不是孤立的，而是服务于同一个目标：让学习可以被找回、被连接、被继续推进。
                  </p>
                </div>
              </InteractiveSurface>

              <section className="section-shell space-y-5">
                <div className="space-y-3">
                  <p className="section-label">What matters here</p>
                  <h3 className="font-cjk text-[1.15rem] font-medium leading-8 text-stone-100">这个站点更在意三件事</h3>
                </div>
                <div className="grid gap-3">
                  {(aboutData.values || [
                    '记录真实过程，而不只展示漂亮结果',
                    '把重复出现的理解沉淀成可复用结构',
                    '让内容之间能互相指向，而不是各写各的',
                  ]).map((item) => (
                    <InteractiveSurface key={item} className="rounded-[20px] border border-white/[0.08] bg-[rgba(244,239,255,0.035)] px-4 py-4 text-sm leading-7 text-stone-300">
                      {item}
                    </InteractiveSurface>
                  ))}
                </div>
              </section>
            </aside>
          </section>
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
