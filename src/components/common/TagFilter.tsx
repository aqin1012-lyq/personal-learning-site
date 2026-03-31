import type { TagFilterProps } from '@/types/common';
import { cn } from '@/lib/utils';

export function TagFilter({ tags, activeTag, onTagChange }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={cn(
          'rounded-full border px-3 py-1.5 text-sm transition',
          !activeTag
            ? 'border-[rgba(157,139,242,0.26)] bg-[rgba(136,117,216,0.14)] text-stone-100'
            : 'border-white/[0.08] bg-white/[0.04] text-stone-400 hover:bg-white/[0.06]'
        )}
        onClick={() => onTagChange?.('')}
      >
        全部标签
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm transition',
            activeTag === tag
              ? 'border-[rgba(157,139,242,0.26)] bg-[rgba(136,117,216,0.14)] text-stone-100'
              : 'border-white/[0.08] bg-white/[0.04] text-stone-400 hover:bg-white/[0.06]'
          )}
          onClick={() => onTagChange?.(activeTag === tag ? '' : tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
