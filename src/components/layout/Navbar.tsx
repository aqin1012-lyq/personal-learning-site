'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { NavItem } from '@/types/common';
import { cn } from '@/lib/utils';
import { SiteContainer } from './SiteContainer';

export function Navbar({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0b0c11]/72 backdrop-blur-2xl">
      <SiteContainer className="flex h-18 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-stone-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(111,90,247,0.18)]">
            ✦
          </span>
          <span>
            <span className="block text-base font-semibold tracking-tight">学习记录站</span>
            <span className="block text-xs text-stone-500">Notes · Logs · Practice</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-4 py-2 text-sm transition-all duration-300',
                  active
                    ? 'border border-white/10 bg-white/[0.08] text-white shadow-[0_0_0_1px_rgba(111,90,247,0.16)_inset,0_10px_30px_rgba(0,0,0,0.14)]'
                    : 'text-stone-400 hover:bg-white/5 hover:text-stone-100'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          菜单
        </button>
      </SiteContainer>

      {open ? (
        <div className="border-t border-white/[0.08] bg-[#101117]/98 md:hidden">
          <SiteContainer className="flex flex-col gap-1 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm text-stone-300 hover:bg-white/5 hover:text-stone-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </SiteContainer>
        </div>
      ) : null}
    </header>
  );
}
