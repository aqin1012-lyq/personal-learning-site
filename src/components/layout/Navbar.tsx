'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { NavItem } from '@/types/common';
import { cn } from '@/lib/utils';
import { SiteContainer } from './SiteContainer';

export function Navbar({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300',
        scrolled
          ? 'border-white/[0.08] bg-[#120f0d]/92 shadow-[0_16px_40px_rgba(0,0,0,0.22)]'
          : 'border-white/[0.06] bg-[#120f0d]/82'
      )}
    >
      <SiteContainer className="flex h-18 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-stone-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-stone-300">
            ✦
          </span>
          <span>
            <span className="block font-cjk text-[1.02rem] font-medium tracking-[0.01em]">学习记录站</span>
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
                    ? 'border border-white/10 bg-white/[0.06] text-stone-100'
                    : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-stone-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          菜单
        </button>
      </SiteContainer>

      {open ? (
        <div className="border-t border-white/[0.08] bg-[#151210]/98 md:hidden">
          <SiteContainer className="flex flex-col gap-1 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm text-stone-300 hover:bg-white/[0.04] hover:text-stone-100"
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
