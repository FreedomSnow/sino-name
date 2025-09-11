import { OAuthTokens } from '@/types/auth';
import { getCachedUserAuth, cacheUserAuth, clearCachedUserAuth, UserAuthCache } from '@/cache/cacheUserAuth';
import { APP_CONFIG } from '@/config/appConfig';
import { TOKEN_CONFIG } from '@/config/tokenConfig';

/**
 * 刷新 OAuth 令牌
 * 使用 refresh_token 获取新的 access_token
 */
export async function refreshToken(refreshToken: string): Promise<OAuthTokens | null> {
  try {
    const response = await fetch(`${TOKEN_CONFIG.BACKEND.BASE_URL}${TOKEN_CONFIG.BACKEND.ENDPOINTS.REFRESH_TOKEN}`, {
      method: 'POST',
      headers: {
        'Authorization': `${APP_CONFIG.APP.NAME} ${refreshToken}`
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('刷新令牌失败:', errorText);
      
      // 如果是401未授权，说明refresh_token已过期
      if (response.status === 401) {
        console.log('refresh_token已过期，需要重新登录');
      }
      
      return null;
    }

    const data = await response.json();
    console.log('刷新令牌响应:', data);
    if (data.success === false) {
      console.error('刷新令牌失败:', data.message);
      
      // 如果是令牌过期错误，记录详细信息
      if (data.error === 'UNAUTHORIZED' || data.message?.includes('过期')) {
        console.log('refresh_token已过期，需要重新登录');
      }
      
      return null;
    }

    const respData = data.data || {};
    // 确保 access_token 存在
    if (!respData.access_token) {
      console.error('刷新令牌响应中没有 access_token');
      return null;
    }

    // 返回新的令牌信息
    return {
      access_token: respData.access_token,
      refresh_token: refreshToken, // 保留原来的 refresh_token
      expires_in: respData.expires_in || 3600, // 默认过期时间为 1 小时
    };
  } catch (error) {
    console.error('刷新令牌出错:', error);
    return null;
  }
}

/**
 * 获取用户认证信息
 * 如果令牌有效则直接返回，如果过期则尝试刷新
 */
export async function getUserAuth(): Promise<UserAuthCache | null> {
  // 1. 获取缓存的认证信息
  const authCache = getCachedUserAuth();
  if (!authCache || !authCache.user || !authCache.tokens) {
    console.log('未登录或缺少认证信息');
    clearCachedUserAuth();
    return null;
  }

  const { user, tokens } = authCache;
  const now = new Date();
  const currentTime = now.getTime();
  console.log(`getUserAuth, currentTime: ${currentTime}, expires_in: ${tokens.expires_in}`);

  // 2. 检查 access_token 是否有效
  // tokens.expires_in 存储的是 UTC 时间戳
  if (tokens.access_token && tokens.expires_in > currentTime) {
    // access_token 有效，直接返回
    console.log('使用现有的有效 access_token');
    return authCache;
  }
  
  // 3. 检查是否有 refresh_token
  if (!tokens.refresh_token) {
    console.log('没有 refresh_token，无法刷新令牌');
    clearCachedUserAuth();
    return null;
  }
  
  // 4. 使用 refresh_token 获取新的令牌
  console.log('access_token 已过期，尝试刷新令牌');
  const newTokens = await refreshToken(tokens.refresh_token);
  
  if (!newTokens) {
    console.log('刷新令牌失败，清除本地缓存并引导用户重新登录');
    clearCachedUserAuth();
    
    // 触发自定义事件，通知UI层需要重新登录
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('token-refresh-failed', { 
        detail: { 
          message: '登录已过期，请重新登录',
          reason: 'refresh_token_expired'
        } 
      });
      window.dispatchEvent(event);
    }
    
    return null;
  }
  
  // 缓存新的令牌
  cacheUserAuth(user, newTokens);
  console.log('令牌刷新成功');
  
  // 返回更新后的认证信息
  return getCachedUserAuth();
}

export async function logout(): Promise<boolean> {
  try {
    const authCache = getCachedUserAuth();
    if (!authCache || !authCache.tokens || !authCache.tokens.access_token) {
      console.log('没有登录或缺少 access_token，无需登出');
      clearCachedUserAuth();
      return true;
    }

    const access_token = authCache.tokens.access_token;

    // 调用后端API登出
    console.log('Logging out with access token:', access_token);
    const response = await fetch(`${TOKEN_CONFIG.BACKEND.BASE_URL}${TOKEN_CONFIG.BACKEND.ENDPOINTS.LOGOUT}`, {
      method: 'POST',
      headers: {
        'Authorization': `${APP_CONFIG.APP.NAME} ${access_token}`
      },
    });

    // 调用Google登出方法
    try {
      const { googleAuthService } = await import('./googleAuth');
      await googleAuthService.signOut();
      console.log('Google 登出成功');
    } catch (googleError) {
      console.error('Google 登出失败:', googleError);
      // 继续执行，不中断流程
    }

    clearCachedUserAuth();
    if (!response.ok) {
      console.error('登出失败:', await response.text());
      return false
    }
  } catch (error) {
    console.error('登出出错:', error);
    return false;
  }

  return true;
}
