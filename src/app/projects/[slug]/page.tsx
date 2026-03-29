import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/data/site';
import { getAllLogs, getAllProjects } from '@/lib/content';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { ContentHeader } from '@/components/logs/ContentHeader';
import { ArticleContent } from '@/components/logs/ArticleContent';
import { InfoBlock } from '@/components/logs/InfoBlock';
import { RelatedContent } from '@/components/logs/RelatedContent';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjects().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const projects = getAllProjects();
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return {
    title: project ? `${project.title}｜项目实践` : '项目实践',
    description: project?.summary || '项目详情页',
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const projects = getAllProjects();
  const logs = getAllLogs();
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return notFound();

  const relatedLogs = logs.filter((log) => log.tags.some((tag) => project.tags.includes(tag))).slice(0, 3);

  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <SiteContainer className="space-y-10 py-12 md:py-16">
          <ContentHeader title={project.title} summary={project.summary} tags={project.tags} />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article className="space-y-8">
              <ArticleContent content={project.content || '## 项目说明\n\n暂无更多内容。'} />
              {project.outcomes?.length ? <InfoBlock title="项目成果" items={project.outcomes} /> : null}
              {project.lessons?.length ? <InfoBlock title="复盘与收获" items={project.lessons} /> : null}
              {project.nextSteps?.length ? <InfoBlock title="下一步计划" items={project.nextSteps} /> : null}
            </article>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <h3 className="text-sm font-semibold text-stone-100">项目状态</h3>
                <p className="mt-3 text-sm text-stone-400">{project.status}</p>
                {project.period ? (
                  <>
                    <h3 className="mt-5 text-sm font-semibold text-stone-100">项目周期</h3>
                    <p className="mt-3 text-sm text-stone-400">{project.period}</p>
                  </>
                ) : null}
              </div>
              <RelatedContent logs={relatedLogs} />
            </aside>
          </div>
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
