# Personal Learning System Template

一个面向长期学习者的个人学习系统模板。它不是普通博客，而是把 **Logs / Notes / Projects** 串成一个闭环：

- **Logs**：记录学习过程
- **Notes**：沉淀知识结构
- **Projects**：验证实践输出

目标不是把内容堆满，而是让学习变成可以被找回、被连接、被展示、被持续推进的个人资产。

## 适合谁

适合这些人：

- 正在长期学习 AI、编程、英语、设计或其他技能
- 想把学习过程公开记录下来
- 不满足于普通博客，只展示结果不展示过程
- 想做一个能长期积累的个人成长网站

## 这个模板解决什么问题

很多人的学习记录是分裂的：

- 过程写在日记里
- 知识点散在笔记里
- 项目在 GitHub 里

最后没有形成真正的系统。

这个模板把它们重新组织成三层：

1. **日志（Logs）**：今天学了什么、卡在哪里、下一步做什么
2. **知识卡片（Notes）**：把高频概念、方法和结构沉淀成可复用内容
3. **项目实践（Projects）**：用真实输出验证自己是不是学会了

## 快速开始

```bash
npm install
npm run dev
```

默认访问：<http://localhost:3004>

## 复制后先做这三步

### 1. 改站点信息
编辑：`src/data/site.ts`

建议先改这些字段：

- `name`
- `tagline`
- `productTagline`
- `description`
- `siteUrl`
- `author`
- `audience`

### 2. 写第一条内容
内容都在：

- `content/logs`
- `content/notes`
- `content/projects`

也可以直接打开站内的 **/studio** 页面，在页面里新增日志和知识卡片。

### 3. 替换示例内容
如果你不想保留示例内容，可以把内容目录里的示例文件删掉，再换成自己的。

## 模板文件

仓库里提供了三种模板：

- `templates/log-template.mdx`
- `templates/note-template.mdx`
- `templates/project-template.mdx`

你可以直接复制这些模板来写第一条内容。

## 内容创建脚本

如果你不想手动复制模板，可以直接运行：

```bash
npm run new:log
npm run new:note
npm run new:project
```

脚本会询问标题（日志还会询问日期），然后自动在对应目录下创建文件。

## 项目结构

- `src/app`：页面与路由
- `src/components`：UI 组件
- `src/data`：站点配置与静态数据
- `src/lib`：内容读取与 Studio 辅助逻辑
- `content/logs`：学习日志
- `content/notes`：知识卡片
- `content/projects`：项目实践
- `templates`：内容模板文件

## 当前已具备

- 首页时间线与学习总览
- 学习日志列表/详情
- 知识库列表/详情
- 项目列表/详情
- About 页面
- Studio 页面（支持直接新增日志、知识卡片）
- sitemap / robots / 基础 metadata

## 推荐部署

### Vercel（推荐）

1. 把项目推到 GitHub
2. 在 Vercel 导入仓库
3. 使用默认 Next.js 配置部署
4. 部署后把 `src/data/site.ts` 里的 `siteUrl` 改成真实域名

## 下一步建议

如果你准备把它真的做成自己的长期学习系统，建议优先做：

- 替换示例文案和 About 页面内容
- 写 3 条日志
- 写 3 张知识卡片
- 放 1 个项目实践
- 补 favicon / OG 图

这样站点会很快从“模板”变成“你自己的成长界面”。
