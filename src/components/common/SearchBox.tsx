import type { SearchBoxProps } from '@/types/common';

export function SearchBox({ placeholder = '搜索', value = '', onChange }: SearchBoxProps) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full rounded-xl border border-white/[0.08] bg-white/5 px-4 py-3 text-sm text-stone-200 outline-none placeholder:text-stone-500 focus:border-white/[0.12] focus:bg-white/[0.07]"
    />
  );
}
