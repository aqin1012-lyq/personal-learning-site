import Link from 'next/link';
import { InteractiveSurface } from '@/components/common/InteractiveSurface';

export function FeaturePanel({
  eyebrow,
  title,
  description,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <InteractiveSurface className="surface-card surface-card-hover reveal-surface block rounded-[24px]">
      <Link href={href} className="block p-6 md:p-7">
        <div className="relative flex h-full flex-col justify-between gap-6">
        <div className="space-y-3">
          <p className="section-label">{eyebrow}</p>
          <h3 className="font-cjk text-[1.2rem] font-medium leading-8 text-stone-100">{title}</h3>
          <p className="text-sm leading-8 text-stone-400">{description}</p>
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
          <span className="text-sm text-stone-300">继续阅读</span>
          <span className="pill-tag">About</span>
        </div>
        </div>
      </Link>
    </InteractiveSurface>
  );
}
