import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/data/site';
import { getAllLogs, getAllNotes } from '@/lib/content';
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
  return getAllLogs().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const logs = getAllLogs();
  const { slug } = await params;
  const log = logs.find((item) => item.slug === slug);
  return {
    title: log ? `${log.title}｜学习日志` : '学习日志',
    description: log?.summary || '学习日志详情页',
  };
}

export default async function LogDetailPage({ params }: PageProps) {
  const logs = getAllLogs();
  const notes = getAllNotes();
  const { slug } = await params;
  const log = logs.find((item) => item.slug === slug);

  if (!log) return notFound();

  const relatedNotes = notes.filter((note) => note.tags.some((tag) => log.tags.includes(tag)));
  const relatedLogs = logs.filter((item) => item.slug !== log.slug && item.tags.some((tag) => log.tags.includes(tag))).slice(0, 2);

  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <SiteContainer className="space-y-10 py-12 md:py-16">
          <ContentHeader title={log.title} summary={log.summary} date={log.date} durationMinutes={log.durationMinutes} tags={log.tags} />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article className="space-y-8">
              <ArticleContent content={log.content} />
              {log.highlights?.length ? <InfoBlock title="今日收获" items={log.highlights} /> : null}
              {log.problems?.length ? <InfoBlock title="遇到的问题" items={log.problems} /> : null}
              {log.nextActions?.length ? <InfoBlock title="下一步计划" items={log.nextActions} /> : null}
            </article>

            <aside className="space-y-6">
              <InteractiveSurface className="surface-card rounded-[24px] p-5 md:p-6">
                <div className="relative space-y-4">
                  <h3 className="text-sm font-semibold text-stone-100">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {log.tags.map((tag) => (
                      <span key={tag} className="pill-tag text-stone-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </InteractiveSurface>
              <RelatedContent notes={relatedNotes.slice(0, 4)} logs={relatedLogs} />
            </aside>
          </div>
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
