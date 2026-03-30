import type { SearchBoxProps } from '@/types/common';

export function SearchBox({ placeholder = '搜索', value = '', onChange }: SearchBoxProps) {
  return (
    <label className="group block">
      <div className="relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] transition duration-300 group-focus-within:border-[rgba(214,186,152,0.18)] group-focus-within:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 transition group-focus-within:text-stone-300">⌕</div>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm text-stone-200 outline-none placeholder:text-stone-500"
        />
      </div>
    </label>
  );
}
