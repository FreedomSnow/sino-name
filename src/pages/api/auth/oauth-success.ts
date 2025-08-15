import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

interface OAuthSuccessRequest {
  temp_token_id: string;
  user_id: number;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    const { temp_token_id, user_id }: OAuthSuccessRequest = req.body;

    // 验证参数
    if (!temp_token_id || !user_id) {
      return res.status(400).json({ 
        message: '缺少必要的参数' 
      });
    }

    // 验证临时令牌格式（这里可以根据实际需求调整验证逻辑）
    if (!temp_token_id.startsWith('temp_') || !temp_token_id.includes('_')) {
      return res.status(400).json({ 
        message: '无效的临时令牌格式' 
      });
    }

    // 验证用户ID
    if (user_id <= 0) {
      return res.status(400).json({ 
        message: '无效的用户ID' 
      });
    }

    // 这里可以添加更多的验证逻辑，比如：
    // 1. 检查临时令牌是否过期
    // 2. 验证令牌是否与用户ID匹配
    // 3. 检查用户是否存在
    // 4. 记录登录日志等

    // 模拟用户信息（实际应用中应该从数据库获取）
    const userInfo: UserInfo = {
      id: user_id.toString(),
      name: '谷歌用户',
      email: `user${user_id}@example.com`,
      image: 'https://via.placeholder.com/150',
    };

    // 返回成功响应
    return res.status(200).json({
      success: true,
      message: '登录验证成功',
      user: userInfo,
      temp_token_id,
      user_id,
    });

  } catch (error) {
    console.error('OAuth成功回调处理错误:', error);
    return res.status(500).json({ 
      message: '服务器内部错误' 
    });
  }
}
