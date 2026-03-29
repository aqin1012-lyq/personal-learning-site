import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/data/site';
import { getAllLogs, getAllNotes } from '@/lib/content';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { ContentHeader } from '@/components/logs/ContentHeader';
import { RelatedContent } from '@/components/logs/RelatedContent';

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
            <article className="rounded-3xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)] md:p-8">
              <div className="space-y-8 prose-custom max-w-none">
                <div>
                  <h2>核心定义</h2>
                  <p>{note.summary}</p>
                </div>
                <div>
                  <h2>关键要点</h2>
                  <ul>
                    <li>先用一句话定义这个概念，再拆成几个关键判断点。</li>
                    <li>条目要足够短，方便快速回看，也方便长期增量修改。</li>
                    <li>真正有价值的不是摘抄，而是把它和自己的学习过程连起来。</li>
                  </ul>
                </div>
                <div>
                  <h2>我的理解</h2>
                  <p>知识条目应该像“被自己真正理解过的卡片”，而不是资料仓库。只要定义、要点和关联足够清楚，这个页面就会长期有用。</p>
                </div>
                <div>
                  <h2>进一步整理</h2>
                  <p>后续适合接入 MDX，让每条知识卡都能逐渐长成更完整的专题结构，同时保留现在这种简洁、可读、可维护的页面形态。</p>
                </div>
              </div>
            </article>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <h3 className="text-sm font-semibold text-stone-100">分类</h3>
                <p className="mt-3 text-sm text-stone-400">{note.category}</p>
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
