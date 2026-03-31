import Link from 'next/link';
import { SiteContainer } from './SiteContainer';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/[0.08] bg-[#0b0b13]/72 backdrop-blur-xl">
      <SiteContainer className="grid gap-8 py-10 text-sm text-stone-500 md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <div className="space-y-3">
          <p className="text-base text-stone-300">这是我的个人学习记录站，记录输入、实践、复盘，也记录那些慢慢成形的理解。</p>
          <p className="max-w-2xl leading-7 text-stone-500">
            希望这里不是一堆被遗忘的草稿，而是一套越用越顺手、越写越清晰的长期知识基础设施。
          </p>
        </div>
        <div className="grid gap-3 md:justify-end">
          <Link href="/about" className="hover:text-violet-100">
            关于
          </Link>
          <Link href="/logs" className="hover:text-violet-100">
            学习日志
          </Link>
          <Link href="/notes" className="hover:text-violet-100">
            知识库
          </Link>
          <Link href="/projects" className="hover:text-violet-100">
            项目实践
          </Link>
        </div>
      </SiteContainer>
    </footer>
  );
}
