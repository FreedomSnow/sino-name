import { NextResponse } from 'next/server';

export async function POST() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/auth/callback/google`;
  
  // 生成随机state参数防止CSRF攻击
  const state = Math.random().toString(36).substring(2, 15);
  
  // 构建Google OAuth授权URL
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent('openid email profile')}` +
    `&state=${state}` +
    `&access_type=offline` +
    `&prompt=consent`;

  // 将state存储在cookie中，用于回调时验证
  const response = NextResponse.json({ 
    success: true, 
    redirectUrl: authUrl,
    message: 'OAuth授权URL已生成'
  });
  
  response.cookies.set('oauth_state', state, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax'
  });
  
  return response;
}
