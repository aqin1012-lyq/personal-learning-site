import fs from 'node:fs';
import path from 'node:path';
import type { LogItem } from '@/types/log';
import type { NoteItem } from '@/types/note';
import type { ProjectItem } from '@/types/project';

type Frontmatter = Record<string, unknown>;

function parseValue(raw: string): unknown {
  const value = raw.trim();
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^\d+$/.test(value)) return Number(value);
  return value.replace(/^"|"$/g, '');
}

function parseMdxFile(fileContent: string) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: fileContent.trim() };
  }

  const [, fmRaw, body] = match;
  const lines = fmRaw.split('\n');
  const frontmatter: Frontmatter = {};
  let currentArrayKey: string | null = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    if (line.startsWith('  - ') || line.startsWith('- ')) {
      if (currentArrayKey) {
        const item = line.replace(/^\s*-\s*/, '').replace(/^"|"$/g, '');
        (frontmatter[currentArrayKey] as unknown[]).push(item);
      }
      continue;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_]+):(.*)$/);
    if (!keyValueMatch) continue;

    const [, key, rawValue] = keyValueMatch;
    const trimmed = rawValue.trim();

    if (trimmed === '') {
      frontmatter[key] = [];
      currentArrayKey = key;
    } else {
      frontmatter[key] = parseValue(trimmed);
      currentArrayKey = null;
    }
  }

  return { frontmatter, content: body.trim() };
}

function readCollection<T>(dirName: string, mapper: (slug: string, frontmatter: Frontmatter, content: string) => T): T[] {
  const dir = path.join(process.cwd(), 'content', dirName);
  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.mdx'));

  return files.map((file) => {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { frontmatter, content } = parseMdxFile(raw);
    const slug = file.replace(/\.mdx$/, '');
    return mapper(slug, frontmatter, content);
  });
}

export function getAllLogs(): LogItem[] {
  return readCollection<LogItem>('logs', (slug, frontmatter, content) => ({
    id: slug,
    slug,
    title: String(frontmatter.title || ''),
    date: String(frontmatter.date || ''),
    summary: String(frontmatter.summary || ''),
    durationMinutes: Number(frontmatter.durationMinutes || 0),
    type: (frontmatter.type as LogItem['type']) || 'reading',
    tags: (frontmatter.tags as string[]) || [],
    featured: Boolean(frontmatter.featured),
    highlights: (frontmatter.highlights as string[]) || [],
    problems: (frontmatter.problems as string[]) || [],
    nextActions: (frontmatter.nextActions as string[]) || [],
    content,
  })).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllNotes(): NoteItem[] {
  return readCollection<NoteItem>('notes', (slug, frontmatter, content) => ({
    id: slug,
    slug,
    title: String(frontmatter.title || ''),
    summary: String(frontmatter.summary || ''),
    category: String(frontmatter.category || ''),
    tags: (frontmatter.tags as string[]) || [],
    updatedAt: String(frontmatter.updatedAt || ''),
    featured: Boolean(frontmatter.featured),
    content,
  })).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getAllProjects(): ProjectItem[] {
  return readCollection<ProjectItem>('projects', (slug, frontmatter, content) => ({
    id: slug,
    slug,
    title: String(frontmatter.title || ''),
    summary: String(frontmatter.summary || ''),
    status: String(frontmatter.status || 'planning'),
    tags: (frontmatter.tags as string[]) || [],
    period: String(frontmatter.period || ''),
    href: `/projects/${slug}`,
    content,
    outcomes: (frontmatter.outcomes as string[]) || [],
    lessons: (frontmatter.lessons as string[]) || [],
    nextSteps: (frontmatter.nextSteps as string[]) || [],
  }));
}
