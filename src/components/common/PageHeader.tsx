import type { PageHeaderProps } from '@/types/common';

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="max-w-3xl space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight text-stone-100 md:text-4xl">{title}</h1>
      {description ? <p className="text-base leading-7 text-stone-400">{description}</p> : null}
    </div>
  );
}
