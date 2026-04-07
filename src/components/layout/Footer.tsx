import Link from 'next/link';
import { SiteContainer } from './SiteContainer';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/[0.07] bg-[#0d1014]/72 backdrop-blur-xl">
      <SiteContainer className="grid gap-8 py-10 text-sm text-stone-500 md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <div className="space-y-3">
          <p className="text-base text-stone-300">这是一个个人学习系统模板，用来把学习过程、知识沉淀和项目实践串成一个长期可复用的成长界面。</p>
          <p className="max-w-2xl leading-7 text-stone-500">
            你可以把它当成自己的公开学习主页，也可以把它当成一个长期维护的知识基础设施模板，从第一条日志开始慢慢长起来。
          </p>
        </div>
        <div className="grid gap-3 md:justify-end">
          <Link href="/about" className="hover:text-violet-200/90">
            关于
          </Link>
          <Link href="/logs" className="hover:text-violet-200/90">
            学习日志
          </Link>
          <Link href="/notes" className="hover:text-violet-200/90">
            知识库
          </Link>
          <Link href="/projects" className="hover:text-violet-200/90">
            项目实践
          </Link>
          <Link href="/studio" className="hover:text-violet-200/90">
            Studio
          </Link>
        </div>
      </SiteContainer>
    </footer>
  );
}
