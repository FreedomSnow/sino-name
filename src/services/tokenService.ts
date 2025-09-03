import { UserInfo, OAuthTokens } from '@/types/auth';
import { getCachedUserAuth, cacheUserAuth, clearCachedUserAuth, UserAuthCache } from '@/utils/cacheUserAuth';
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
      console.error('刷新令牌失败:', await response.text());
      return null;
    }

    const data = await response.json();
    
    if (!data.access_token) {
      console.error('刷新令牌响应中没有 access_token');
      return null;
    }

    // 返回新的令牌信息
    return {
      access_token: data.access_token,
      refresh_token: refreshToken, // 保留原来的 refresh_token
      expires_in: data.expires_in || 3600, // 默认过期时间为 1 小时
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
  const currentTime = Date.now();
  const tokenTimestamp = authCache.timestamp || 0;
  
  // 2. 检查 access_token 是否有效
  if (tokens.access_token && tokenTimestamp + tokens.expires_in * 1000 > currentTime) {
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
    console.log('刷新令牌失败');
    clearCachedUserAuth()
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

    console.log('Logging out with access token:', access_token);
    const response = await fetch(`${TOKEN_CONFIG.BACKEND.BASE_URL}${TOKEN_CONFIG.BACKEND.ENDPOINTS.LOGOUT}`, {
      method: 'POST',
      headers: {
        'Authorization': `${APP_CONFIG.APP.NAME} ${access_token}`
      },
    });

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
