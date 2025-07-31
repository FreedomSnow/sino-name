
# sino-name

本项目基于 Next.js（TypeScript + Tailwind CSS）构建，支持高性能、良好兼容性，具备以下特性：

- 支持 GIF 动画和视频展示
- 可集成 AI 接口（如 DeepSeek、ChatGPT）
- 现代化前端架构，便于扩展

## 启动开发环境

```bash
npm run dev
```

## 构建生产环境

```bash
npm run build
```

## 目录结构
- `src/` 主要源码目录
- `app/` Next.js App Router 入口
- `public/` 静态资源（可放置 gif、视频等）

## 后续开发建议
- 在 `public` 目录添加 gif 或视频文件，通过 `<img>` 或 `<video>` 标签展示
- 在 `src/app` 下开发页面，集成 AI 接口可参考 OpenAI/DeepSeek 官方文档

---
如需进一步定制或功能开发，请补充需求。
