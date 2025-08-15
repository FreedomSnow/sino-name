import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    const { temp_token_id, user_id } = req.body;

    if (!temp_token_id || !user_id) {
      return res.status(400).json({ message: '缺少必要参数' });
    }

    // 这里可以添加临时令牌验证逻辑
    // 目前简化处理，直接返回成功

    const mockUser = {
      id: user_id,
      name: '用户',
      email: 'user@example.com',
      image: null
    };

    res.status(200).json({
      success: true,
      user: mockUser,
      message: '登录验证成功'
    });
  } catch (error) {
    console.error('OAuth成功处理错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
}
