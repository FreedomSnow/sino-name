import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  // 清除用户session cookie
  res.setHeader('Set-Cookie', 'user_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  
  res.json({ success: true, message: '已成功登出' });
}
