import { cn } from '@/lib/utils';

export function TypeFilter({
  types,
  activeType,
  onTypeChange,
}: {
  types: string[];
  activeType?: string;
  onTypeChange?: (type: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={cn(
          'rounded-full border px-3 py-1.5 text-sm transition',
          !activeType
            ? 'border-[rgba(157,139,242,0.26)] bg-[rgba(136,117,216,0.14)] text-stone-100'
            : 'border-white/[0.08] bg-white/[0.04] text-stone-400 hover:bg-white/[0.06]'
        )}
        onClick={() => onTypeChange?.('')}
      >
        全部类型
      </button>
      {types.map((type) => (
        <button
          key={type}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm capitalize transition',
            activeType === type
              ? 'border-[rgba(157,139,242,0.26)] bg-[rgba(136,117,216,0.14)] text-stone-100'
              : 'border-white/[0.08] bg-white/[0.04] text-stone-400 hover:bg-white/[0.06]'
          )}
          onClick={() => onTypeChange?.(activeType === type ? '' : type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
