'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { NoteItem } from '@/types/note';
import { SearchBox } from '@/components/common/SearchBox';
import { TagFilter } from '@/components/common/TagFilter';
import { CategoryFilter } from './CategoryFilter';
import { NoteCard } from './NoteCard';
import { EmptyState } from '@/components/common/EmptyState';

export function NotesClient({
  notes,
  initialQuery = '',
  initialCategory = '',
  initialTag = '',
}: {
  notes: NoteItem[];
  initialQuery?: string;
  initialCategory?: string;
  initialTag?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeTag, setActiveTag] = useState(initialTag);

  const categories = useMemo(() => Array.from(new Set(notes.map((item) => item.category))), [notes]);

  const tags = useMemo(() => {
    const source = activeCategory ? notes.filter((item) => item.category === activeCategory) : notes;
    return Array.from(new Set(source.flatMap((item) => item.tags)));
  }, [activeCategory, notes]);

  useEffect(() => {
    if (activeTag && !tags.includes(activeTag)) {
      setActiveTag('');
    }
  }, [activeTag, tags]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (activeCategory) params.set('category', activeCategory);
    if (activeTag) params.set('tag', activeTag);
    const next = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(next, { scroll: false });
  }, [activeCategory, activeTag, pathname, query, router]);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return notes.filter((item) => {
      const matchQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.summary.toLowerCase().includes(normalizedQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
        item.category.toLowerCase().includes(normalizedQuery);
      const matchCategory = activeCategory ? item.category === activeCategory : true;
      const matchTag = activeTag ? item.tags.includes(activeTag) : true;
      return matchQuery && matchCategory && matchTag;
    });
  }, [query, activeCategory, activeTag, notes]);

  const visibleCategories = useMemo(() => {
    if (!query && !activeTag) return categories;
    return categories.filter((category) => {
      return notes.some((item) => {
        const normalizedQuery = query.trim().toLowerCase();
        const matchQuery =
          !normalizedQuery ||
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.summary.toLowerCase().includes(normalizedQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
          item.category.toLowerCase().includes(normalizedQuery);
        const matchTag = activeTag ? item.tags.includes(activeTag) : true;
        return item.category === category && matchQuery && matchTag;
      });
    });
  }, [activeTag, categories, notes, query]);

  return (
    <>
      <section className="section-shell reveal-surface overflow-hidden">
        <div className="relative space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="section-label">Knowledge Navigator</p>
              <h2 className="font-cjk text-[1.2rem] font-medium text-stone-100">按分类、标签和关键词组织你的知识卡片</h2>
            </div>
            <div className="text-sm text-stone-500">
              当前结果 <span className="text-stone-300">{filteredNotes.length}</span> / {notes.length}
            </div>
          </div>

          <SearchBox placeholder="搜索知识条目" value={query} onChange={setQuery} />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Category</p>
                <span className="text-xs text-stone-500">{visibleCategories.length} 个可选分类</span>
              </div>
              <CategoryFilter
                categories={visibleCategories}
                activeCategory={activeCategory}
                onCategoryChange={(category) => {
                  setActiveCategory(category);
                  if (category && activeTag) {
                    const nextTags = Array.from(new Set(notes.filter((item) => item.category === category).flatMap((item) => item.tags)));
                    if (!nextTags.includes(activeTag)) setActiveTag('');
                  }
                }}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Tags</p>
                <span className="text-xs text-stone-500">{tags.length} 个可选标签</span>
              </div>
              <TagFilter tags={tags} activeTag={activeTag} onTagChange={setActiveTag} />
            </div>
          </div>
        </div>
      </section>

      <section>
        {filteredNotes.length > 0 ? (
          <div className="space-y-4">
            {query || activeCategory || activeTag ? (
              <div className="flex flex-wrap items-center gap-2 text-sm text-stone-400">
                <span>当前筛选：</span>
                {query ? <span className="pill-tag">关键词：{query}</span> : null}
                {activeCategory ? <span className="pill-tag">分类：{activeCategory}</span> : null}
                {activeTag ? <span className="pill-tag">标签：{activeTag}</span> : null}
                <button
                  className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-sm text-stone-300 transition hover:bg-white/[0.06]"
                  onClick={() => {
                    setQuery('');
                    setActiveCategory('');
                    setActiveTag('');
                  }}
                >
                  清空筛选
                </button>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredNotes.map((item) => (
                <NoteCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title="没有找到符合条件的知识条目" description="试试更换搜索词或筛选条件。" />
        )}
      </section>
    </>
  );
}
