import type { ProjectItem } from '@/types/project';

export const projects: ProjectItem[] = [
  {
    id: 'project-1',
    slug: 'learning-journal-site',
    title: '个人学习记录网站',
    summary: '搭建一个长期使用的个人学习系统网站。',
    status: 'in-progress',
    tags: ['Next.js', 'Tailwind CSS', 'UI'],
    period: '2026.03 - 至今',
    href: '/projects/learning-journal-site',
    content: `## 项目背景\n\n我希望把学习日志、知识沉淀和项目实践放进一个长期可维护的网站里。\n\n## 当前进展\n\n已经完成基础信息架构、前端页面骨架和第一轮视觉风格探索。`,
    outcomes: ['完成首页、日志、知识库、项目、关于页骨架', '跑通 Next.js + Tailwind 前端构建', '初步建立深色高级知识站视觉方向'],
    lessons: ['先把内容结构跑通，再做视觉精修效率更高', '学习类网站最重要的是信息架构稳定', '参考图更适合迁移视觉语言，而不是照搬内容结构'],
    nextSteps: ['补充项目详情页和知识详情页', '接入 MDX 内容系统', '继续细化首页和详情页视觉'],
  },
  {
    id: 'project-2',
    slug: 'react-dashboard-practice',
    title: 'React 仪表盘练习',
    summary: '通过拆解和复现专业界面，提升布局与组件组织能力。',
    status: 'completed',
    tags: ['React', 'Dashboard', 'Design'],
    period: '2026.02',
    href: '/projects/react-dashboard-practice',
    content: `## 项目背景\n\n这个练习项目的目标是提升对复杂界面结构和卡片层级的判断能力。\n\n## 结果\n\n最终做出了一版较完整的深色仪表盘页面，并沉淀出一套自己的拆解方法。`,
    outcomes: ['完成多个页面临摹实验', '沉淀一组卡片层级和布局观察方法'],
    lessons: ['好的暗色界面靠层次，不靠过度装饰', '做练习项目时复盘比截图更重要'],
    nextSteps: ['把经验迁移到长期学习站项目里'],
  },
];
