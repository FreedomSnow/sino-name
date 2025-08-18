# Sino-Name 开发指南

## 🚀 开发环境搭建

### 系统要求

- **Node.js**: 18.0.0 或更高版本
- **npm**: 8.0.0 或更高版本（或使用 yarn）
- **Git**: 2.20.0 或更高版本
- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

### 环境检查

```bash
# 检查Node.js版本
node --version

# 检查npm版本
npm --version

# 检查Git版本
git --version
```

### 项目克隆

```bash
# 克隆项目
git clone https://github.com/dujiepeng/sino-name.git

# 进入项目目录
cd sino-name

# 检查当前分支
git branch -a
```

## 📦 依赖安装

### 安装项目依赖

```bash
# 安装所有依赖
npm install

# 或者使用yarn
yarn install
```

### 依赖说明

主要依赖包包括：

- **Next.js 15.4.5**: React SSR框架
- **React 19.1.0**: 用户界面库
- **TypeScript**: 类型安全的JavaScript
- **Tailwind CSS**: 实用优先的CSS框架
- **react-i18next**: 国际化支持

## ⚙️ 环境配置

### 环境变量设置

1. **复制配置模板**
```bash
cp env.example .env
```

2. **编辑环境变量**
```bash
# 使用你喜欢的编辑器
vim .env
# 或者
code .env
```

3. **配置必要变量**
```bash
# Google OAuth配置
GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_client_secret

# NextAuth配置
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secure_secret

# 前端配置
FRONTEND_BASE_URL=http://localhost:3000

# 环境配置
NODE_ENV=development
```

### Google OAuth配置

1. **访问Google Cloud Console**
   - 前往 [Google Cloud Console](https://console.cloud.google.com/)
   - 创建新项目或选择现有项目

2. **启用OAuth 2.0 API**
   - 在"API和服务"中启用"Google+ API"
   - 或者 Google Identity API

3. **创建OAuth 2.0客户端ID**
   - 在"凭据"中创建OAuth 2. stalled
   - 应用类型选择"Web应用"
   - 授权重定向URI设置为：`http://localhost:3001/api/auth/callback/google`
   - JavaScript来源设置为：`http://localhost:3000`

4. **获取凭据**
   - 复制客户端ID和客户端密钥
   - 更新到 `.env` 文件中

## 🏃‍♂️ 启动开发服务器

### 前端服务

```bash
# 启动前端开发服务器（端口3000）
npm run dev
```

### 后端服务

```bash
# 进入后端项目目录
cd ../braveray-backend

# 启动后端服务（端口3001）
npm run dev
```

### 验证服务状态

```bash
# 检查前端服务
curl -s -o /dev/null -w "前端: %{http_code}\n" http://localhost:3000

# 检查后端服务
curl -s -o /dev/null -w "后端: %{http_code}\n" http://localhost:3001
```

## 🧪 测试和调试

### 运行测试脚本

```bash
# 给测试脚本添加执行权限
chmod +x test-oauth-apis.sh

# 运行完整API测试
./test-oauth-apis.sh
```

### 手动测试

```bash
# 测试登录接口
curl -X POST http://localhost:3000/api/auth/signin/google \
  -H "Content-Type: application/json" \
  -d '{}'

# 测试用户信息接口
curl -X GET http://localhost:3000/api/auth/user

# 测试登出接口
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 调试页面

访问以下页面进行调试：

- **OAuth调试**: `http://localhost:3000/oauth-debug`
- **认证测试**: `http://localhost:3000/test-auth`
- **OAuth成功**: `http://localhost:3000/oauth-success`
- **OAuth错误**: `http://localhost:3000/oauth-error`

## 🔧 开发工具

### 代码编辑器配置

推荐使用 **VS Code** 并安装以下扩展：

- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Tailwind CSS IntelliSense**
- **ESLint**
- **Prettier**

### VS Code 设置

在项目根目录创建 `.vscode/settings.json`：

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

### 代码质量工具

1. **ESLint**: 代码质量检查
2. **Prettier**: 代码格式化
3. **TypeScript**: 类型检查

```bash
# 运行代码检查
npm run lint

# 运行类型检查
npm run type-check

# 格式化代码
npm run format
```

## 📁 项目结构

### 目录组织

```
sino-name/
├── src/                          # 源代码
│   ├── app/                     # App Router页面
│   │   ├── features/           # 功能模块
│   │   ├── oauth-*/            # OAuth相关页面
│   │   └── ...
│   ├── pages/                  # Pages Router API
│   │   └── api/auth/           # 认证API
│   ├── hooks/                  # 自定义Hooks
│   ├── components/             # 可复用组件
│   └── types/                  # TypeScript类型定义
├── docs/                       # 项目文档
├── scripts/                    # 工具脚本
├── public/                     # 静态资源
└── ...
```

### 文件命名规范

- **组件文件**: PascalCase (如 `GoogleLoginButton.tsx`)
- **Hook文件**: camelCase (如 `useAuth.ts`)
- **工具文件**: kebab-case (如 `test-oauth-apis.sh`)
- **页面文件**: 使用Next.js约定 (如 `page.tsx`)

## 🔐 OAuth开发流程

### 开发阶段

1. **环境配置**
   - 设置Google OAuth凭据
   - 配置环境变量
   - 启动前后端服务

2. **功能开发**
   - 实现OAuth登录流程
   - 添加用户状态管理
   - 实现错误处理

3. **测试验证**
   - 运行测试脚本
   - 手动测试OAuth流程
   - 检查错误处理

4. **调试优化**
   - 使用调试页面
   - 查看控制台日志
   - 优化用户体验

### 调试技巧

1. **浏览器开发者工具**
   - Network面板监控API请求
   - Console面板查看错误信息
   - Application面板检查Cookie

2. **服务端日志**
   - 查看后端服务日志
   - 检查OAuth回调处理
   - 验证状态参数

3. **状态检查**
   - 使用 `/oauth-debug` 页面
   - 检查认证状态
   - 验证重定向流程

## 🚨 常见问题解决

### 开发环境问题

1. **端口冲突**
```bash
# 检查端口占用
lsof -i :3000
lsof -i :3001

# 杀死占用进程
kill -9 <PID>
```

2. **依赖安装失败**
```bash
# 清除缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

3. **环境变量不生效**
```bash
# 重启开发服务器
npm run dev

# 检查.env文件格式
cat .env
```

### OAuth相关问题

1. **重定向URI不匹配**
   - 检查Google Console配置
   - 确认端口号正确
   - 验证协议(http/https)

2. **状态验证失败**
   - 检查Cookie设置
   - 验证state参数
   - 清除浏览器缓存

3. **授权码过期**
   - 重新发起登录
   - 检查系统时间
   - 验证OAuth配置

## 📝 代码提交规范

### Git工作流

1. **创建功能分支**
```bash
git checkout -b feature/oauth-improvement
```

2. **提交代码**
```bash
git add .
git commit -m "feat: 改进OAuth错误处理机制"
```

3. **推送分支**
```bash
git push origin feature/oauth-improvement
```

### 提交信息格式

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整
- **refactor**: 代码重构
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动

### 代码审查

1. **创建Pull Request**
2. **添加详细描述**
3. **关联相关Issue**
4. **等待代码审查**
5. **合并到主分支**

## 🔮 性能优化

### 开发阶段优化

1. **代码分割**
   - 使用动态导入
   - 实现懒加载
   - 优化包大小

2. **缓存策略**
   - 实现适当的缓存
   - 优化API调用
   - 减少重复请求

3. **渲染优化**
   - 使用React.memo
   - 优化useEffect依赖
   - 避免不必要的重渲染

### 生产环境优化

1. **构建优化**
   - 启用代码压缩
   - 实现Tree Shaking
   - 优化资源加载

2. **运行时优化**
   - 监控性能指标
   - 优化关键路径
   - 实现错误边界

## 📚 学习资源

### 官方文档

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [OAuth 2.0 RFC](https://tools.ietf.org/html/rfc6749)

### 相关技术

- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hooks](https://react.dev/reference/react)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

---

*本开发指南提供了Sino-Name项目的完整开发流程，帮助开发者快速上手并高效开发。*
