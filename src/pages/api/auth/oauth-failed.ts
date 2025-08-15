import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    const { error, error_description } = req.body;

    if (!error) {
      return res.status(400).json({ message: '缺少错误信息' });
    }

    // 记录登录失败信息
    console.log('OAuth登录失败:', {
      error,
      error_description,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });

    // 根据错误类型返回相应的错误信息
    let userFriendlyMessage = '登录失败';
    
    switch (error) {
      case 'access_denied':
        userFriendlyMessage = '用户取消了登录授权';
        break;
      case 'invalid_request':
        userFriendlyMessage = '无效的请求';
        break;
      case 'unauthorized_client':
        userFriendlyMessage = '未授权的客户端';
        break;
      case 'unsupported_response_type':
        userFriendlyMessage = '不支持的响应类型';
        break;
      case 'invalid_scope':
        userFriendlyMessage = '无效的权限范围';
        break;
      case 'server_error':
        userFriendlyMessage = '服务器错误';
        break;
      case 'temporarily_unavailable':
        userFriendlyMessage = '服务暂时不可用';
        break;
      case 'network_error':
        userFriendlyMessage = '网络连接错误';
        break;
      default:
        userFriendlyMessage = error_description || '未知错误';
    }

    res.status(200).json({
      success: false,
      error: error,
      error_description: userFriendlyMessage,
      message: '登录失败处理完成'
    });
  } catch (error) {
    console.error('OAuth失败处理错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
}
