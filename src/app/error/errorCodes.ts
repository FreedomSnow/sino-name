/**
 * 错误码定义
 * 此文件定义了系统中使用的所有错误码，可以被任何文件引用
 */

// HTTP 标准错误码
export const HTTP_STATUS = {
  OK: 200,                    // 请求成功
  UNAUTHORIZED: 401,          // 未授权，没有登录或token无效
  TOO_MANY_REQUESTS: 429,     // 请求过于频繁，需要限流
  INTERNAL_SERVER_ERROR: 500, // 请求失败
  NOT_ENOUGH_POINTS: 403,     // 积分不够
  MISSING_PARAMETERS: 4006,   // 缺少必要参数
};

// 错误消息映射
export const ERROR_MESSAGES = {
  // HTTP 标准错误
  [HTTP_STATUS.UNAUTHORIZED]: 'Authorization expired, please login again',
  [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Too many requests, please try again later.',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Request failed, please try again later',
  [HTTP_STATUS.NOT_ENOUGH_POINTS]: 'Insufficient points, please purchase first',
  [HTTP_STATUS.MISSING_PARAMETERS]: 'Required parameter missing',
};

/**
 * 获取错误消息
 * @param code 错误码
 * @param defaultMessage 默认消息
 * @returns 对应的错误消息
 */
export function getErrorMessage(code: number, defaultMessage: string = '未知错误'): string {
  return ERROR_MESSAGES[code] || defaultMessage;
}

/**
 * 定义API响应接口
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  message?: string;
  data?: T;
}

/**
 * 创建标准化的错误响应对象
 * @param success 是否成功
 * @param code 错误码
 * @param message 错误消息
 * @param data 附加数据
 * @returns 标准化的错误响应对象
 */
export function createErrorResponse<T = unknown>(success: boolean = false, code: number, message?: string, data?: T): ApiResponse<T> {
  return {
    success,
    code,
    message: message || getErrorMessage(code),
    data
  };
}

/**
 * 是否为客户端错误
 * @param code 错误码
 * @returns 是否为客户端错误
 */
export function isClientError(code: number): boolean {
  return code >= 400 && code < 500;
}

/**
 * 是否为服务器错误
 * @param code 错误码
 * @returns 是否为服务器错误
 */
export function isServerError(code: number): boolean {
  return code >= 500 && code < 600;
}
