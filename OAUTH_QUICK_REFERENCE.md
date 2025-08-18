# OAuth认证快速参考卡片

## 🚀 快速启动

### 启动服务
```bash
# 前端服务 (端口3000)
npm run dev

# 后端服务 (端口3001)
cd ../braveray-backend
npm run dev
```

### 环境变量配置
```bash
# 复制配置模板
cp env.example .env

# 编辑配置
vim .env
```

## 🔑 核心API接口

### 1. 登录接口
```bash
curl -X POST http://localhost:3000/api/auth/signin/google \
  -H "Content-Type: application/json" \
  -d '{}'
```

**响应示例:**
```json
{
  "success": true,
  "redirectUrl": "https://accounts.google.com/oauth/authorize?...",
  "message": "OAuth授权URL已生成"
}
```

### 2. 用户信息接口
```bash
curl -X GET http://localhost:3000/api/auth/user \
  -H "Cookie: user_session=SESSION_COOKIE_VALUE"
```

**响应示例:**
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

### 3. 登出接口
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Cookie: user_session=SESSION_COOKIE_VALUE" \
  -d '{}'
```

### 4. 错误信息接口
```bash
curl "http://localhost:3000/api/auth/oauth-error?error=invalid_grant&message=授权码已过期"
```

## 📱 前端集成

### useAuth Hook
```typescript
import { useAuth } from '../hooks/useAuth';

const { user, loading, error, login, logout, isAuthenticated } = useAuth();

// 登录
const handleLogin = () => login();

// 登出
const handleLogout = () => logout();

// 显示用户信息
{isAuthenticated && user && (
  <div>
    <img src={user.picture} alt={user.name} />
    <span>{user.name}</span>
    <button onClick={handleLogout}>登出</button>
  </div>
)}
```

### 页面路由
- `/oauth-success`: OAuth成功页面
- `/oauth-error`: OAuth错误页面
- `/`: 首页（根据登录状态显示不同内容）

## 🔒 安全配置

### Google Console配置
1. **授权重定向URI**: `http://localhost:3001/api/auth/callback/google`
2. **JavaScript来源**: `http://localhost:3000`
3. **应用状态**: 测试模式

### 环境变量
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret

# 前端
FRONTEND_BASE_URL=http://localhost:3000
```

## 🚨 错误处理

### 常见错误代码
| 错误代码 | 描述 | 解决方案 |
|----------|------|----------|
| `invalid_grant` | 授权码过期 | 重新登录 |
| `access_denied` | 用户拒绝授权 | 重新授权 |
| `redirect_uri_mismatch` | URI不匹配 | 检查Google Console |
| `invalid_client` | 客户端配置错误 | 检查环境变量 |

### 错误页面流程
```
OAuth错误 → 后端处理 → 重定向到/oauth-error → 显示错误信息 → 提供解决建议
```

## 🔍 调试和测试

### 运行测试脚本
```bash
# 执行完整API测试
./test-oauth-apis.sh

# 手动测试登录
curl -X POST http://localhost:3000/api/auth/signin/google \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 检查服务状态
```bash
# 前端服务
curl -s -o /dev/null -w "前端: %{http_code}\n" http://localhost:3000

# 后端服务
curl -s -o /dev/null -w "后端: %{http_code}\n" http://localhost:3001
```

### 浏览器调试
1. 打开开发者工具
2. 查看Network面板
3. 检查Console错误
4. 验证Cookie设置

## 📊 性能指标

### 响应时间基准
- **登录接口**: < 100ms
- **用户信息接口**: < 50ms
- **错误信息接口**: < 30ms

### 测试命令
```bash
# 性能测试
time curl -s -X POST http://localhost:3000/api/auth/signin/google \
  -H "Content-Type: application/json" \
  -d '{}' > /dev/null
```

## 🛠️ 故障排除

### 水合错误
```bash
# 检查国际化配置
cat src/app/i18n-init.ts

# 检查组件状态管理
cat src/hooks/useAuth.ts
```

### 重定向错误
```bash
# 检查环境变量
cat .env

# 验证Google Console配置
echo "确保重定向URI: $NEXTAUTH_URL/api/auth/callback/google"
```

### Cookie问题
```bash
# 检查Cookie设置
curl -v http://localhost:3000/api/auth/user

# 验证域名配置
echo "前端: $FRONTEND_BASE_URL"
echo "后端: $NEXTAUTH_URL"
```

## 📚 相关文档

- [完整OAuth流程文档](./OAUTH_FLOW_DOCUMENTATION.md)
- [OAuth流程图](./OAUTH_FLOW_DIAGRAM.md)
- [API测试脚本](./test-oauth-apis.sh)
- [环境变量配置](./env.example)

## 📞 技术支持

### 常见问题
1. **服务无法启动**: 检查端口占用和依赖安装
2. **OAuth失败**: 验证Google Console配置
3. **水合错误**: 检查国际化配置和状态管理
4. **Cookie问题**: 确认域名和HTTPS配置

### 获取帮助
1. 查看浏览器控制台错误
2. 检查后端服务日志
3. 运行测试脚本诊断问题
4. 联系开发团队

---

*最后更新: 2024年8月18日*
*版本: v1.3.0*
