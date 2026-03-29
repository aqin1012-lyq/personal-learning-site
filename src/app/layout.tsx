import type { Metadata } from 'next';
import { Noto_Sans_SC, Noto_Serif_SC, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/data/site';

const notoSansSc = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-display-latin',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const notoSerifSc = Noto_Serif_SC({
  subsets: ['latin'],
  variable: '--font-display-cjk',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s｜${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${notoSansSc.variable} ${sourceSerif.variable} ${notoSerifSc.variable}`}>
      <body>{children}</body>
    </html>
  );
}
