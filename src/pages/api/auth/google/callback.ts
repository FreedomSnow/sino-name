import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只支持GET请求' });
  }

  const { code, state, error } = req.query;
  
  // 检查是否有错误
  if (error) {
    return res.redirect(`/oauth-failed?error=${encodeURIComponent(error as string)}`);
  }

  // 验证state参数防止CSRF攻击
  const cookieState = req.cookies.oauth_state;
  if (!state || !cookieState || state !== cookieState) {
    return res.redirect('/oauth-failed?error=invalid_state');
  }

  if (!code) {
    return res.redirect('/oauth-failed?error=no_code');
  }

  try {
    // 使用授权码换取访问令牌
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('获取访问令牌失败');
    }

    const tokenData = await tokenResponse.json();
    
    // 使用访问令牌获取用户信息
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('获取用户信息失败');
    }

    const userData = await userResponse.json();
    
    // 清除oauth_state cookie
    res.setHeader('Set-Cookie', 'oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    
    // 创建用户session（这里可以存储到数据库或JWT）
    const sessionData = {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      },
      accessToken: tokenData.access_token,
      expiresAt: Date.now() + (tokenData.expires_in * 1000),
    };

    // 将session数据存储到cookie中
    const sessionCookie = Buffer.from(JSON.stringify(sessionData)).toString('base64');
    res.setHeader('Set-Cookie', `user_session=${sessionCookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${tokenData.expires_in}`);

    // 重定向到成功页面或首页
    res.redirect('/oauth-success');
    
  } catch (error) {
    console.error('OAuth回调处理错误:', error);
    res.redirect('/oauth-failed?error=server_error');
  }
}
