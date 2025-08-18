import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/auth/google/callback`;
  
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
  res.setHeader('Set-Cookie', `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax`);
  
  // 返回重定向URL，让前端处理跳转
  res.json({ 
    success: true, 
    redirectUrl: authUrl,
    message: 'OAuth授权URL已生成'
  });
}
