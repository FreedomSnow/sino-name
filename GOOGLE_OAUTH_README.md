# Google OAuth 直接集成说明

## 概述
本项目已移除NextAuth依赖，改为直接调用Google OAuth API实现用户认证。

## API端点

### 1. 登录入口
- **URL**: `/api/auth/google/login`
- **方法**: GET
- **功能**: 重定向用户到Google授权页面

### 2. OAuth回调处理
- **URL**: `/api/auth/google/callback`
- **方法**: GET
- **功能**: 处理Google授权回调，获取用户信息并创建session

### 3. 获取当前用户
- **URL**: `/api/auth/user`
- **方法**: GET
- **功能**: 获取当前登录用户信息

### 4. 登出
- **URL**: `/api/auth/logout`
- **方法**: POST
- **功能**: 清除用户session并登出

## 使用方法

### 前端组件
```tsx
import { GoogleLoginButton } from '@/components/GoogleLoginButton';
import { useAuth } from '@/hooks/useAuth';

// 登录按钮
<GoogleLoginButton />

// 使用认证状态
const { user, loading, logout } = useAuth();
```

### 环境变量配置
确保在`.env`文件中配置：
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
```

## 安全特性
- 使用state参数防止CSRF攻击
- HttpOnly cookie存储session数据
- 自动session过期检查
- 安全的OAuth流程

## 优势
1. **无依赖**: 不依赖第三方认证库
2. **轻量级**: 代码更简洁，性能更好
3. **完全控制**: 可以自定义所有认证逻辑
4. **易于调试**: 问题定位更简单
5. **兼容性好**: 与Next.js 15完全兼容

## 注意事项
- 确保Google OAuth客户端配置正确的重定向URI
- 生产环境需要配置HTTPS
- 定期清理过期的session数据
