'use client';

import { useMemo, useState } from 'react';
import type { LogItem } from '@/types/log';
import { SearchBox } from '@/components/common/SearchBox';
import { TagFilter } from '@/components/common/TagFilter';
import { TypeFilter } from './TypeFilter';
import { LogCard } from './LogCard';
import { EmptyState } from '@/components/common/EmptyState';

export function LogsClient({ logs }: { logs: LogItem[] }) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [activeType, setActiveType] = useState('');

  const allTags = Array.from(new Set(logs.flatMap((item) => item.tags)));
  const allTypes = Array.from(new Set(logs.map((item) => item.type)));

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const matchQuery = item.title.toLowerCase().includes(query.toLowerCase()) || item.summary.toLowerCase().includes(query.toLowerCase());
      const matchTag = activeTag ? item.tags.includes(activeTag) : true;
      const matchType = activeType ? item.type === activeType : true;
      return matchQuery && matchTag && matchType;
    });
  }, [query, activeTag, activeType, logs]);

  return (
    <>
      <section className="space-y-4 rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
        <SearchBox placeholder="搜索日志标题或摘要" value={query} onChange={setQuery} />
        <TagFilter tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} />
        <TypeFilter types={allTypes} activeType={activeType} onTypeChange={setActiveType} />
      </section>

      <section className="space-y-4">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((item) => <LogCard key={item.id} item={item} />)
        ) : (
          <EmptyState title="没有找到符合条件的日志" description="试试更换关键词或取消筛选。" />
        )}
      </section>
    </>
  );
}
