#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const ROOT = process.cwd();
const templates = {
  log: {
    template: path.join(ROOT, 'templates', 'log-template.mdx'),
    targetDir: path.join(ROOT, 'content', 'logs'),
    resolveFilename: ({ title, date, slugify }) => `${date}-${slugify(title)}.mdx`,
  },
  note: {
    template: path.join(ROOT, 'templates', 'note-template.mdx'),
    targetDir: path.join(ROOT, 'content', 'notes'),
    resolveFilename: ({ title, slugify }) => `${slugify(title)}.mdx`,
  },
  project: {
    template: path.join(ROOT, 'templates', 'project-template.mdx'),
    targetDir: path.join(ROOT, 'content', 'projects'),
    resolveFilename: ({ title, slugify }) => `${slugify(title)}.mdx`,
  },
};

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const type = process.argv[2];
  if (!type || !templates[type]) {
    console.error('Usage: node scripts/create-content.js <log|note|project>');
    process.exit(1);
  }

  const config = templates[type];
  if (!fs.existsSync(config.template)) {
    console.error(`Template not found: ${config.template}`);
    process.exit(1);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const title = (await ask(rl, 'Title: ')).trim();
  if (!title) {
    console.error('Title is required.');
    rl.close();
    process.exit(1);
  }

  const date = type === 'log' ? ((await ask(rl, 'Date (YYYY-MM-DD, default today): ')).trim() || new Date().toISOString().slice(0, 10)) : '';
  rl.close();

  const filename = config.resolveFilename({ title, date, slugify });
  const targetPath = path.join(config.targetDir, filename);

  if (fs.existsSync(targetPath)) {
    console.error(`File already exists: ${targetPath}`);
    process.exit(1);
  }

  fs.mkdirSync(config.targetDir, { recursive: true });
  let content = fs.readFileSync(config.template, 'utf8');
  content = content.replace(/你的第一条学习日志|你的第一张知识卡片|你的第一个项目实践/g, title);
  if (type === 'log' && date) {
    content = content.replace(/2026-04-07/g, date);
  }

  fs.writeFileSync(targetPath, content, 'utf8');
  console.log(`Created: ${path.relative(ROOT, targetPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
