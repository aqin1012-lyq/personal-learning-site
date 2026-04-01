import { siteConfig } from '@/data/site';
import { currentLearning } from '@/data/current-learning';
import { getAllNotes } from '@/lib/content';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { StudioClient } from '@/components/studio/StudioClient';

export default function StudioPage() {
  const notes = getAllNotes();

  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <SiteContainer className="space-y-10 py-12 md:py-16">
          <PageHeader title="Studio" description="直接在页面里新增知识库文档，并编辑首页当前在学模块。" />
          <StudioClient notes={notes} currentLearning={currentLearning} />
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
