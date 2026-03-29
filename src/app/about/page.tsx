import { aboutData } from '@/data/about';
import { siteConfig } from '@/data/site';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { PageHeader } from '@/components/common/PageHeader';

export default function AboutPage() {
  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <SiteContainer className="space-y-10 py-12 md:py-16">
          <PageHeader title="关于" description="关于我、我在学什么，以及为什么做这个网站。" />

          <section className="max-w-3xl space-y-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">我为什么做这个网站</h2>
              <p className="text-base leading-7 text-stone-700">{aboutData.intro}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">当前关注的学习方向</h2>
              <ul className="list-disc space-y-2 pl-5 text-stone-700">
                {aboutData.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">更新原则</h2>
              <ul className="list-disc space-y-2 pl-5 text-stone-700">
                {aboutData.principles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
