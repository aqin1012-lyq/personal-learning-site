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
      <section className="section-shell reveal-surface overflow-hidden">
        <div className="relative space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="section-label">Browse & Filter</p>
              <h2 className="font-cjk text-[1.2rem] font-medium text-stone-100">按主题、类型和关键词快速定位学习过程</h2>
            </div>
            <div className="text-sm text-stone-500">
              当前结果 <span className="text-stone-300">{filteredLogs.length}</span> / {logs.length}
            </div>
          </div>

          <SearchBox placeholder="搜索日志标题或摘要" value={query} onChange={setQuery} />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Type</p>
              <TypeFilter types={allTypes} activeType={activeType} onTypeChange={setActiveType} />
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Tags</p>
              <TagFilter tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} />
            </div>
          </div>
        </div>
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
