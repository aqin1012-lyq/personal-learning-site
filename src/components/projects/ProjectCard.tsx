import Link from 'next/link';
import type { ProjectItem } from '@/types/project';

const statusMap: Record<string, string> = {
  'in-progress': '进行中',
  completed: '已完成',
  planning: '规划中',
  paused: '已暂停',
};

export function ProjectCard({ item }: { item: ProjectItem }) {
  return (
    <Link href={item.href || '/projects'} className="surface-card surface-card-hover block p-6 md:p-7">
      <div className="relative space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-medium text-stone-100">{item.title}</h3>
          <span className="pill-tag shrink-0">{statusMap[item.status] || item.status}</span>
        </div>
        <p className="text-sm leading-7 text-stone-400">{item.summary}</p>
        {item.period ? <p className="text-sm text-stone-500">{item.period}</p> : null}
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="pill-tag text-stone-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
