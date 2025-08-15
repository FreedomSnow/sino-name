import { NextApiRequest, NextApiResponse } from 'next';

interface OAuthFailedRequest {
  error: string;
  error_description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' });
  }

  try {
    const { error, error_description }: OAuthFailedRequest = req.body;

    // 验证参数
    if (!error) {
      return res.status(400).json({ 
        message: '缺少错误信息' 
      });
    }

    // 记录登录失败日志（实际应用中应该记录到数据库或日志系统）
    console.error('OAuth登录失败:', {
      error,
      error_description,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    });

    // 根据错误类型返回相应的错误信息
    let processedError = error;
    let processedDescription = error_description;

    switch (error) {
      case 'access_denied':
        processedError = 'access_denied';
        processedDescription = '用户取消了授权';
        break;
      case 'invalid_request':
        processedError = 'invalid_request';
        processedDescription = '请求参数无效';
        break;
      case 'unauthorized_client':
        processedError = 'unauthorized_client';
        processedDescription = '客户端未授权';
        break;
      case 'unsupported_response_type':
        processedError = 'unsupported_response_type';
        processedDescription = '不支持的响应类型';
        break;
      case 'invalid_scope':
        processedError = 'invalid_scope';
        processedDescription = '权限范围无效';
        break;
      case 'server_error':
        processedError = 'server_error';
        processedDescription = '服务器错误';
        break;
      case 'temporarily_unavailable':
        processedError = 'temporarily_unavailable';
        processedDescription = '服务暂时不可用';
        break;
      default:
        processedError = 'unknown_error';
        processedDescription = error_description || '未知错误';
    }

    // 返回处理后的错误信息
    return res.status(200).json({
      success: false,
      error: processedError,
      error_description: processedDescription,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('OAuth失败处理错误:', error);
    return res.status(500).json({ 
      message: '服务器内部错误' 
    });
  }
}
