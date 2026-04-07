import type { NavItem } from './common';

export type SiteAction = {
  label: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  siteUrl: string;
  locale: string;
  author: string;
  keywords: string[];
  nav: NavItem[];
  productTagline?: string;
  audience?: string;
  setupSteps?: string[];
  emptyStateCta?: SiteAction;
  studioCta?: SiteAction;
};
