# Personal Learning System Template

把 **Logs / Notes / Projects** 串起来的个人学习系统模板。

它不是普通博客，也不是单纯笔记仓库。它更像一个面向长期学习者的成长操作界面，用来把：

- 学习过程
- 知识沉淀
- 项目实践

整理成可持续积累、可分享、可复盘的个人资产。

## 这是什么

这个模板的核心不是“发文章”，而是建立学习闭环：

- **Logs**：记录今天学了什么、卡在哪里、下一步做什么
- **Notes**：把高频概念、方法和结构沉淀成可复用卡片
- **Projects**：用真实输出验证自己是不是学会了

如果你总觉得自己学了很多，但内容散落在各个工具里，这个模板就是把它们重新收拢成系统的一种方式。

## 适合谁

适合这些人：

- 正在长期学习 AI、编程、英语、设计或其他技能
- 想公开记录自己的学习过程
- 觉得普通博客只能展示结果，不适合展示成长轨迹
- 想做一个长期维护的个人学习主页

## 不太适合谁

如果你现在需要的是：

- 在线多人协作 CMS
- 零代码网站搭建器
- 富文本可视化后台
- 社区型产品

那这个模板暂时不是最合适的选择。

它更适合愿意用 GitHub / Vercel / MDX 维护自己学习站的人。

## 快速开始

```bash
npm install
npm run dev
```

默认访问：<http://localhost:3004>

## 复制后先做这三步

### 1. 修改站点基础信息
编辑：`src/data/site.ts`

优先改这些：

- `name`
- `tagline`
- `productTagline`
- `description`
- `siteUrl`
- `author`
- `audience`

### 2. 写你的第一条内容
内容目录：

- `content/logs`
- `content/notes`
- `content/projects`

你也可以直接打开 **/studio** 页面，在页面里新增内容。

### 3. 替换默认文案
把这些地方改成你自己的：

- `src/data/about.ts`
- `src/data/current-learning.ts`
- `content/` 里的示例内容

## 内容创建方式

### 方式 A：直接复制模板文件
仓库里提供了三种模板：

- `templates/log-template.mdx`
- `templates/note-template.mdx`
- `templates/project-template.mdx`

### 方式 B：使用命令行脚本

```bash
npm run new:log
npm run new:note
npm run new:project
```

脚本会询问标题，日志还会询问日期，然后自动在对应目录下创建文件。

### 方式 C：使用 Studio 页面
Studio 里已经支持直接创建：

- 学习日志
- 知识卡片
- 项目实践
- 当前在学模块编辑

## 模板当前已经具备

- 首页学习系统展示
- 学习日志列表 / 详情
- 知识卡片列表 / 详情
- 项目实践列表 / 详情
- About 页面
- Studio 页面
- sitemap / robots / metadata
- 默认 OG 分享图
- 内容模板文件
- 内容创建脚本
- 内容字段校验

## 项目结构

- `src/app`：页面与路由
- `src/components`：UI 组件
- `src/data`：站点配置与静态数据
- `src/lib`：内容读取与模板辅助逻辑
- `content/logs`：学习日志
- `content/notes`：知识卡片
- `content/projects`：项目实践
- `templates`：内容模板文件
- `scripts`：命令行辅助脚本

## 推荐部署

### Vercel（推荐）

1. 将项目推送到 GitHub
2. 在 Vercel 导入仓库
3. 使用默认 Next.js 构建配置部署
4. 部署后回到 `src/data/site.ts`，把 `siteUrl` 改成你的正式域名

## 发布准备文件

仓库里已经准备了一组首发辅助文件：

- `PUBLISH_CHECKLIST.md`
- `LAUNCH_COPY_DRAFT.md`
- `LAUNCH_EXECUTION_PLAN.md`
- `DEMO_ASSETS_CHECKLIST.md`
- `SCREENSHOT_SHOTLIST.md`
- `REPO_SETUP_GUIDE.md`
- `GITHUB_RELEASE_TEMPLATE.md`
- `FINAL_LAUNCH_RUNBOOK.md`
- `RELEASE_NOTES_v0.1.md`

如果你准备第一次公开发布，建议按这些文件的顺序走一遍。

## 上线前检查清单

建议在正式分享前确认：

- [ ] `siteUrl` 已改成正式域名
- [ ] 首页文案已替换成自己的定位
- [ ] `about.ts` 已替换成自己的背景与方向
- [ ] 至少有 3 条日志
- [ ] 至少有 3 张知识卡片
- [ ] 至少有 1 个项目实践
- [ ] 检查过 `/studio`、`/logs`、`/notes`、`/projects`
- [ ] 跑过 `npm run build`

## 推荐的第一批内容

如果你刚复制这个模板，不知道从哪开始，建议先写：

1. 一条“我为什么要搭这个学习站”的日志
2. 一张“我现在最重要的学习主题是什么”的知识卡片
3. 一个最小项目，哪怕只是很小的练习产出

这样首页很快就会从“模板”变成“你的成长界面”。

## 产品定位一句话

> 这不是普通博客模板，而是一套把学习日志、知识卡片和项目实践串起来的个人学习系统模板。
