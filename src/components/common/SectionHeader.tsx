import Link from 'next/link';
import type { SectionHeaderProps } from '@/types/common';

export function SectionHeader({ title, description, actionLabel, actionHref }: SectionHeaderProps) {
  return (
    <div className="reveal-surface flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        <div className="h-px w-14 bg-gradient-to-r from-[rgba(136,117,216,0.82)] to-transparent" />
        <h2 className="font-cjk text-[1.55rem] font-medium leading-[1.4] tracking-tight text-stone-100 md:text-[1.9rem]">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-8 text-stone-400">{description}</p> : null}
      </div>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="refined-link">
          <span>{actionLabel}</span>
          <span aria-hidden>→</span>
        </Link>
      ) : null}
    </div>
  );
}
