import { cn } from '@/lib/utils';
import type { CategoryFilterProps } from '@/types/common';

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={cn(
          'rounded-full border px-3 py-1.5 text-sm transition',
          !activeCategory
            ? 'border-[rgba(157,139,242,0.26)] bg-[rgba(136,117,216,0.14)] text-stone-100'
            : 'border-white/[0.08] bg-white/[0.04] text-stone-400 hover:bg-white/[0.06]'
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
              ? 'border-[rgba(157,139,242,0.26)] bg-[rgba(136,117,216,0.14)] text-stone-100'
              : 'border-white/[0.08] bg-white/[0.04] text-stone-400 hover:bg-white/[0.06]'
          )}
          onClick={() => onCategoryChange?.(activeCategory === category ? '' : category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
