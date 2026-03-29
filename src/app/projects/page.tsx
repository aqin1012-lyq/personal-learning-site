import { siteConfig } from '@/data/site';
import { getAllProjects } from '@/lib/content';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ProjectCard } from '@/components/projects/ProjectCard';

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <>
      <Navbar nav={siteConfig.nav} />
      <main>
        <SiteContainer className="space-y-10 py-12 md:py-16">
          <PageHeader title="项目 / 实践" description="学习不只停留在输入，也会变成项目、实验和可见的输出。" />
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((item) => (
              <ProjectCard key={item.id} item={item} />
            ))}
          </section>
        </SiteContainer>
      </main>
      <Footer />
    </>
  );
}
