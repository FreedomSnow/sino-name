// Google OAuth 配置
export const GOOGLE_AUTH_CONFIG = {
  // 后端服务配置
  BACKEND: {
    // 后端服务基础 URL
    BASE_URL: "http://localhost:3001",

    // API 端点
    ENDPOINTS: {
      // Google ID Token 验证端点
      TOKEN_SIGNIN: "/api/auth/google/signin",
      // 用户信息获取
      USER_INFO: "/api/auth/userinfo",
      // 健康检查
      HEALTH: "/api/auth/health",
      // 根路径
      ROOT: "/",
    },
  },

  // Google OAuth 配置
  GOOGLE: {
    // 客户端 ID
    CLIENT_ID:
      "870125620293-6el78c2lakbs8t8l2bnoc581qihrv9bh.apps.googleusercontent.com",
    // 请求的作用域
    SCOPES: ["profile", "email"],
  },
};
