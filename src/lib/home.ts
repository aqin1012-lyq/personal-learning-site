import type { NoteItem } from '@/types/note';
import type { LogItem } from '@/types/log';
import type { ProjectItem } from '@/types/project';
import type { TimelineItem, TimelineMonth, TimelineYear } from '@/components/home/TimelinePreview';

export function buildNotesHref(item: Pick<NoteItem, 'category' | 'tags'>) {
  const params = new URLSearchParams();
  if (item.category) params.set('category', item.category);
  if (item.tags[0]) params.set('tag', item.tags[0]);
  const query = params.toString();
  return query ? `/notes?${query}` : '/notes';
}

export function buildHomeStats(logs: LogItem[], notes: NoteItem[], projects: ProjectItem[]) {
  return [
    { label: 'Learning Logs', value: String(logs.length).padStart(2, '0'), note: '持续记录输入、实践与复盘' },
    { label: 'Knowledge Notes', value: String(notes.length).padStart(2, '0'), note: '把零散理解整理成可复用卡片' },
    { label: 'Projects', value: String(projects.length).padStart(2, '0'), note: '用项目验证抽象，而不只停留在阅读' },
  ];
}

export function buildQuickMap() {
  return [
    {
      title: '学习日志',
      description: '按时间查看最近在学什么、卡在哪里、下一步做什么。',
      href: '/logs',
      badge: 'Timeline',
    },
    {
      title: '知识库',
      description: '把重复出现的概念、方法和结构沉淀成随时可取用的条目。',
      href: '/notes',
      badge: 'Knowledge Base',
    },
    {
      title: '项目实践',
      description: '把学习结果落到真实产出里，避免“看过等于会了”的错觉。',
      href: '/projects',
      badge: 'Practice',
    },
  ];
}

export function buildDeckSections() {
  return [
    { label: 'Now', title: '10-year timeline', note: '先在近十年里定位内容主要落在哪些年份' },
    { label: 'Drill Down', title: '年 / 月 / 月历展开', note: '从年份进入月份，再用整张月历查看该月分布' },
    { label: 'Output', title: '最新内容与项目', note: '沿着日志、知识卡片、实践继续深入' },
  ];
}

function parseProjectDate(period?: string) {
  if (!period) return '';
  const matched = period.match(/(\d{4})\.(\d{1,2})/);
  if (!matched) return '';
  const [, year, month] = matched;
  return `${year}-${String(month).padStart(2, '0')}-01`;
}

export function buildTimelineYears(logs: LogItem[], notes: NoteItem[], projects: ProjectItem[]): TimelineYear[] {
  const timelineItems: TimelineItem[] = [
    ...logs.map((item) => ({
      id: `log-${item.id}`,
      title: item.title,
      summary: item.summary,
      date: item.date,
      href: `/logs/${item.slug}`,
      kind: 'log' as const,
      meta: item.type,
      tags: item.tags,
    })),
    ...notes.map((item) => ({
      id: `note-${item.id}`,
      title: item.title,
      summary: item.summary,
      date: item.updatedAt,
      href: `/notes/${item.slug}`,
      kind: 'note' as const,
      meta: item.category,
      tags: item.tags,
    })),
    ...projects.map((item) => ({
      id: `project-${item.id}`,
      title: item.title,
      summary: item.summary,
      date: parseProjectDate(item.period),
      href: item.href || `/projects/${item.slug}`,
      kind: 'project' as const,
      meta: item.status,
      tags: item.tags,
    })),
  ].filter((item) => item.date);

  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, index) => currentYear - 9 + index).map((year) => {
    const months: TimelineMonth[] = Array.from({ length: 12 }, (_, monthIndex) => {
      const month = monthIndex + 1;
      const daysInMonth = new Date(year, month, 0).getDate();
      const monthItems = timelineItems
        .filter((item) => item.date.startsWith(`${year}-${String(month).padStart(2, '0')}`))
        .sort((a, b) => (a.date < b.date ? 1 : -1));

      const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;

      return {
        key: `${year}-${String(month).padStart(2, '0')}`,
        month,
        label: new Intl.DateTimeFormat('zh-CN', { month: 'long' }).format(new Date(year, monthIndex, 1)),
        shortLabel: `${String(month).padStart(2, '0')}月`,
        itemCount: monthItems.length,
        firstWeekday,
        days: Array.from({ length: daysInMonth }, (_, dayIndex) => {
          const day = dayIndex + 1;
          const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          return {
            day,
            key,
            weekday: (firstWeekday + dayIndex) % 7,
            items: monthItems.filter((item) => item.date === key),
          };
        }),
      };
    });

    return {
      year,
      key: String(year),
      itemCount: months.reduce((total, month) => total + month.itemCount, 0),
      months,
    };
  });
}
