import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { LogItem } from '@/types/log';
import type { NoteItem } from '@/types/note';
import type { ProjectItem } from '@/types/project';

type Frontmatter = Record<string, unknown>;

type ContentKind = 'log' | 'note' | 'project';

function readArray(value: unknown) {
  if (!Array.isArray(value)) return [] as string[];
  return value.map((item) => String(item)).filter(Boolean);
}

function readString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function readNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' ? value : fallback;
}

function readBoolean(value: unknown) {
  return Boolean(value);
}

function ensureRequiredFields(kind: ContentKind, slug: string, frontmatter: Frontmatter, fields: string[]) {
  const missing = fields.filter((field) => {
    const value = frontmatter[field];
    return value === undefined || value === null || String(value).trim() === '';
  });

  if (missing.length > 0) {
    throw new Error(`[content:${kind}] ${slug}.mdx 缺少必填字段: ${missing.join(', ')}`);
  }
}

function ensureDateFormat(label: string, value: string, slug: string) {
  if (!value) return;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`[content] ${slug}.mdx 的 ${label} 必须是 YYYY-MM-DD 格式，当前是: ${value}`);
  }
}

function readCollection<T>(dirName: string, mapper: (slug: string, frontmatter: Frontmatter, content: string) => T): T[] {
  const dir = path.join(process.cwd(), 'content', dirName);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((file) => file.endsWith('.mdx')) : [];

  return files.map((file) => {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx$/, '');
    return mapper(slug, data as Frontmatter, content.trim());
  });
}

export function getAllLogs(): LogItem[] {
  return readCollection<LogItem>('logs', (slug, frontmatter, content) => {
    ensureRequiredFields('log', slug, frontmatter, ['title', 'date', 'summary', 'type']);
    const date = readString(frontmatter.date);
    ensureDateFormat('date', date, slug);

    return {
      id: slug,
      slug,
      title: readString(frontmatter.title),
      date,
      summary: readString(frontmatter.summary),
      durationMinutes: readNumber(frontmatter.durationMinutes),
      type: (readString(frontmatter.type, 'reading') as LogItem['type']) || 'reading',
      tags: readArray(frontmatter.tags),
      featured: readBoolean(frontmatter.featured),
      highlights: readArray(frontmatter.highlights),
      problems: readArray(frontmatter.problems),
      nextActions: readArray(frontmatter.nextActions),
      content,
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllNotes(): NoteItem[] {
  return readCollection<NoteItem>('notes', (slug, frontmatter, content) => {
    ensureRequiredFields('note', slug, frontmatter, ['title', 'summary', 'category', 'updatedAt']);
    const updatedAt = readString(frontmatter.updatedAt);
    ensureDateFormat('updatedAt', updatedAt, slug);

    return {
      id: slug,
      slug,
      title: readString(frontmatter.title),
      summary: readString(frontmatter.summary),
      category: readString(frontmatter.category),
      tags: readArray(frontmatter.tags),
      updatedAt,
      featured: readBoolean(frontmatter.featured),
      content,
    };
  }).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getAllProjects(): ProjectItem[] {
  return readCollection<ProjectItem>('projects', (slug, frontmatter, content) => {
    ensureRequiredFields('project', slug, frontmatter, ['title', 'summary', 'status']);

    return {
      id: slug,
      slug,
      title: readString(frontmatter.title),
      summary: readString(frontmatter.summary),
      status: readString(frontmatter.status, 'planning'),
      tags: readArray(frontmatter.tags),
      period: readString(frontmatter.period),
      href: `/projects/${slug}`,
      content,
      outcomes: readArray(frontmatter.outcomes),
      lessons: readArray(frontmatter.lessons),
      nextSteps: readArray(frontmatter.nextSteps),
    };
  });
}
