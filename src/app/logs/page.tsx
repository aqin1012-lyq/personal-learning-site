import { siteConfig } from '@/data/site';
import { getAllLogs } from '@/lib/content';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { LogsClient } from '@/components/logs/LogsClient';

export default function LogsPage() {
  const logs = getAllLogs();

  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <SiteContainer className="space-y-10 py-12 md:py-16">
          <PageHeader title="学习日志" description="按时间回看学习过程，也按主题整理自己的学习轨迹。" />
          <LogsClient logs={logs} />
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
