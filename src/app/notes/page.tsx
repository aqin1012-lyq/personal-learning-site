import { siteConfig } from '@/data/site';
import { getAllNotes } from '@/lib/content';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { NotesClient } from '@/components/notes/NotesClient';

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const notes = getAllNotes();
  const resolvedSearchParams = (await searchParams) || {};
  const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '';
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : '';
  const tag = typeof resolvedSearchParams.tag === 'string' ? resolvedSearchParams.tag : '';

  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <SiteContainer className="space-y-10 py-12 md:py-16">
          <PageHeader title="知识库" description="把零散学习内容整理成可以复用、回看和连接的知识条目。" />
          <NotesClient notes={notes} initialQuery={query} initialCategory={category} initialTag={tag} />
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
