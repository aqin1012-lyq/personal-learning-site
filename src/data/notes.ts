import type { NoteItem } from '@/types/note';

export const notes: NoteItem[] = [
  {
    id: 'note-1',
    slug: 'frontend-system-design',
    title: '前端系统设计',
    summary: '整理页面结构、组件边界和信息层级的一组方法。',
    category: '前端开发',
    tags: ['React', 'Design System', 'UI'],
    updatedAt: '2026-03-27',
    featured: true,
  },
  {
    id: 'note-2',
    slug: 'react-state-management',
    title: 'React 状态管理边界',
    summary: '总结 useState、useReducer、context 的适用场景。',
    category: '前端开发',
    tags: ['React', 'State Management'],
    updatedAt: '2026-03-26',
    featured: true,
  },
  {
    id: 'note-3',
    slug: 'english-intensive-reading',
    title: '英语精读方法',
    summary: '从拆句、复述到表达积累的一套输入方法。',
    category: '语言学习',
    tags: ['English', 'Reading'],
    updatedAt: '2026-03-24',
    featured: false,
  },
];
