# Sino-Name 项目

## 项目简介
Sino-Name 是一个中文起名应用，支持Google OAuth登录。项目采用自定义OAuth实现，提供完整的认证流程和用户管理功能。

## 技术栈
- **前端**: Next.js 15.4.5 + React 19.1.0 + TypeScript
- **认证**: 自定义Google OAuth 2.0实现
- **状态管理**: React Hooks + Context API
- **样式**: Tailwind CSS + 自定义CSS
- **国际化**: react-i18next

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装和运行
```bash
# 克隆项目
git clone https://github.com/dujiepeng/sino-name.git
cd sino-name

# 安装依赖
npm install

# 配置环境变量
cp env.example .env
# 编辑 .env 文件，填入你的配置

# 启动开发服务器
npm run dev

# 应用将在 http://localhost:3000 运行
```

## 🔐 OAuth认证系统

### 系统架构
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   前端      │    │   后端      │    │   Google   │
│ (端口3000)  │◄──►│ (端口3001)  │◄──►│   OAuth    │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 完整认证流程

1. **用户发起登录**
   - 点击登录按钮
   - 前端调用 `useAuth.login()` 函数

2. **后端生成OAuth URL**
   - 发送 `POST /api/auth/signin/google` 请求
   - 后端生成CSRF保护的state参数
   - 构建Google OAuth授权URL
   - 设置state cookie

3. **Google授权**
   - 重定向到Google OAuth页面
   - 用户输入Google账号密码
   - 确认应用授权

4. **OAuth回调处理**
   - Google重定向到后端回调地址
   - 携带授权码(code)和state参数
   - 后端验证state参数防止CSRF攻击
   - 使用授权码换取访问令牌

5. **获取用户信息**
   - 使用access_token调用Google API
   - 获取用户基本信息(姓名、邮箱、头像)
   - 创建用户会话数据
   - 设置HttpOnly Cookie

6. **重定向到成功页面**
   - 后端重定向到前端成功页面
   - URL中包含编码的用户信息
   - 2秒后自动跳转回首页

7. **状态同步**
   - 首页useAuth Hook自动检查登录状态
   - 调用 `GET /api/auth/user` 接口
   - 更新UI状态，显示用户头像和登出按钮

## 🔌 API接口文档

### 认证接口

#### 1. 登录接口
```bash
POST /api/auth/signin/google
```
**功能**: 启动Google OAuth登录流程
**请求体**: `{}`
**响应**:
```json
{
  "success": true,
  "redirectUrl": "https://accounts.google.com/oauth/authorize?...",
  "message": "OAuth授权URL已生成"
}
```

#### 2. 用户信息接口
```bash
GET /api/auth/user
```
**功能**: 获取当前登录用户信息
**请求头**: `Cookie: user_session=SESSION_COOKIE_VALUE`
**响应**:
```json
{
  "success": true,
  "user": {
    "id": "123456789",
    "name": "张三",
    "email": "zhangsan@gmail.com",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

#### 3. 登出接口
```bash
POST /api/auth/logout
```
**功能**: 用户登出，清除会话
**响应**:
```json
{
  "success": true,
  "message": "登出成功"
}
```

#### 4. OAuth错误信息接口
```bash
GET /api/auth/oauth-error?error=ERROR_TYPE&message=ERROR_DESC
```
**功能**: 获取OAuth错误详细信息和解决建议

### 页面路由

- `/` - 首页（根据登录状态显示不同内容）
- `/oauth-success` - OAuth成功页面
- `/oauth-error` - OAuth错误页面
- `/oauth-debug` - OAuth调试页面
- `/test-auth` - 认证测试页面

## 🔒 安全机制

### CSRF保护
- 使用随机生成的state参数
- 验证回调中的state与cookie中的state是否匹配
- state cookie设置为HttpOnly和SameSite=Lax

### 会话安全
- 用户会话存储在HttpOnly Cookie中
- Cookie数据使用Base64编码
- 设置合理的过期时间
- 支持SameSite=Lax防止CSRF

### 环境变量保护
- 敏感信息存储在.env文件中
- .env文件被.gitignore忽略
- 提供env.example作为配置模板

## ⚙️ 环境配置

### 环境变量配置

创建 `.env` 文件:
```bash
# ==================== Google OAuth配置 ====================
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ==================== NextAuth配置 ====================
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret

# ==================== 前端配置 ====================
FRONTEND_BASE_URL=http://localhost:3000

# ==================== 其他配置 ====================
NODE_ENV=development
```

### Google Console配置

1. **授权重定向URI**: `http://localhost:3001/api/auth/callback/google`
2. **JavaScript来源**: `http://localhost:3000`
3. **应用状态**: 测试模式

## 🧪 测试和调试

### 运行测试脚本
```bash
# 执行完整API测试
./test-oauth-apis.sh

# 手动测试登录
curl -X POST http://localhost:3000/api/auth/signin/google \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 调试页面
访问 `/oauth-debug` 页面来诊断OAuth问题：
- 查看URL参数
- 检查浏览器信息
- 测试OAuth流程
- 收集调试信息

### 检查服务状态
```bash
# 前端服务
curl -s -o /dev/null -w "前端: %{http_code}\n" http://localhost:3000

# 后端服务
curl -s -o /dev/null -w "后端: %{http_code}\n" http://localhost:3001
```

## 🚨 错误处理

### 常见错误类型

| 错误代码 | 错误描述 | 解决方案 |
|----------|----------|----------|
| `invalid_grant` | 授权码已过期或无效 | 重新登录 |
| `access_denied` | 用户拒绝授权 | 重新授权 |
| `redirect_uri_mismatch` | 重定向URI不匹配 | 检查Google Console配置 |
| `invalid_client` | 客户端配置错误 | 检查环境变量 |
| `server_error` | 服务器内部错误 | 稍后重试 |

### 错误页面流程
```
OAuth错误 → 后端错误处理 → 重定向到/oauth-error → 显示错误信息 → 提供解决建议
```

## 📱 前端集成

### useAuth Hook使用

```typescript
import { useAuth } from '../hooks/useAuth';

const { user, loading, error, login, logout, isAuthenticated } = useAuth();

// 登录
const handleLogin = () => {
  login();
};

// 登出
const handleLogout = () => {
  logout();
};

// 显示用户信息
{isAuthenticated && user && (
  <div>
    <img src={user.picture} alt={user.name} />
    <span>{user.name}</span>
    <button onClick={handleLogout}>登出</button>
  </div>
)}
```

### 组件状态管理
- 使用 `useTransition` 避免渲染错误
- 安全的导航函数包装所有路由跳转
- 自动的认证状态检查和同步

## 🏗️ 项目结构

```
sino-name/
├── src/
│   ├── app/                    # App Router 页面
│   │   ├── features/          # 功能模块
│   │   │   ├── login/        # 登录组件
│   │   │   ├── oauth-success/ # OAuth成功页面
│   │   │   ├── oauth-error/   # OAuth错误页面
│   │   │   └── oauth-failed/  # OAuth失败页面
│   │   ├── oauth-debug/       # OAuth调试页面
│   │   ├── test-auth/         # 认证测试页面
│   │   └── ...
│   ├── pages/                 # Pages Router API
│   │   └── api/
│   │       └── auth/         # 认证API端点
│   ├── hooks/                 # 自定义Hooks
│   │   └── useAuth.ts        # 认证状态管理Hook
│   ├── components/            # 可复用组件
│   │   └── GoogleLoginButton.tsx # Google登录按钮
│   └── ...
├── scripts/                   # 工具脚本
│   └── test-oauth-apis.sh    # OAuth API测试脚本
├── docs/                      # 文档
│   ├── OAUTH_FLOW_DOCUMENTATION.md # OAuth流程完整文档
│   ├── OAUTH_FLOW_DIAGRAM.md      # OAuth流程图
│   └── OAUTH_QUICK_REFERENCE.md   # OAuth快速参考
├── .env.example              # 环境变量配置模板
└── README.md                 # 项目说明文档
```

## 📚 相关文档

- [项目概览](./docs/PROJECT_OVERVIEW.md)
- [开发指南](./docs/DEVELOPMENT_GUIDE.md)
- [OAuth技术指南](./docs/OAUTH_TECHNICAL_GUIDE.md)
- [API测试脚本](./scripts/test-oauth-apis.sh)

## 🚀 部署

### 生产环境注意事项

1. **HTTPS**: 必须使用HTTPS协议
2. **域名**: 确保域名配置正确
3. **Cookie**: 设置适当的Cookie安全属性
4. **日志**: 启用错误日志记录
5. **环境变量**: 更新生产环境的配置值

### 构建和启动
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 🔧 故障排除

### 常见问题

1. **服务无法启动**: 检查端口占用和依赖安装
2. **OAuth失败**: 验证Google Console配置
3. **水合错误**: 检查国际化配置和状态管理
4. **Cookie问题**: 确认域名和HTTPS配置

### 获取帮助

1. 查看浏览器控制台错误
2. 检查后端服务日志
3. 运行测试脚本诊断问题
4. 使用调试页面收集信息
5. 联系开发团队

## 📝 更新日志

- **v1.3.0**: 完善OAuth文档和测试用例
- **v1.2.0**: 优化安全机制和用户体验
- **v1.1.0**: 添加错误处理和用户状态管理
- **v1.0.0**: 初始OAuth实现

## 📄 许可证

本项目采用 MIT 许可证。

---
