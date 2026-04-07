import fs from 'node:fs';
import path from 'node:path';

type NoteInput = {
  title: string;
  summary: string;
  category: string;
  tags: string[];
  updatedAt: string;
  featured: boolean;
  content: string;
};

type LogInput = {
  title: string;
  summary: string;
  date: string;
  durationMinutes?: number;
  type: string;
  tags: string[];
  featured: boolean;
  content: string;
  highlights: string[];
  problems: string[];
  nextActions: string[];
};

type ProjectInput = {
  title: string;
  summary: string;
  status: string;
  period?: string;
  tags: string[];
  content: string;
  outcomes: string[];
  lessons: string[];
  nextSteps: string[];
};

type CurrentLearningInput = {
  id: string;
  title: string;
  summary: string;
  status: string;
  progressText?: string;
  tags: string[];
  href?: string;
};

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeDoubleQuotes(input: string) {
  return input.replace(/"/g, '\\"');
}

function ensureDate(value: string, label: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${label} 必须是 YYYY-MM-DD 格式`);
  }
}

function renderQuotedList(items: string[]) {
  if (!items.length) return '  - ""';
  return items.map((item) => `  - "${escapeDoubleQuotes(item)}"`).join('\n');
}

export function createNoteFile(input: NoteInput) {
  ensureDate(input.updatedAt, 'updatedAt');
  const slug = slugify(input.title);
  const filePath = path.join(process.cwd(), 'content', 'notes', `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    throw new Error('同名知识卡片已存在，请换一个标题');
  }

  const mdx = `---
title: "${escapeDoubleQuotes(input.title)}"
summary: "${escapeDoubleQuotes(input.summary)}"
category: "${escapeDoubleQuotes(input.category)}"
tags:
${renderQuotedList(input.tags)}
updatedAt: "${input.updatedAt}"
featured: ${input.featured ? 'true' : 'false'}
---

${input.content.trim()}
`;

  fs.writeFileSync(filePath, mdx, 'utf8');
  return { slug, filePath };
}

export function createLogFile(input: LogInput) {
  ensureDate(input.date, 'date');
  const slug = `${input.date}-${slugify(input.title)}`;
  const filePath = path.join(process.cwd(), 'content', 'logs', `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    throw new Error('同日期同标题的学习日志已存在');
  }

  const mdx = `---
title: "${escapeDoubleQuotes(input.title)}"
date: "${input.date}"
summary: "${escapeDoubleQuotes(input.summary)}"
durationMinutes: ${input.durationMinutes || 0}
type: ${input.type}
tags:
${renderQuotedList(input.tags)}
featured: ${input.featured ? 'true' : 'false'}
highlights:
${renderQuotedList(input.highlights)}
problems:
${renderQuotedList(input.problems)}
nextActions:
${renderQuotedList(input.nextActions)}
---

${input.content.trim()}
`;

  fs.writeFileSync(filePath, mdx, 'utf8');
  return { slug, filePath };
}

export function createProjectFile(input: ProjectInput) {
  const slug = slugify(input.title);
  const filePath = path.join(process.cwd(), 'content', 'projects', `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    throw new Error('同名项目已存在，请换一个标题');
  }

  const mdx = `---
title: "${escapeDoubleQuotes(input.title)}"
summary: "${escapeDoubleQuotes(input.summary)}"
status: "${escapeDoubleQuotes(input.status)}"
tags:
${renderQuotedList(input.tags)}
period: "${escapeDoubleQuotes(input.period || '')}"
outcomes:
${renderQuotedList(input.outcomes)}
lessons:
${renderQuotedList(input.lessons)}
nextSteps:
${renderQuotedList(input.nextSteps)}
---

${input.content.trim()}
`;

  fs.writeFileSync(filePath, mdx, 'utf8');
  return { slug, filePath };
}

export function updateCurrentLearningFile(items: CurrentLearningInput[]) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'current-learning.ts');
  const content = `import type { CurrentLearningItem } from '@/types/home';

export const currentLearning: CurrentLearningItem[] = ${JSON.stringify(items, null, 2)};
`;
  fs.writeFileSync(filePath, content, 'utf8');
  return { filePath };
}
