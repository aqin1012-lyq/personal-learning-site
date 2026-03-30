import { InteractiveSurface } from '@/components/common/InteractiveSurface';

export function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <InteractiveSurface as="section" className="surface-card reveal-surface rounded-[24px] p-6 md:p-7">
      <div className="relative space-y-4">
        <h2 className="font-cjk text-[1.2rem] font-medium tracking-tight text-stone-100">{title}</h2>
        <ul className="space-y-3 text-[0.98rem] leading-8 text-stone-300">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-[0.78rem] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200/70" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </InteractiveSurface>
  );
}
