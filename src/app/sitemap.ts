import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';
import { getAllLogs, getAllNotes, getAllProjects } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.siteUrl}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.siteUrl}/logs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteConfig.siteUrl}/notes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteConfig.siteUrl}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteConfig.siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const logRoutes: MetadataRoute.Sitemap = getAllLogs().map((item) => ({
    url: `${siteConfig.siteUrl}/logs/${item.slug}`,
    lastModified: item.date ? new Date(item.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const noteRoutes: MetadataRoute.Sitemap = getAllNotes().map((item) => ({
    url: `${siteConfig.siteUrl}/notes/${item.slug}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map((item) => ({
    url: `${siteConfig.siteUrl}/projects/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...logRoutes, ...noteRoutes, ...projectRoutes];
}
