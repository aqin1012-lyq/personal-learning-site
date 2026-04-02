import type { CurrentLearningItem } from '@/types/home';

export const currentLearning: CurrentLearningItem[] = [
  {
    id: 'cl-1',
    title: '前端系统设计',
    summary: '持续整理组件结构、页面层级与状态管理方式。',
    status: '进行中',
    progressText: '本周重点',
    tags: ['React', 'Design System', 'UI'],
    href: '/notes?category=前端开发&tag=React',
  },
  {
    id: 'cl-2',
    title: '英语精读',
    summary: '练习拆句、复述和表达积累，保持稳定输入。',
    status: '持续推进',
    progressText: '每日练习',
    tags: ['English', 'Reading'],
    href: '/logs/2026-03-24-english-intensive-reading',
  },
  {
    id: 'cl-3',
    title: '学习方法系统化',
    summary: '把记录、复盘和知识沉淀整理成长期可用的方法。',
    status: '整理中',
    progressText: '专题沉淀',
    tags: ['Learning', 'Notes'],
    href: '/notes',
  },
];
