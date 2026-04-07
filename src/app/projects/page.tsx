import { siteConfig } from '@/data/site';
import { getAllProjects } from '@/lib/content';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { EmptyState } from '@/components/common/EmptyState';

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <SiteContainer className="space-y-10 py-12 md:py-16">
          <PageHeader title="项目 / 实践" description="学习不只停留在输入，也会变成项目、实验和可见的输出。" />
          <section>
            {projects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((item) => (
                  <ProjectCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="这里还没有项目实践"
                description="项目页不是为了堆成果，而是用来证明你真的把一些学习内容落到了真实输出里。先从一个小项目开始就够。"
                label="Start Your First Project"
                action={siteConfig.emptyStateCta}
              />
            )}
          </section>
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
