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
import { InteractiveSurface } from '@/components/common/InteractiveSurface';

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
  const title = project ? `${project.title}｜项目实践` : '项目实践';
  const description = project?.summary || '项目详情页';
  const url = `${siteConfig.siteUrl}/projects/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
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
              <InteractiveSurface className="surface-card rounded-[24px] p-5 md:p-6">
                <div className="relative space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-stone-100">项目状态</h3>
                    <p className="mt-2 text-sm text-stone-400">{project.status}</p>
                  </div>
                  {project.period ? (
                    <div className="border-t border-white/[0.06] pt-4">
                      <h3 className="text-sm font-semibold text-stone-100">项目周期</h3>
                      <p className="mt-2 text-sm text-stone-400">{project.period}</p>
                    </div>
                  ) : null}
                </div>
              </InteractiveSurface>
              <RelatedContent logs={relatedLogs} />
            </aside>
          </div>
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
