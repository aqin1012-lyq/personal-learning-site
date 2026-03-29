'use client';

import Link from 'next/link';

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
  const titleParts = title.split('，');
  const hasAccentLine = titleParts.length > 1;
  const titleLead = hasAccentLine ? titleParts[0] : title;
  const titleAccent = hasAccentLine ? titleParts.slice(1).join('，') : '';

  return (
    <section className="surface-card overflow-hidden rounded-[30px] px-6 py-8 md:px-9 md:py-11 lg:px-12 lg:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute right-8 top-8 h-24 w-24 rounded-full border border-amber-100/10 bg-[radial-gradient(circle,rgba(193,160,124,0.12),transparent_68%)] opacity-80 blur-2xl" />

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:items-end lg:gap-12">
        <div className="max-w-4xl space-y-8 md:space-y-9">
          <div className="space-y-6 md:space-y-7">
            <div className="hero-kicker">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-200/70" />
              <span>Personal Learning System</span>
            </div>

            <div className="max-w-3xl space-y-4 md:space-y-5">
              <p className="max-w-xl text-[0.76rem] uppercase tracking-[0.22em] text-stone-500 md:text-[0.8rem]">
                不是追热点的展示页，而是一套长期更新、持续拆解、逐步沉淀的学习现场。
              </p>

              <h1 className="hero-title">
                <span className={hasAccentLine ? 'hero-title-muted' : undefined}>{titleLead}</span>
                {hasAccentLine ? <span className="hero-title-accent">，{titleAccent}</span> : null}
              </h1>

              <p className="hero-subtitle">{subtitle}</p>
            </div>

            <div className="hero-quote-shell">
              <div className="relative grid gap-3 md:grid-cols-[auto_1fr] md:gap-5">
                <div className="hero-quote-mark">“</div>
                <div className="space-y-3 pt-1">
                  <p className="hero-quote-text">
                    Reading maketh a full man; conference a ready man; and writing an exact man.
                  </p>
                  <p className="hero-quote-author">— Francis Bacon</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href={primaryAction.href} className="hero-button-primary">
              {primaryAction.label}
            </Link>
            {secondaryAction ? (
              <Link href={secondaryAction.href} className="hero-button-secondary">
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 self-stretch md:grid-cols-3 lg:grid-cols-1">
          {stats.map((stat) => (
            <div key={stat.label} className="hero-stat-card">
              <div className="space-y-2.5">
                <p className="section-label">{stat.label}</p>
                <div className="space-y-2">
                  <p className="font-display text-[2rem] leading-none text-stone-100">{stat.value}</p>
                  <p className="text-xs leading-6 text-stone-400">{stat.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
