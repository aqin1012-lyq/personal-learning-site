import type { SiteConfig } from '@/types/site';

export const siteConfig: SiteConfig = {
  name: '学习记录站',
  tagline: '把零散学习沉淀成可复用的认知结构',
  productTagline: '不是普通博客，而是一套把 Logs、Notes、Projects 串起来的个人学习系统模板。',
  description: '这里不是单纯的笔记堆积，而是把输入、理解与实践连接起来的长期学习系统。',
  siteUrl: 'https://learning.example.com',
  locale: 'zh_CN',
  author: 'AQin',
  keywords: ['学习记录', '知识管理', '个人网站', '学习日志', '知识库', '项目实践'],
  audience: '适合长期学习 AI、编程、英语、设计或任何技能，并希望把过程、知识沉淀与输出串成闭环的人。',
  setupSteps: [
    '先修改 src/data/site.ts，把站点名、作者、域名与首页文案替换成你自己的。',
    '再往 content/logs、content/notes、content/projects 添加你的第一条内容。',
    '最后去 /studio 查看字段说明，或直接在页面里新建日志与知识卡片。',
  ],
  emptyStateCta: {
    label: '去 Studio 开始填内容',
    href: '/studio',
  },
  studioCta: {
    label: '查看 Studio',
    href: '/studio',
  },
  nav: [
    { label: '首页', href: '/' },
    { label: '学习日志', href: '/logs' },
    { label: '知识库', href: '/notes' },
    { label: '项目', href: '/projects' },
    { label: '关于', href: '/about' },
    { label: 'Studio', href: '/studio' },
  ],
};
