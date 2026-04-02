import { siteConfig } from '@/data/site';
import { getAllLogs } from '@/lib/content';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { LogsClient } from '@/components/logs/LogsClient';

export default async function LogsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const logs = getAllLogs();
  const resolvedSearchParams = (await searchParams) || {};
  const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '';
  const tag = typeof resolvedSearchParams.tag === 'string' ? resolvedSearchParams.tag : '';
  const type = typeof resolvedSearchParams.type === 'string' ? resolvedSearchParams.type : '';

  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <SiteContainer className="space-y-10 py-12 md:py-16">
          <PageHeader title="学习日志" description="按时间回看学习过程，也按主题整理自己的学习轨迹。" />
          <LogsClient logs={logs} initialQuery={query} initialTag={tag} initialType={type} />
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
