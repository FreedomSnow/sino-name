// Google OAuth 配置
export const TOKEN_CONFIG = {
    // 后端服务配置
    BACKEND: {
        // 后端服务基础 URL
        BASE_URL: 'http://localhost:3001',
        
        // API 端点
        ENDPOINTS: {
            // 根路径
            ROOT: '/',
            // 自定义命名端点
            LOGOUT: '/api/auth/logout',
            REFRESH_TOKEN: '/api/auth/refresh',
        }
    },
};