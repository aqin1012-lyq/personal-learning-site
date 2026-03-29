import Link from 'next/link';
import { SiteContainer } from '@/components/layout/SiteContainer';

export default function NotFound() {
  return (
    <main>
      <SiteContainer className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">页面不存在</h1>
        <p className="max-w-md text-base leading-7 text-stone-600">你访问的内容可能还没写完，或者路径已经变了。</p>
        <Link href="/" className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800">
          返回首页
        </Link>
      </SiteContainer>
    </main>
  );
}
