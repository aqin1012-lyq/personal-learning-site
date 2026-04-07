'use server';

import { revalidatePath } from 'next/cache';
import { createLogFile, createNoteFile, createProjectFile, updateCurrentLearningFile } from '@/lib/studio';

type CurrentLearningPayloadItem = {
  id: string;
  title: string;
  summary: string;
  status: string;
  progressText?: string;
  tags: string[];
  href?: string;
};

export async function createNoteAction(formData: FormData) {
  const title = String(formData.get('title') || '').trim();
  const summary = String(formData.get('summary') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const updatedAt = String(formData.get('updatedAt') || '').trim();
  const content = String(formData.get('content') || '').trim();
  const tags = String(formData.get('tags') || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  const featured = String(formData.get('featured') || '') === 'on';

  if (!title || !summary || !category || !updatedAt || !content) {
    throw new Error('缺少必填字段');
  }

  const result = createNoteFile({ title, summary, category, updatedAt, content, tags, featured });

  revalidatePath('/notes');
  revalidatePath('/');

  return { slug: result.slug, href: `/notes/${result.slug}` };
}

export async function createLogAction(formData: FormData) {
  const title = String(formData.get('title') || '').trim();
  const summary = String(formData.get('summary') || '').trim();
  const date = String(formData.get('date') || '').trim();
  const content = String(formData.get('content') || '').trim();
  const type = String(formData.get('type') || '').trim();
  const durationMinutes = Number(formData.get('durationMinutes') || 0);
  const featured = String(formData.get('featured') || '') === 'on';
  const tags = String(formData.get('tags') || '').split(',').map((tag) => tag.trim()).filter(Boolean);
  const highlights = String(formData.get('highlights') || '').split('\n').map((item) => item.trim()).filter(Boolean);
  const problems = String(formData.get('problems') || '').split('\n').map((item) => item.trim()).filter(Boolean);
  const nextActions = String(formData.get('nextActions') || '').split('\n').map((item) => item.trim()).filter(Boolean);

  if (!title || !summary || !date || !content || !type) {
    throw new Error('缺少必填字段');
  }

  const result = createLogFile({
    title,
    summary,
    date,
    content,
    type,
    durationMinutes,
    featured,
    tags,
    highlights,
    problems,
    nextActions,
  });

  revalidatePath('/logs');
  revalidatePath('/');

  return { slug: result.slug, href: `/logs/${result.slug}` };
}

export async function createProjectAction(formData: FormData) {
  const title = String(formData.get('title') || '').trim();
  const summary = String(formData.get('summary') || '').trim();
  const status = String(formData.get('status') || '').trim();
  const period = String(formData.get('period') || '').trim();
  const content = String(formData.get('content') || '').trim();
  const tags = String(formData.get('tags') || '').split(',').map((tag) => tag.trim()).filter(Boolean);
  const outcomes = String(formData.get('outcomes') || '').split('\n').map((item) => item.trim()).filter(Boolean);
  const lessons = String(formData.get('lessons') || '').split('\n').map((item) => item.trim()).filter(Boolean);
  const nextSteps = String(formData.get('nextSteps') || '').split('\n').map((item) => item.trim()).filter(Boolean);

  if (!title || !summary || !status || !content) {
    throw new Error('项目缺少必填字段：title / summary / status / content');
  }

  const result = createProjectFile({
    title,
    summary,
    status,
    period,
    content,
    tags,
    outcomes,
    lessons,
    nextSteps,
  });

  revalidatePath('/projects');
  revalidatePath('/');

  return { slug: result.slug, href: `/projects/${result.slug}` };
}

export async function updateCurrentLearningAction(payload: CurrentLearningPayloadItem[]) {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error('当前在学内容不能为空');
  }

  for (const item of payload) {
    if (!item.title?.trim() || !item.summary?.trim() || !item.status?.trim()) {
      throw new Error('当前在学每一项都至少要有标题、说明和状态');
    }
  }

  updateCurrentLearningFile(payload);

  revalidatePath('/');

  return { ok: true };
}
