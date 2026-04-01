'use server';

import { revalidatePath } from 'next/cache';
import { createNoteFile, updateCurrentLearningFile } from '@/lib/studio';

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

  createNoteFile({ title, summary, category, updatedAt, content, tags, featured });

  revalidatePath('/notes');
  revalidatePath('/');
}

export async function updateCurrentLearningAction(payload: CurrentLearningPayloadItem[]) {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error('当前在学内容不能为空');
  }

  updateCurrentLearningFile(payload);

  revalidatePath('/');
}
