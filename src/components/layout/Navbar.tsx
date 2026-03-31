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
          ? 'border-white/[0.08] bg-[#101318]/88 shadow-[0_16px_40px_rgba(0,0,0,0.28)]'
          : 'border-white/[0.05] bg-[#101318]/74',
      )}
    >
      <SiteContainer className="flex h-18 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-stone-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-violet-200/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
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
                  'rounded-full border px-4 py-2 text-sm transition-all duration-300',
                  active
                    ? 'border-[rgba(157,139,242,0.24)] bg-[rgba(136,117,216,0.13)] text-stone-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    : 'border-transparent text-stone-400 hover:border-white/[0.06] hover:bg-white/[0.03] hover:text-stone-200',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-sm text-stone-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          菜单
        </button>
      </SiteContainer>

      {open ? (
        <div className="border-t border-white/[0.08] bg-[#0f1318]/96 md:hidden">
          <SiteContainer className="flex flex-col gap-1 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-transparent px-3 py-2 text-sm text-stone-300 hover:border-white/[0.05] hover:bg-white/[0.03] hover:text-stone-100"
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
