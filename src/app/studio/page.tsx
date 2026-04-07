import { siteConfig } from '@/data/site';
import { currentLearning } from '@/data/current-learning';
import { getAllNotes } from '@/lib/content';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { InteractiveSurface } from '@/components/common/InteractiveSurface';
import { StudioClient } from '@/components/studio/StudioClient';

export default function StudioPage() {
  const notes = getAllNotes();

  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <SiteContainer className="space-y-10 py-12 md:py-16">
          <PageHeader title="Studio" description="把这个项目当成模板来用时，这里就是你的起步台：先看怎么改站点，再写第一条内容。" />

          <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
            <InteractiveSurface className="surface-card rounded-[24px] p-6 md:p-7">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="section-label">Template Onboarding</p>
                  <h2 className="font-cjk text-[1.18rem] font-medium leading-8 text-stone-100">这不是普通博客模板，而是一套个人学习系统模板。</h2>
                  <p className="text-sm leading-8 text-stone-400">推荐先把站点基础信息换成你自己的，再开始添加第一条日志、第一张知识卡片和第一个项目。这样首页结构会更快“活起来”。</p>
                </div>
                <div className="grid gap-3">
                  {siteConfig.setupSteps?.map((step, index) => (
                    <div key={step} className="rounded-[18px] border border-white/[0.06] bg-white/[0.018] px-4 py-3.5">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-stone-500">Step 0{index + 1}</p>
                      <p className="mt-1 text-sm leading-7 text-stone-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </InteractiveSurface>

            <section className="section-shell space-y-5">
              <div className="space-y-2">
                <p className="section-label">What this template is for</p>
                <h2 className="font-cjk text-[1.1rem] font-medium text-stone-100">适合谁？</h2>
                <p className="text-sm leading-8 text-stone-400">{siteConfig.audience}</p>
              </div>
              <div className="grid gap-3">
                {[
                  'Logs：记录今天在学什么、卡在哪里、下一步做什么。',
                  'Notes：把会反复用到的理解整理成知识卡片。',
                  'Projects：用真实输出验证你是不是真的学会了。',
                ].map((item) => (
                  <InteractiveSurface key={item} className="rounded-[18px] border border-white/[0.08] bg-[rgba(244,239,255,0.03)] px-4 py-4 text-sm leading-7 text-stone-300">
                    {item}
                  </InteractiveSurface>
                ))}
              </div>
            </section>
          </section>

          <StudioClient notes={notes} currentLearning={currentLearning} />
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
