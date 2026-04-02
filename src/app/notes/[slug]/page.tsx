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
  return {
    title: note ? `${note.title}｜知识笔记` : '知识笔记',
    description: note?.summary || '知识笔记详情页',
  };
}

export default async function NoteDetailPage({ params }: PageProps) {
  const notes = getAllNotes();
  const logs = getAllLogs();
  const { slug } = await params;
  const note = notes.find((item) => item.slug === slug);
  if (!note) return notFound();

  const relatedLogs = logs.filter((log) => log.tags.some((tag) => note.tags.includes(tag))).slice(0, 3);

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
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
