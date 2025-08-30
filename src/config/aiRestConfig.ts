// Google OAuth 配置
export const AI_REST_CONFIG = {
    // 后端服务配置
    BACKEND: {
        // 后端服务基础 URL
        BASE_URL: 'http://localhost:3001',
        
        // API 端点
        ENDPOINTS: {
            // 根路径
            ROOT: '/',
            // 自定义命名端点
            CUSTOM_NAMING: '/api/ai/naming/freedom-name',
            // 生成姓氏端点
            LAST_NAMING: '/api/ai/naming/family-name',
        }
    },
};