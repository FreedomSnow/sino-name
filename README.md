
# sino-name

本项目基于 Next.js（TypeScript + Tailwind CSS）构建，支持高性能、良好兼容性，具备以下特性：

- 支持 GIF 动画和视频展示
- 可集成 AI 接口（如 DeepSeek、ChatGPT）
- 现代化前端架构，便于扩展
- 支持 Google 和 Apple OAuth 登录

## 环境变量配置

在开始开发之前，需要配置环境变量：

1. 复制 `env.example` 文件为 `.env.local`
2. 填入相应的 OAuth 配置信息：

```bash
# Google OAuth 配置
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Apple OAuth 配置
APPLE_CLIENT_ID=your_apple_client_id_here
APPLE_CLIENT_SECRET=your_apple_client_secret_here

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 获取 OAuth 凭据

- **Google OAuth**: 访问 [Google Cloud Console](https://console.cloud.google.com/) 创建 OAuth 2.0 客户端
- **Apple OAuth**: 访问 [Apple Developer](https://developer.apple.com/) 配置 Sign in with Apple

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
