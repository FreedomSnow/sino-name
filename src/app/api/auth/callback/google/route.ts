import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const { code, state, error } = searchParams;
  
  // 检查是否有错误
  if (error) {
    const errorDescription = searchParams.get('error_description') || '未知错误';
    return NextResponse.redirect(
      `${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/oauth-error?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription)}`
    );
  }

  // 验证state参数防止CSRF攻击
  const cookieState = request.cookies.get('oauth_state')?.value;
  if (!state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(
      `${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/oauth-error?error=invalid_state&error_description=状态验证失败，可能存在安全风险`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/oauth-error?error=no_code&error_description=未收到授权码，请重新登录`
    );
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
        code: code,
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
    
    // 创建用户session
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
    
    // 编码用户信息用于URL传递
    const encodedUserInfo = encodeURIComponent(JSON.stringify({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      picture: userData.picture
    }));

    // 重定向到成功页面
    const response = NextResponse.redirect(
      `${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/oauth-success?user_info=${encodedUserInfo}`
    );
    
    // 设置session cookie
    response.cookies.set('user_session', sessionCookie, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: tokenData.expires_in
    });
    
    // 清除oauth_state cookie
    response.cookies.delete('oauth_state');
    
    return response;
    
  } catch (error) {
    console.error('OAuth回调处理错误:', error);
    
    // 根据错误类型重定向到错误页面
    let errorType = 'server_error';
    let errorDescription = '服务器内部错误';
    
    if (error instanceof Error) {
      if (error.message.includes('token')) {
        errorType = 'invalid_grant';
        errorDescription = '授权码无效或已过期';
      } else if (error.message.includes('userinfo')) {
        errorType = 'server_error';
        errorDescription = '获取用户信息失败';
      }
    }
    
    return NextResponse.redirect(
      `${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/oauth-error?error=${encodeURIComponent(errorType)}&error_description=${encodeURIComponent(errorDescription)}`
    );
  }
}
