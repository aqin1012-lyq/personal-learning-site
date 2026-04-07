'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import type { NoteItem } from '@/types/note';
import type { CurrentLearningItem } from '@/types/home';
import { createLogAction, createNoteAction, createProjectAction, updateCurrentLearningAction } from '@/app/studio/actions';

type StudioClientProps = {
  notes: NoteItem[];
  currentLearning: CurrentLearningItem[];
};

const PROGRESS_OPTIONS = ['本周重点', '每日练习', '专题沉淀', '持续输入', '阶段整理'];
const STATUS_OPTIONS = ['进行中', '持续推进', '整理中', '已暂停', '已完成'];
const LOG_TYPES = ['reading', 'practice', 'project', 'review', 'writing'];
const PROJECT_STATUS_OPTIONS = ['planning', 'in-progress', 'completed', 'paused'];

export function StudioClient({ notes, currentLearning }: StudioClientProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [createdHref, setCreatedHref] = useState('');
  const [learningItems, setLearningItems] = useState(currentLearning);

  const suggestedCategories = useMemo(() => Array.from(new Set(notes.map((item) => item.category))), [notes]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="section-shell studio-note-shell space-y-5">
          <div className="space-y-2">
            <p className="section-label">Studio · New Note</p>
            <h2 className="font-cjk text-[1.2rem] font-medium text-stone-100">直接在页面里新增知识库文档</h2>
            <p className="text-sm leading-7 text-stone-400">支持标题、摘要、分类、标签、正文和 featured；提交后会直接写入本地 `content/notes/`。</p>
          </div>

          <form
            action={(formData) => {
              setMessage('');
              setCreatedHref('');
              startTransition(async () => {
                try {
                  const result = await createNoteAction(formData);
                  setMessage('知识库文档已新增。');
                  setCreatedHref(result.href);
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : '新增失败');
                }
              });
            }}
            className="grid gap-4"
          >
            <div className="rounded-[18px] border border-dashed border-white/[0.08] bg-white/[0.015] px-4 py-3 text-sm leading-7 text-stone-400">
              推荐先写那些你未来还会反复翻出来看的内容，比如一个概念解释、一个方法总结、一个常犯错误清单。
            </div>
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
            {createdHref ? <Link href={createdHref} className="refined-link interactive-link w-fit"><span>打开新文档</span><span aria-hidden>→</span></Link> : null}
            <datalist id="studio-categories">
              {suggestedCategories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </form>
        </section>

        <section className="section-shell studio-log-shell space-y-5">
          <div className="space-y-2">
            <p className="section-label">Studio · New Log</p>
            <h2 className="font-cjk text-[1.2rem] font-medium text-stone-100">直接新增学习日志</h2>
            <p className="text-sm leading-7 text-stone-400">支持日志类型、时长、收获、问题和下一步计划；提交后写入本地 `content/logs/`。</p>
          </div>

          <form
            action={(formData) => {
              setMessage('');
              setCreatedHref('');
              startTransition(async () => {
                try {
                  const result = await createLogAction(formData);
                  setMessage('学习日志已新增。');
                  setCreatedHref(result.href);
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : '新增失败');
                }
              });
            }}
            className="grid gap-4"
          >
            <div className="rounded-[18px] border border-dashed border-white/[0.08] bg-white/[0.015] px-4 py-3 text-sm leading-7 text-stone-400">
              第一条日志不用写得很满。能回答“我今天学了什么、哪里卡住了、下一步干嘛”就已经够好了。
            </div>
            <input name="title" placeholder="标题" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
            <textarea name="summary" placeholder="摘要" rows={3} className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
            <div className="grid gap-4 md:grid-cols-3">
              <input name="date" placeholder="日期，如 2026-04-01" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
              <input name="durationMinutes" placeholder="时长（分钟）" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
              <select name="type" defaultValue="reading" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none">
                {LOG_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <input name="tags" placeholder="标签，逗号分隔" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
            <div className="grid gap-4 md:grid-cols-3">
              <textarea name="highlights" placeholder="收获，每行一条" rows={5} className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
              <textarea name="problems" placeholder="问题，每行一条" rows={5} className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
              <textarea name="nextActions" placeholder="下一步，每行一条" rows={5} className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
            </div>
            <textarea name="content" placeholder="正文（支持现有简化 MDX / Markdown 结构）" rows={14} className="rounded-[20px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm leading-7 text-stone-100 outline-none" />
            <label className="flex items-center gap-3 text-sm text-stone-300">
              <input type="checkbox" name="featured" />
              设为 featured
            </label>
            <button type="submit" disabled={isPending} className="hero-button-primary w-fit disabled:opacity-60">
              {isPending ? '提交中…' : '新增学习日志'}
            </button>
          </form>
        </section>
      </div>

      <section className="section-shell studio-log-shell space-y-5">
        <div className="space-y-2">
          <p className="section-label">Studio · New Project</p>
          <h2 className="font-cjk text-[1.2rem] font-medium text-stone-100">直接新增项目 / 实践</h2>
          <p className="text-sm leading-7 text-stone-400">项目页不是拿来堆“最终战果”的，它更适合记录你如何把一个学习主题落到真实输出里。</p>
        </div>

        <form
          action={(formData) => {
            setMessage('');
            setCreatedHref('');
            startTransition(async () => {
              try {
                const result = await createProjectAction(formData);
                setMessage('项目已新增。');
                setCreatedHref(result.href);
              } catch (error) {
                setMessage(error instanceof Error ? error.message : '新增失败');
              }
            });
          }}
          className="grid gap-4"
        >
          <div className="rounded-[18px] border border-dashed border-white/[0.08] bg-white/[0.015] px-4 py-3 text-sm leading-7 text-stone-400">
            如果你刚开始，项目可以很小。关键不是“做得多大”，而是让它真的能验证一段学习是否落地了。
          </div>
          <input name="title" placeholder="项目标题" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
          <textarea name="summary" placeholder="项目摘要" rows={3} className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
          <div className="grid gap-4 md:grid-cols-2">
            <select name="status" defaultValue="in-progress" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none">
              {PROJECT_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <input name="period" placeholder="项目周期，如 2026.04 - 2026.05" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
          </div>
          <input name="tags" placeholder="标签，逗号分隔" className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
          <div className="grid gap-4 md:grid-cols-3">
            <textarea name="outcomes" placeholder="成果，每行一条" rows={5} className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
            <textarea name="lessons" placeholder="收获，每行一条" rows={5} className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
            <textarea name="nextSteps" placeholder="下一步，每行一条" rows={5} className="rounded-[18px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-stone-100 outline-none" />
          </div>
          <textarea name="content" placeholder="项目正文" rows={14} className="rounded-[20px] border border-white/[0.08] bg-black/10 px-4 py-3 text-sm leading-7 text-stone-100 outline-none" />
          <button type="submit" disabled={isPending} className="hero-button-primary w-fit disabled:opacity-60">
            {isPending ? '提交中…' : '新增项目'}
          </button>
          {message ? <p className="text-sm text-stone-400">{message}</p> : null}
          {createdHref ? <Link href={createdHref} className="refined-link interactive-link w-fit"><span>打开新项目</span><span aria-hidden>→</span></Link> : null}
        </form>
      </section>

      <section className="section-shell studio-learning-shell space-y-5">
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
                <select value={item.status} onChange={(e) => setLearningItems((prev) => prev.map((entry, i) => i === index ? { ...entry, status: e.target.value } : entry))} className="rounded-[14px] border border-white/[0.08] bg-black/10 px-3 py-2.5 text-sm text-stone-100 outline-none">
                  {STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <select value={item.progressText || ''} onChange={(e) => setLearningItems((prev) => prev.map((entry, i) => i === index ? { ...entry, progressText: e.target.value } : entry))} className="rounded-[14px] border border-white/[0.08] bg-black/10 px-3 py-2.5 text-sm text-stone-100 outline-none">
                  <option value="">选择短标签</option>
                  {PROGRESS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
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
            setCreatedHref('');
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
