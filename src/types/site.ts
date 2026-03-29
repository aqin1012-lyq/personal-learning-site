import type { NavItem } from './common';

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  siteUrl: string;
  locale: string;
  author: string;
  keywords: string[];
  nav: NavItem[];
};
