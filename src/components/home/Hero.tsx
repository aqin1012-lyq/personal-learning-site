'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type HeroStat = {
  label: string;
  value: string;
  note: string;
};

export function Hero({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  stats,
}: {
  title: string;
  subtitle: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  stats: HeroStat[];
}) {
  const [pointer, setPointer] = useState({ x: 50, y: 24 });

  const titleParts = title.split('，');
  const hasAccentLine = titleParts.length > 1;
  const titleLead = hasAccentLine ? titleParts[0] : title;
  const titleAccent = hasAccentLine ? titleParts.slice(1).join('，') : '';

  const spotlight = useMemo(
    () => ({
      background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(129, 140, 248, 0.24), transparent 22%), radial-gradient(circle at 78% 18%, rgba(56, 189, 248, 0.11), transparent 16%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))`,
    }),
    [pointer]
  );

  return (
    <section
      className="surface-card group isolate overflow-hidden rounded-[40px] px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setPointer({ x, y });
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-90 transition duration-500" style={spotlight} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-violet-500/18 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.18fr)_360px] lg:items-end">
        <div className="max-w-4xl space-y-8 md:space-y-10">
          <div className="space-y-6 md:space-y-7">
            <div className="hero-kicker">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.8)]" />
              <span>Personal Learning System</span>
            </div>

            <div className="max-w-3xl space-y-4 md:space-y-5">
              <p className="max-w-xl text-sm uppercase tracking-[0.18em] text-stone-400/88 md:text-[0.82rem]">
                不是追热点的展示页，而是一套长期更新、持续拆解、逐步沉淀的学习现场。
              </p>

              <h1 className="hero-title max-w-5xl">
                <span className={hasAccentLine ? 'hero-title-muted' : undefined}>{titleLead}</span>
                {hasAccentLine ? <span className="hero-title-accent text-gradient">，{titleAccent}</span> : null}
              </h1>

              <p className="hero-subtitle">{subtitle}</p>
            </div>

            <div className="hero-quote-shell">
              <div className="relative grid gap-4 md:grid-cols-[auto_1fr] md:gap-5">
                <div className="hero-quote-mark">“</div>
                <div className="space-y-4 pt-1">
                  <p className="hero-quote-text">
                    Reading maketh a full man; conference a ready man; and writing an exact man.
                  </p>
                  <p className="hero-quote-author">— Francis Bacon</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1 md:pt-2">
            <Link
              href={primaryAction.href}
              className="inline-flex items-center rounded-2xl bg-[#6f5af7] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_40px_rgba(111,90,247,0.35)] hover:-translate-y-0.5 hover:bg-[#7a66fb]"
            >
              {primaryAction.label}
            </Link>
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-stone-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 self-stretch">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="surface-card surface-card-hover animate-float-gentle p-4"
              style={{ animationDelay: `${index * 0.8}s` }}
            >
              <div className="relative space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{stat.label}</p>
                <div className="flex items-end justify-between gap-4">
                  <p className="text-3xl font-semibold tracking-tight text-stone-100">{stat.value}</p>
                  <p className="text-right text-xs leading-5 text-stone-400">{stat.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
