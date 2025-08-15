# Sino-Name 项目

## 项目简介
Sino-Name 是一个中文起名应用，支持Google OAuth登录。

## 技术栈
- Next.js 15.4.5
- React 19.1.0
- NextAuth.js 4.24.11
- TypeScript
- Tailwind CSS

## 登录功能说明

### Google OAuth 登录流程

1. **用户点击登录按钮**
   - 前端发送 `POST /api/auth/signin/google` 请求（后端兼容接口）
   - 后端处理OAuth启动流程并返回重定向URL

2. **Google授权页面**
   - 用户被重定向到Google授权页面
   - 用户授权后，Google重定向回 `/api/auth/callback/google`

3. **登录成功处理**
   - NextAuth.js 处理回调并创建用户会话
   - 重定向到 `/oauth-success` 页面
   - 显示登录成功信息

4. **登录失败处理**
   - 如果登录失败，重定向到 `/oauth-failed` 页面
   - 显示错误信息和重试选项

### OAuth路径说明

- **登录入口**: `POST /api/auth/signin/google` (后端兼容接口)
- **回调地址**: `/api/auth/callback/google` (NextAuth自动处理)
- **调试页面**: `/oauth-debug` (用于诊断OAuth问题)

### 兼容接口使用方式

```javascript
// 使用fetch POST请求启动OAuth流程
const response = await fetch('/api/auth/signin/google', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 检查重定向
if (response.redirected) {
  // 重定向到 Google OAuth 页面
  window.location.href = response.url;
} else {
  // 处理错误
  const error = await response.json();
  console.error('OAuth 启动失败:', error);
}
```

### 环境变量配置

复制 `env.example` 为 `.env` 并配置以下变量：

```bash
# Google OAuth配置
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# 环境配置
NODE_ENV=development
```

### Google Cloud Console 配置

在Google Cloud Console中设置OAuth 2.0客户端：

1. 创建OAuth 2.0客户端ID
2. 设置授权重定向URI：`http://localhost:3000/api/auth/callback/google`
3. 获取客户端ID和客户端密钥
4. **重要**: 确保OAuth客户端支持PKCE (Proof Key for Code Exchange)

### 开发环境运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 应用将在 http://localhost:3000 运行
```

### 生产环境构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 故障排除

### 常见OAuth错误

#### 1. "Missing code verifier" 错误
**错误信息**: `TokenError: Missing code verifier`

**原因**: OAuth流程中缺少PKCE (Proof Key for Code Exchange) 参数

**解决方案**:
- 确保NextAuth配置中启用了PKCE
- 检查Google OAuth客户端配置是否正确
- 清除浏览器cookies和缓存
- 使用 `/oauth-debug` 页面测试OAuth流程

#### 2. "state_mismatch" 错误
**错误信息**: `error=state_mismatch&details={"cookieState":"undefined","cookieExists":false}`

**原因**: OAuth状态验证失败，通常是因为cookies配置问题

**解决方案**:
- 检查NextAuth的cookies配置
- 确保浏览器支持cookies
- 清除浏览器cookies和缓存
- 检查域名和端口配置是否正确
- 如果使用HTTPS，确保cookies的secure选项配置正确

#### 3. "invalid_grant" 错误
**错误信息**: `code: "invalid_grant"`

**原因**: 授权码无效或已过期

**解决方案**:
- 重新尝试登录
- 检查重定向URI配置是否正确
- 确保Google OAuth客户端配置正确

#### 4. 重定向循环
**现象**: 页面在登录和回调之间无限循环

**解决方案**:
- 检查 `NEXTAUTH_URL` 配置
- 验证重定向URI设置
- 清除浏览器状态

#### 5. OAuth启动失败
**错误信息**: `OAuth 启动失败`

**原因**: 兼容接口调用失败

**解决方案**:
- 检查网络连接
- 验证API端点是否正确
- 检查请求方法是否为POST
- 查看浏览器控制台错误信息

### 调试工具

访问 `/oauth-debug` 页面来诊断OAuth问题：
- 查看URL参数
- 检查浏览器信息
- 测试OAuth流程
- 收集调试信息

### Cookies配置说明

NextAuth.js 使用以下cookies来管理OAuth状态：
- `next-auth.session-token`: 会话令牌
- `next-auth.callback-url`: 回调URL
- `next-auth.csrf-token`: CSRF保护令牌
- `next-auth.pkce.code_verifier`: PKCE验证码

确保这些cookies能够正常设置和读取。

## 项目结构

```
src/
├── app/                    # App Router 页面
│   ├── features/          # 功能模块
│   │   ├── login/        # 登录组件
│   │   ├── oauth-success/ # OAuth成功页面
│   │   ├── oauth-failed/  # OAuth失败页面
│   │   └── oauth-debug/   # OAuth调试页面
│   └── ...
├── pages/                 # Pages Router API
│   └── api/
│       └── auth/         # NextAuth API端点
└── ...
```

## 注意事项

1. 确保Google OAuth重定向URI配置正确
2. 开发环境使用端口3000
3. 生产环境需要更新NEXTAUTH_URL和Google OAuth重定向URI
4. 保持NEXTAUTH_SECRET的安全性
5. 使用POST请求调用 `/api/auth/signin/google` 兼容接口
6. 启用PKCE安全机制防止授权码拦截攻击
7. 如果遇到OAuth问题，使用 `/oauth-debug` 页面进行诊断
8. 确保cookies配置正确，特别是开发环境中的状态管理
9. 兼容接口支持fetch POST请求，确保请求方法正确
