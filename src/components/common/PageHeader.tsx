import type { PageHeaderProps } from '@/types/common';

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="section-shell overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(182,170,218,0.22)] to-transparent" />
      <div className="pointer-events-none absolute -right-12 top-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(161,147,199,0.16),transparent_68%)] blur-3xl" />

      <div className="relative max-w-4xl space-y-5">
        <p className="section-label">Content Archive</p>
        <div className="space-y-3">
          <h1 className="font-cjk text-[2.2rem] font-medium leading-[1.25] tracking-[-0.025em] text-stone-100 md:text-[3rem]">
            {title}
          </h1>
          {description ? <p className="max-w-3xl text-[0.98rem] leading-8 text-stone-400 md:text-[1.03rem]">{description}</p> : null}
        </div>
      </div>
    </section>
  );
}
