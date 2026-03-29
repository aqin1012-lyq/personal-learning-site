# Personal Learning Site

一个基于 Next.js + Tailwind CSS 的个人学习记录网站，适合用于持续发布学习日志、知识条目与项目实践。

## 已包含

- 首页
- 学习日志列表页 / 详情页
- 知识库列表页 / 详情页
- 项目列表页 / 详情页
- 关于页
- 基于 `content/` 的本地 MDX 内容源
- TypeScript 类型定义
- 基础响应式布局
- 基础 SEO 元信息
- `sitemap.xml` 与 `robots.txt`

## 技术栈

- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript

## 本地启动

```bash
npm install
npm run dev
```

然后访问：

```bash
http://localhost:3000
```

## 生产构建

```bash
npm run build
npm run start
```

## 上线前必改配置

请先修改 `src/data/site.ts` 中这些字段：

- `siteUrl`：替换为你的正式域名，例如 `https://your-domain.com`
- `author`：替换为你的名字或站点署名
- `keywords`：按你的内容方向调整
- `name` / `description` / `tagline`：按站点定位微调

如果不改，站点虽然能跑，但 sitemap、robots 和 canonical 会指向占位域名。

## 推荐部署方式

### 方案 A：Vercel（推荐）

适合这个项目当前形态，最省心。

1. 将项目推送到 GitHub
2. 在 Vercel 导入仓库
3. 构建命令使用默认值：
   - Build Command: `npm run build`
   - Output: 由 Next.js 自动识别
4. 绑定正式域名
5. 回到 `src/data/site.ts`，把 `siteUrl` 改成正式域名后重新部署

### 方案 B：Cloudflare Pages

也可以部署，但对 Next.js 的兼容与配置通常没有 Vercel 省事。如果你的重点是快速稳定上线，这个项目优先选 Vercel。

## 推荐基础设施

对于这个个人内容站，推荐使用：

- **代码托管**：GitHub
- **部署**：Vercel
- **DNS / CDN / HTTPS / WAF**：Cloudflare
- **监控**：Sentry + Uptime Kuma / Better Stack
- **访问统计**：Plausible / Umami

## 目录结构

- `src/app` 页面与路由
- `src/components` UI 组件
- `src/data` 站点配置与静态数据
- `src/lib` 内容读取与工具函数
- `src/types` 类型定义
- `content/logs` 学习日志
- `content/notes` 知识条目
- `content/projects` 项目实践

## 已补的正式上线必需项

- 全站基础 metadata
- Open Graph / Twitter metadata 基础配置
- canonical 基础配置
- 自动生成 sitemap
- 自动生成 robots
- 生产构建验证

## 下一步建议

- 补 favicon / app icon / OG 图片
- 为详情页补更完整的社交分享 metadata
- 把简化 frontmatter 解析升级为更稳的 MDX 方案
- 增加 RSS
- 增加标签聚合页 / 分类聚合页
- 接入分析与错误监控
