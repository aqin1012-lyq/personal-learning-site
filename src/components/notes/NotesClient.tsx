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
      <section className="space-y-4 rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
        <SearchBox placeholder="搜索知识条目" value={query} onChange={setQuery} />
        <CategoryFilter categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <TagFilter tags={tags} activeTag={activeTag} onTagChange={setActiveTag} />
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
