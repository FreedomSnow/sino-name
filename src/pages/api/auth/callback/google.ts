import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只支持GET请求' });
  }

  const { code, state, error } = req.query;
  
  // 检查是否有错误
  if (error) {
    const errorDescription = req.query.error_description || '未知错误';
    return res.redirect(`${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/oauth-error?error=${encodeURIComponent(error as string)}&error_description=${encodeURIComponent(errorDescription as string)}`);
  }

  // 验证state参数防止CSRF攻击
  const cookieState = req.cookies.oauth_state;
  if (!state || !cookieState || state !== cookieState) {
    return res.redirect(`${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/oauth-error?error=invalid_state&error_description=状态验证失败，可能存在安全风险`);
  }

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/oauth-error?error=no_code&error_description=未收到授权码，请重新登录`);
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
        redirect_uri: `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/auth/callback/google`,
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

    // 编码用户信息用于URL传递
    const encodedUserInfo = encodeURIComponent(JSON.stringify({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      picture: userData.picture
    }));

    // 重定向到成功页面
    res.redirect(`${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/oauth-success?user_info=${encodedUserInfo}`);
    
  } catch (error) {
    console.error('OAuth回调处理错误:', error);
    
    // 根据错误类型重定向到错误页面
    let errorType = 'server_error';
    let errorDescription = '服务器内部错误';
    
    if (error instanceof Error) {
      if (error.message.includes('token')) {
        errorType = 'invalid_grant';
        errorDescription = '获取访问令牌失败，请重新登录';
      } else if (error.message.includes('user')) {
        errorType = 'no_user';
        errorDescription = '无法获取用户信息，请重新登录';
      }
    }
    
    res.redirect(`${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/oauth-error?error=${errorType}&error_description=${encodeURIComponent(errorDescription)}`);
  }
}
