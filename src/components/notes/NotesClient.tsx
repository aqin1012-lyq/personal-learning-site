'use client';

import { useMemo, useState } from 'react';
import type { NoteItem } from '@/types/note';
import { SearchBox } from '@/components/common/SearchBox';
import { TagFilter } from '@/components/common/TagFilter';
import { CategoryFilter } from './CategoryFilter';
import { NoteCard } from './NoteCard';
import { EmptyState } from '@/components/common/EmptyState';

export function NotesClient({ notes }: { notes: NoteItem[] }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeTag, setActiveTag] = useState('');

  const categories = Array.from(new Set(notes.map((item) => item.category)));
  const tags = Array.from(new Set(notes.flatMap((item) => item.tags)));

  const filteredNotes = useMemo(() => {
    return notes.filter((item) => {
      const matchQuery = item.title.toLowerCase().includes(query.toLowerCase()) || item.summary.toLowerCase().includes(query.toLowerCase());
      const matchCategory = activeCategory ? item.category === activeCategory : true;
      const matchTag = activeTag ? item.tags.includes(activeTag) : true;
      return matchQuery && matchCategory && matchTag;
    });
  }, [query, activeCategory, activeTag, notes]);

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
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Category</p>
              <CategoryFilter categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Tags</p>
              <TagFilter tags={tags} activeTag={activeTag} onTagChange={setActiveTag} />
            </div>
          </div>
        </div>
      </section>

      <section>
        {filteredNotes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredNotes.map((item) => (
              <NoteCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState title="没有找到符合条件的知识条目" description="试试更换搜索词或筛选条件。" />
        )}
      </section>
    </>
  );
}
