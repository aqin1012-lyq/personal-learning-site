import { cn } from '@/lib/utils';
import type { CategoryFilterProps } from '@/types/common';

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={cn(
          'rounded-full border px-3 py-1.5 text-sm transition',
          !activeCategory
            ? 'border-[rgba(186,149,110,0.28)] bg-[rgba(186,149,110,0.18)] text-stone-100'
            : 'border-white/[0.08] bg-white/5 text-stone-400 hover:bg-white/[0.08]'
        )}
        onClick={() => onCategoryChange?.('')}
      >
        全部分类
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm transition',
            activeCategory === category
              ? 'border-[rgba(186,149,110,0.28)] bg-[rgba(186,149,110,0.18)] text-stone-100'
              : 'border-white/[0.08] bg-white/5 text-stone-400 hover:bg-white/[0.08]'
          )}
          onClick={() => onCategoryChange?.(activeCategory === category ? '' : category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
