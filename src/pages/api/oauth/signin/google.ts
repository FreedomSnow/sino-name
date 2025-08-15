import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '只支持GET请求' });
  }

  try {
    // 获取查询参数
    const { callbackUrl, ...otherParams } = req.query;
    
    // 构建NextAuth的Google登录URL
    const nextAuthGoogleSignIn = '/api/auth/signin/google';
    
    // 构建完整的重定向URL，保留所有参数
    const params = new URLSearchParams();
    if (callbackUrl) params.append('callbackUrl', callbackUrl as string);
    
    // 添加其他可能的参数
    Object.entries(otherParams).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });
    
    const redirectUrl = `${nextAuthGoogleSignIn}${params.toString() ? '?' + params.toString() : ''}`;
    
    console.log('OAuth登录重定向:', {
      from: req.url,
      to: redirectUrl,
      timestamp: new Date().toISOString()
    });
    
    // 重定向到NextAuth的Google登录
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth登录处理错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
}
