import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只支持GET请求' });
  }

  // 从cookie中获取用户session
  const sessionCookie = req.cookies.user_session;
  
  if (!sessionCookie) {
    return res.status(401).json({ error: '未登录' });
  }

  try {
    // 解码session数据
    const sessionData = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());
    
    // 检查session是否过期
    if (sessionData.expiresAt < Date.now()) {
      // 清除过期session
      res.setHeader('Set-Cookie', 'user_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
      return res.status(401).json({ error: '登录已过期' });
    }

    // 返回用户信息（不包含敏感信息如accessToken）
    res.json({
      user: sessionData.user,
      expiresAt: sessionData.expiresAt,
    });
    
  } catch (error) {
    console.error('解析session数据错误:', error);
    res.status(401).json({ error: '无效的session数据' });
  }
}
