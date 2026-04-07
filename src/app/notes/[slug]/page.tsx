import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/data/site';
import { getAllLogs, getAllNotes } from '@/lib/content';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { ContentHeader } from '@/components/logs/ContentHeader';
import { ArticleContent } from '@/components/logs/ArticleContent';
import { RelatedContent } from '@/components/logs/RelatedContent';
import { InteractiveSurface } from '@/components/common/InteractiveSurface';
import { ContinueReadingSection } from '@/components/common/ContinueReadingSection';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllNotes().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const notes = getAllNotes();
  const { slug } = await params;
  const note = notes.find((item) => item.slug === slug);
  const title = note ? `${note.title}｜知识笔记` : '知识笔记';
  const description = note?.summary || '知识笔记详情页';
  const url = `${siteConfig.siteUrl}/notes/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/notes/${slug}`,
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

export default async function NoteDetailPage({ params }: PageProps) {
  const notes = getAllNotes();
  const logs = getAllLogs();
  const { slug } = await params;
  const note = notes.find((item) => item.slug === slug);
  if (!note) return notFound();

  const relatedLogs = logs.filter((log) => log.tags.some((tag) => note.tags.includes(tag))).slice(0, 3);
  const moreNotes = notes.filter((item) => item.slug !== note.slug && (item.category === note.category || item.tags.some((tag) => note.tags.includes(tag)))).slice(0, 3);

  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <SiteContainer className="space-y-10 py-12 md:py-16">
          <ContentHeader title={note.title} summary={note.summary} date={note.updatedAt} tags={note.tags} />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article>
              <ArticleContent content={note.content || `## 核心定义\n\n${note.summary}`} />
            </article>

            <aside className="space-y-6">
              <InteractiveSurface className="surface-card rounded-[24px] p-5 md:p-6">
                <div className="relative space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-stone-100">分类</h3>
                    <Link
                      href={`/notes?category=${encodeURIComponent(note.category)}`}
                      className="inline-flex rounded-full border border-[rgba(122,174,203,0.18)] bg-[rgba(122,174,203,0.08)] px-3 py-1.5 text-sm text-[rgba(201,223,235,0.92)] transition hover:bg-[rgba(122,174,203,0.14)]"
                    >
                      {note.category}
                    </Link>
                  </div>

                  {note.tags.length > 0 ? (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-stone-100">关联标签</h3>
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/notes?tag=${encodeURIComponent(tag)}`}
                            className="pill-tag text-stone-300 transition hover:text-stone-100"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <Link
                    href={`/notes?category=${encodeURIComponent(note.category)}`}
                    className="inline-flex items-center text-sm text-stone-400 transition hover:text-stone-200"
                  >
                    返回同分类知识条目 →
                  </Link>
                </div>
              </InteractiveSurface>
              <RelatedContent logs={relatedLogs} />
            </aside>
          </div>

          <ContinueReadingSection
            title="继续沿这个主题往下看"
            description="看完这篇之后，可以回到相关知识条目或学习日志，继续把上下文串起来。"
            notes={moreNotes}
            logs={relatedLogs}
          />
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
