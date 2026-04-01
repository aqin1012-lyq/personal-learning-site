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

export function createNoteFile(input: NoteInput) {
  const slug = slugify(input.title);
  const filePath = path.join(process.cwd(), 'content', 'notes', `${slug}.mdx`);

  const mdx = `---
title: "${escapeDoubleQuotes(input.title)}"
summary: "${escapeDoubleQuotes(input.summary)}"
category: "${escapeDoubleQuotes(input.category)}"
tags:
${input.tags.map((tag) => `  - "${escapeDoubleQuotes(tag)}"`).join('\n')}
updatedAt: "${input.updatedAt}"
featured: ${input.featured ? 'true' : 'false'}
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
