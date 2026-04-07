'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { LogItem } from '@/types/log';
import { SearchBox } from '@/components/common/SearchBox';
import { TagFilter } from '@/components/common/TagFilter';
import { TypeFilter } from './TypeFilter';
import { LogCard } from './LogCard';
import { EmptyState } from '@/components/common/EmptyState';
import { siteConfig } from '@/data/site';

export function LogsClient({
  logs,
  initialQuery = '',
  initialTag = '',
  initialType = '',
}: {
  logs: LogItem[];
  initialQuery?: string;
  initialTag?: string;
  initialType?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [activeType, setActiveType] = useState(initialType);

  const allTypes = useMemo(() => Array.from(new Set(logs.map((item) => item.type))), [logs]);
  const allTags = useMemo(() => {
    const source = activeType ? logs.filter((item) => item.type === activeType) : logs;
    return Array.from(new Set(source.flatMap((item) => item.tags)));
  }, [activeType, logs]);

  useEffect(() => {
    if (activeTag && !allTags.includes(activeTag)) {
      setActiveTag('');
    }
  }, [activeTag, allTags]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (activeTag) params.set('tag', activeTag);
    if (activeType) params.set('type', activeType);
    const next = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(next, { scroll: false });
  }, [activeTag, activeType, pathname, query, router]);

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return logs.filter((item) => {
      const matchQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.summary.toLowerCase().includes(normalizedQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
        item.type.toLowerCase().includes(normalizedQuery);
      const matchTag = activeTag ? item.tags.includes(activeTag) : true;
      const matchType = activeType ? item.type === activeType : true;
      return matchQuery && matchTag && matchType;
    });
  }, [query, activeTag, activeType, logs]);

  const visibleTypes = useMemo(() => {
    if (!query && !activeTag) return allTypes;
    return allTypes.filter((type) => {
      return logs.some((item) => {
        const normalizedQuery = query.trim().toLowerCase();
        const matchQuery =
          !normalizedQuery ||
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.summary.toLowerCase().includes(normalizedQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
          item.type.toLowerCase().includes(normalizedQuery);
        const matchTag = activeTag ? item.tags.includes(activeTag) : true;
        return item.type === type && matchQuery && matchTag;
      });
    });
  }, [activeTag, allTypes, logs, query]);

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
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Type</p>
                <span className="text-xs text-stone-500">{visibleTypes.length} 个可选类型</span>
              </div>
              <TypeFilter
                types={visibleTypes}
                activeType={activeType}
                onTypeChange={(type) => {
                  setActiveType(type);
                  if (type && activeTag) {
                    const nextTags = Array.from(new Set(logs.filter((item) => item.type === type).flatMap((item) => item.tags)));
                    if (!nextTags.includes(activeTag)) setActiveTag('');
                  }
                }}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Tags</p>
                <span className="text-xs text-stone-500">{allTags.length} 个可选标签</span>
              </div>
              <TagFilter tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {filteredLogs.length > 0 ? (
          <div className="space-y-4">
            {query || activeTag || activeType ? (
              <div className="flex flex-wrap items-center gap-2 text-sm text-stone-400">
                <span>当前筛选：</span>
                {query ? <span className="pill-tag">关键词：{query}</span> : null}
                {activeType ? <span className="pill-tag">类型：{activeType}</span> : null}
                {activeTag ? <span className="pill-tag">标签：{activeTag}</span> : null}
                <button
                  className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-sm text-stone-300 transition hover:bg-white/[0.06]"
                  onClick={() => {
                    setQuery('');
                    setActiveTag('');
                    setActiveType('');
                  }}
                >
                  清空筛选
                </button>
              </div>
            ) : null}

            {filteredLogs.map((item) => (
              <LogCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={logs.length === 0 ? '这里还没有学习日志' : '没有找到符合条件的日志'}
            description={
              logs.length === 0
                ? '复制模板后，建议先写下第一条学习记录：今天学了什么、卡在哪里、下一步打算做什么。'
                : '试试更换关键词或取消筛选。'
            }
            label={logs.length === 0 ? 'Start Your First Log' : 'No Matching Content'}
            action={logs.length === 0 ? siteConfig.emptyStateCta : undefined}
          />
        )}
      </section>
    </>
  );
}
