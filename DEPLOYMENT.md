# 部署指南

## 环境变量安全配置

### 开发环境
- 使用 `.env.local` 文件（已加入 .gitignore）
- 包含测试用的 OAuth 凭据

### 生产环境
**重要：永远不要将生产环境的 Client Secret 提交到代码仓库！**

#### 1. Vercel 部署（推荐）
在 Vercel 项目设置中配置环境变量：
```
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
APPLE_CLIENT_ID=your_production_apple_client_id
APPLE_CLIENT_SECRET=your_production_apple_client_secret
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com
```

#### 2. 其他平台
- **Netlify**: 在 Environment Variables 中设置
- **Railway**: 在 Variables 标签页中设置
- **Heroku**: 使用 `heroku config:set` 命令
- **Docker**: 通过环境变量文件或 docker-compose.yml

#### 3. 传统服务器
```bash
# 在服务器上设置环境变量
export GOOGLE_CLIENT_ID=your_production_client_id
export GOOGLE_CLIENT_SECRET=your_production_client_secret
export NEXTAUTH_SECRET=your_production_secret
export NEXTAUTH_URL=https://yourdomain.com
```

## 安全检查清单

- [ ] 生产环境的 Client Secret 未提交到 git
- [ ] 使用 HTTPS 协议
- [ ] 配置了正确的重定向 URI
- [ ] 定期轮换 Client Secret
- [ ] 使用强密码生成器生成 NEXTAUTH_SECRET

## 生成安全的 NEXTAUTH_SECRET

```bash
# 使用 openssl 生成
openssl rand -base64 32

# 或使用在线生成器
# https://generate-secret.vercel.app/32
```
