'use client';

import { useMemo, useState, useTransition } from 'react';
import type { NoteItem } from '@/types/note';
import type { CurrentLearningItem } from '@/types/home';
import { createNoteAction, updateCurrentLearningAction } from '@/app/studio/actions';

type StudioClientProps = {
  notes: NoteItem[];
  currentLearning: CurrentLearningItem[];
};

export function StudioClient({ notes, currentLearning }: StudioClientProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [learningItems, setLearningItems] = useState(currentLearning);

  const suggestedCategories = useMemo(() => Array.from(new Set(notes.map((item) => item.category))), [notes]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="section-shell space-y-5">
        <div className="space-y-2">
          <p className="section-label">Studio · New Note</p>
          <h2 className="font-cjk text-[1.2rem] font-medium text-stone-100">直接在页面里新增知识库文档</h2>
          <p className="text-sm leading-7 text-stone-400">支持标题、摘要、分类、标签、正文和 featured；提交后会直接写入本地 `content/notes/`。</p>
        </div>

        <form
          action={(formData) => {
            setMessage('');
            startTransition(async () => {
              try {
                await createNoteAction(formData);
                setMessage('知识库文档已新增。');
              } catch (error) {
                setMessage(error instanceof Error ? error.message : '新增失败');
              }
            });
          }}
          className="grid gap-4"
        >
          <input name="title" placeholder="标题" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
          <textarea name="summary" placeholder="摘要（卡片显示）" rows={3} className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
          <div className="grid gap-4 md:grid-cols-2">
            <input name="category" list="studio-categories" placeholder="分类" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
            <input name="updatedAt" placeholder="日期，如 2026-04-01" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
          </div>
          <input name="tags" placeholder="标签，逗号分隔" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
          <textarea name="content" placeholder="正文（支持现有简化 MDX / Markdown 结构）" rows={16} className="rounded-[20px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm leading-7 text-stone-100 outline-none" />
          <label className="flex items-center gap-3 text-sm text-stone-300">
            <input type="checkbox" name="featured" />
            设为 featured
          </label>
          <button type="submit" disabled={isPending} className="hero-button-primary w-fit disabled:opacity-60">
            {isPending ? '提交中…' : '新增知识库文档'}
          </button>
          {message ? <p className="text-sm text-stone-400">{message}</p> : null}
          <datalist id="studio-categories">
            {suggestedCategories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </form>
      </section>

      <section className="section-shell space-y-5">
        <div className="space-y-2">
          <p className="section-label">Studio · Current Learning</p>
          <h2 className="font-cjk text-[1.2rem] font-medium text-stone-100">编辑首页“当前在学”</h2>
          <p className="text-sm leading-7 text-stone-400">支持短标签 `progressText`、当前状态 `status`、标题、说明、标签和跳转链接。</p>
        </div>

        <div className="grid gap-4">
          {learningItems.map((item, index) => (
            <div key={item.id} className="rounded-[20px] border border-white/[0.06] bg-black/10 p-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <input value={item.title} onChange={(e) => setLearningItems((prev) => prev.map((entry, i) => i === index ? { ...entry, title: e.target.value } : entry))} placeholder="标题" className="rounded-[14px] border border-white/[0.08] bg-black/10 px-3 py-2.5 text-sm text-stone-100 outline-none" />
                <input value={item.status} onChange={(e) => setLearningItems((prev) => prev.map((entry, i) => i === index ? { ...entry, status: e.target.value } : entry))} placeholder="状态" className="rounded-[14px] border border-white/[0.08] bg-black/10 px-3 py-2.5 text-sm text-stone-100 outline-none" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input value={item.progressText || ''} onChange={(e) => setLearningItems((prev) => prev.map((entry, i) => i === index ? { ...entry, progressText: e.target.value } : entry))} placeholder="短标签 progressText" className="rounded-[14px] border border-white/[0.08] bg-black/10 px-3 py-2.5 text-sm text-stone-100 outline-none" />
                <input value={item.href || ''} onChange={(e) => setLearningItems((prev) => prev.map((entry, i) => i === index ? { ...entry, href: e.target.value } : entry))} placeholder="跳转链接 href" className="rounded-[14px] border border-white/[0.08] bg-black/10 px-3 py-2.5 text-sm text-stone-100 outline-none" />
              </div>
              <textarea value={item.summary} onChange={(e) => setLearningItems((prev) => prev.map((entry, i) => i === index ? { ...entry, summary: e.target.value } : entry))} placeholder="说明 summary" rows={3} className="rounded-[14px] border border-white/[0.08] bg-black/10 px-3 py-2.5 text-sm text-stone-100 outline-none" />
              <input value={item.tags.join(', ')} onChange={(e) => setLearningItems((prev) => prev.map((entry, i) => i === index ? { ...entry, tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) } : entry))} placeholder="标签，逗号分隔" className="rounded-[14px] border border-white/[0.08] bg-black/10 px-3 py-2.5 text-sm text-stone-100 outline-none" />
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setMessage('');
            startTransition(async () => {
              try {
                await updateCurrentLearningAction(learningItems);
                setMessage('当前在学已更新。');
              } catch (error) {
                setMessage(error instanceof Error ? error.message : '更新失败');
              }
            });
          }}
          className="hero-button-secondary w-fit disabled:opacity-60"
        >
          {isPending ? '保存中…' : '保存当前在学'}
        </button>
      </section>
    </div>
  );
}
