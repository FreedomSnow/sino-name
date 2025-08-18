import { NextApiRequest, NextApiResponse } from 'next';

interface ErrorInfo {
  error: string;
  message: string;
  timestamp: number;
  suggestions: string[];
}

// 错误信息映射
const errorMap: Record<string, ErrorInfo> = {
  'invalid_grant': {
    error: 'invalid_grant',
    message: 'OAuth授权码已过期或无效，请重新登录',
    timestamp: Date.now(),
    suggestions: [
      'OAuth授权码已过期，请重新登录',
      '检查系统时间是否正确',
      '清除浏览器缓存和Cookie',
      '重新启动浏览器',
      '如果问题持续，请联系技术支持'
    ]
  },
  'access_denied': {
    error: 'access_denied',
    message: '用户拒绝了授权请求',
    timestamp: Date.now(),
    suggestions: [
      '您拒绝了Google账号授权请求',
      '请重新登录并允许授权',
      '检查Google账号设置',
      '确保Google账号可用',
      '如果问题持续，请联系技术支持'
    ]
  },
  'invalid_client': {
    error: 'invalid_client',
    message: 'OAuth客户端配置错误',
    timestamp: Date.now(),
    suggestions: [
      'OAuth客户端配置有误',
      '请联系系统管理员',
      '检查Google Console配置',
      '验证客户端ID和密钥',
      '确保应用状态正确'
    ]
  },
  'invalid_request': {
    error: 'invalid_request',
    message: 'OAuth请求格式错误',
    timestamp: Date.now(),
    suggestions: [
      'OAuth请求参数有误',
      '请重新尝试登录',
      '清除浏览器缓存',
      '检查网络连接',
      '如果问题持续，请联系技术支持'
    ]
  },
  'redirect_uri_mismatch': {
    error: 'redirect_uri_mismatch',
    message: '重定向URI不匹配',
    timestamp: Date.now(),
    suggestions: [
      '重定向URI配置不匹配',
      '请联系系统管理员',
      '检查Google Console设置',
      '验证回调URL配置',
      '确保环境配置正确'
    ]
  },
  'server_error': {
    error: 'server_error',
    message: '服务器内部错误',
    timestamp: Date.now(),
    suggestions: [
      '服务器出现内部错误',
      '请稍后重试',
      '如果问题持续，请联系技术支持',
      '检查系统状态',
      '等待服务恢复'
    ]
  },
  'network_error': {
    error: 'network_error',
    message: '网络连接错误',
    timestamp: Date.now(),
    suggestions: [
      '网络连接出现问题',
      '检查网络连接',
      '尝试刷新页面',
      '检查防火墙设置',
      '如果问题持续，请联系技术支持'
    ]
  },
  'timeout_error': {
    error: 'timeout_error',
    message: '请求超时',
    timestamp: Date.now(),
    suggestions: [
      '请求超时，请重试',
      '检查网络连接速度',
      '尝试刷新页面',
      '检查服务器状态',
      '如果问题持续，请联系技术支持'
    ]
  },
  'unknown_error': {
    error: 'unknown_error',
    message: '未知错误',
    timestamp: Date.now(),
    suggestions: [
      '发生了未知错误',
      '请重新尝试登录',
      '清除浏览器缓存',
      '检查网络连接',
      '如果问题持续，请联系技术支持'
    ]
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: '只支持GET请求' 
    });
  }

  try {
    const { error, message } = req.query;

    if (!error || typeof error !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          error: 'missing_error',
          message: '缺少错误参数',
          timestamp: Date.now(),
          suggestions: [
            '请提供有效的错误代码',
            '检查请求参数',
            '重新尝试操作'
          ]
        }
      });
    }

    // 获取错误信息
    let errorInfo = errorMap[error];

    // 如果没有找到对应的错误信息，创建通用错误信息
    if (!errorInfo) {
      errorInfo = {
        error: error,
        message: message && typeof message === 'string' ? message : '未知错误',
        timestamp: Date.now(),
        suggestions: [
          '发生了未知错误',
          '请重新尝试操作',
          '清除浏览器缓存',
          '检查网络连接',
          '如果问题持续，请联系技术支持'
        ]
      };
    }

    // 记录错误日志
    console.error('OAuth错误:', {
      error: errorInfo.error,
      message: errorInfo.message,
      timestamp: new Date(errorInfo.timestamp).toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });

    return res.status(200).json({
      success: false,
      error: errorInfo
    });

  } catch (err) {
    console.error('OAuth错误API处理失败:', err);
    
    return res.status(500).json({
      success: false,
      error: {
        error: 'internal_error',
        message: '内部服务器错误',
        timestamp: Date.now(),
        suggestions: [
          '服务器出现内部错误',
          '请稍后重试',
          '如果问题持续，请联系技术支持',
          '检查系统状态'
        ]
      }
    });
  }
}
