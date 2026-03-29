import type { SiteConfig } from '@/types/site';

export const siteConfig: SiteConfig = {
  name: '学习记录站',
  tagline: '把零散学习，沉淀成可复用的认知结构',
  description: '这里不是单纯的笔记堆积，而是把输入、理解与实践连接起来的长期学习系统。',
  siteUrl: 'https://learning.example.com',
  locale: 'zh_CN',
  author: 'AQin',
  keywords: ['学习记录', '知识管理', '个人网站', '学习日志', '知识库', '项目实践'],
  nav: [
    { label: '首页', href: '/' },
    { label: '学习日志', href: '/logs' },
    { label: '知识库', href: '/notes' },
    { label: '项目', href: '/projects' },
    { label: '关于', href: '/about' },
  ],
};
