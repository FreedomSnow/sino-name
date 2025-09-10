/**
 * 错误码定义
 * 此文件定义了系统中使用的所有错误码，可以被任何文件引用
 */

// HTTP 标准错误码
export const HTTP_STATUS = {
  OK: 200,                    // 请求成功
  BAD_REQUEST: 400,           // 请求参数错误
  UNAUTHORIZED: 401,          // 未授权，没有登录或token无效
  PAYMENT_REQUIRED: 402,      // 需要付款
  FORBIDDEN: 403,             // 禁止访问，权限不足或积分不够
  NOT_FOUND: 404,             // 资源不存在
  METHOD_NOT_ALLOWED: 405,    // 请求方法不允许
  TOO_MANY_REQUESTS: 429,     // 请求过于频繁，需要限流
  INTERNAL_SERVER_ERROR: 500, // 服务器内部错误
  BAD_GATEWAY: 502,           // 网关错误
  SERVICE_UNAVAILABLE: 503,   // 服务不可用
  GATEWAY_TIMEOUT: 504        // 网关超时
};

// 业务错误码 (1000-1999: 用户相关)
export const USER_ERRORS = {
  LOGIN_FAILED: 1001,         // 登录失败
  REGISTER_FAILED: 1002,      // 注册失败
  TOKEN_EXPIRED: 1003,        // 令牌过期
  TOKEN_INVALID: 1004,        // 无效的令牌
  USER_NOT_FOUND: 1005,       // 用户不存在
  PASSWORD_INCORRECT: 1006,   // 密码错误
  ACCOUNT_LOCKED: 1007,       // 账号被锁定
  USER_EXISTS: 1008,          // 用户已存在
  PROFILE_UPDATE_FAILED: 1009 // 更新个人资料失败
};

// 业务错误码 (2000-2999: 命名服务相关)
export const NAMING_ERRORS = {
  NAMING_FAILED: 2001,         // 命名生成失败
  INVALID_NAME_FORMAT: 2002,   // 名字格式无效
  NAME_EXISTS: 2003,           // 名字已存在
  INVALID_DESCRIPTION: 2004,   // 描述无效
  NOT_ENOUGH_POINTS: 2005,     // 积分不足，无法使用命名服务
  DAILY_LIMIT_REACHED: 2006,   // 达到每日请求限制
  NO_RESULTS_FOUND: 2007,      // 未找到匹配的命名结果
  INVALID_SURNAME: 2008,       // 无效的姓氏
  INVALID_GENDER: 2009,        // 无效的性别参数
  INVALID_BIRTHDATE: 2010      // 无效的出生日期
};

// 业务错误码 (3000-3999: 支付和积分相关)
export const PAYMENT_ERRORS = {
  PAYMENT_FAILED: 3001,        // 支付失败
  INSUFFICIENT_BALANCE: 3002,  // 余额不足
  INVALID_PAYMENT_METHOD: 3003,// 无效的支付方式
  PAYMENT_TIMEOUT: 3004,       // 支付超时
  REFUND_FAILED: 3005,         // 退款失败
  POINTS_INSUFFICIENT: 3006,   // 积分不足
  POINTS_EXPIRED: 3007,        // 积分已过期
  INVALID_COUPON: 3008,        // 无效的优惠券
  COUPON_EXPIRED: 3009,        // 优惠券已过期
  ORDER_NOT_FOUND: 3010        // 订单不存在
};

// 业务错误码 (4000-4999: API调用相关)
export const API_ERRORS = {
  RATE_LIMITED: 4001,          // API调用频率受限
  INVALID_API_KEY: 4002,       // 无效的API密钥
  API_DISABLED: 4003,          // API已被禁用
  REQUEST_TIMEOUT: 4004,       // 请求超时
  INVALID_REQUEST_FORMAT: 4005,// 无效的请求格式
  MISSING_PARAMETERS: 4006,    // 缺少必要参数
  SERVICE_BUSY: 4007,          // 服务繁忙，请稍后再试
  DUPLICATE_REQUEST: 4008,     // 重复的请求
  VERSION_NOT_SUPPORTED: 4009, // 不支持的API版本
  ENDPOINT_DEPRECATED: 4010    // 接口已弃用
};

// 业务错误码 (5000-5999: 系统相关)
export const SYSTEM_ERRORS = {
  DATABASE_ERROR: 5001,        // 数据库错误
  CACHE_ERROR: 5002,           // 缓存错误
  FILE_SYSTEM_ERROR: 5003,     // 文件系统错误
  NETWORK_ERROR: 5004,         // 网络错误
  CONFIG_ERROR: 5005,          // 配置错误
  DEPENDENCY_ERROR: 5006,      // 依赖服务错误
  MEMORY_LIMIT_EXCEEDED: 5007, // 内存限制超出
  CPU_LIMIT_EXCEEDED: 5008,    // CPU限制超出
  DISK_SPACE_LIMIT_EXCEEDED: 5009, // 磁盘空间限制超出
  MAINTENANCE_MODE: 5010       // 系统维护中
};

// 错误消息映射
export const ERROR_MESSAGES = {
  // HTTP 标准错误
  [HTTP_STATUS.BAD_REQUEST]: '请求参数错误',
  [HTTP_STATUS.UNAUTHORIZED]: '未授权，请先登录',
  [HTTP_STATUS.PAYMENT_REQUIRED]: '需要付款才能继续',
  [HTTP_STATUS.FORBIDDEN]: '权限不足或积分不够',
  [HTTP_STATUS.NOT_FOUND]: '请求的资源不存在',
  [HTTP_STATUS.METHOD_NOT_ALLOWED]: '不支持的请求方法',
  [HTTP_STATUS.TOO_MANY_REQUESTS]: '请求过于频繁，请稍后再试',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [HTTP_STATUS.BAD_GATEWAY]: '网关错误',
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: '服务暂时不可用',
  [HTTP_STATUS.GATEWAY_TIMEOUT]: '网关超时',
  
  // 用户相关错误
  [USER_ERRORS.LOGIN_FAILED]: '登录失败，请检查用户名和密码',
  [USER_ERRORS.REGISTER_FAILED]: '注册失败，请稍后再试',
  [USER_ERRORS.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [USER_ERRORS.TOKEN_INVALID]: '无效的登录凭证，请重新登录',
  [USER_ERRORS.USER_NOT_FOUND]: '用户不存在',
  [USER_ERRORS.PASSWORD_INCORRECT]: '密码错误',
  [USER_ERRORS.ACCOUNT_LOCKED]: '账号已被锁定，请联系客服',
  [USER_ERRORS.USER_EXISTS]: '用户已存在',
  [USER_ERRORS.PROFILE_UPDATE_FAILED]: '更新个人资料失败',
  
  // 命名服务相关错误
  [NAMING_ERRORS.NAMING_FAILED]: '命名生成失败，请稍后再试',
  [NAMING_ERRORS.INVALID_NAME_FORMAT]: '名字格式无效',
  [NAMING_ERRORS.NAME_EXISTS]: '该名字已被使用',
  [NAMING_ERRORS.INVALID_DESCRIPTION]: '描述内容无效',
  [NAMING_ERRORS.NOT_ENOUGH_POINTS]: '积分不足，无法使用命名服务',
  [NAMING_ERRORS.DAILY_LIMIT_REACHED]: '已达到每日请求限制',
  [NAMING_ERRORS.NO_RESULTS_FOUND]: '未找到匹配的命名结果',
  [NAMING_ERRORS.INVALID_SURNAME]: '无效的姓氏',
  [NAMING_ERRORS.INVALID_GENDER]: '无效的性别参数',
  [NAMING_ERRORS.INVALID_BIRTHDATE]: '无效的出生日期',
  
  // 支付和积分相关错误
  [PAYMENT_ERRORS.PAYMENT_FAILED]: '支付失败，请稍后再试',
  [PAYMENT_ERRORS.INSUFFICIENT_BALANCE]: '余额不足',
  [PAYMENT_ERRORS.INVALID_PAYMENT_METHOD]: '无效的支付方式',
  [PAYMENT_ERRORS.PAYMENT_TIMEOUT]: '支付超时，请重新支付',
  [PAYMENT_ERRORS.REFUND_FAILED]: '退款失败，请联系客服',
  [PAYMENT_ERRORS.POINTS_INSUFFICIENT]: '积分不足',
  [PAYMENT_ERRORS.POINTS_EXPIRED]: '积分已过期',
  [PAYMENT_ERRORS.INVALID_COUPON]: '无效的优惠券',
  [PAYMENT_ERRORS.COUPON_EXPIRED]: '优惠券已过期',
  [PAYMENT_ERRORS.ORDER_NOT_FOUND]: '订单不存在',
  
  // API调用相关错误
  [API_ERRORS.RATE_LIMITED]: '请求过于频繁，请稍后再试',
  [API_ERRORS.INVALID_API_KEY]: '无效的API密钥',
  [API_ERRORS.API_DISABLED]: 'API已被禁用',
  [API_ERRORS.REQUEST_TIMEOUT]: '请求超时',
  [API_ERRORS.INVALID_REQUEST_FORMAT]: '无效的请求格式',
  [API_ERRORS.MISSING_PARAMETERS]: '缺少必要参数',
  [API_ERRORS.SERVICE_BUSY]: '服务繁忙，请稍后再试',
  [API_ERRORS.DUPLICATE_REQUEST]: '重复的请求',
  [API_ERRORS.VERSION_NOT_SUPPORTED]: '不支持的API版本',
  [API_ERRORS.ENDPOINT_DEPRECATED]: '接口已弃用',
  
  // 系统相关错误
  [SYSTEM_ERRORS.DATABASE_ERROR]: '数据库错误',
  [SYSTEM_ERRORS.CACHE_ERROR]: '缓存错误',
  [SYSTEM_ERRORS.FILE_SYSTEM_ERROR]: '文件系统错误',
  [SYSTEM_ERRORS.NETWORK_ERROR]: '网络错误',
  [SYSTEM_ERRORS.CONFIG_ERROR]: '配置错误',
  [SYSTEM_ERRORS.DEPENDENCY_ERROR]: '依赖服务错误',
  [SYSTEM_ERRORS.MEMORY_LIMIT_EXCEEDED]: '内存限制超出',
  [SYSTEM_ERRORS.CPU_LIMIT_EXCEEDED]: 'CPU限制超出',
  [SYSTEM_ERRORS.DISK_SPACE_LIMIT_EXCEEDED]: '磁盘空间限制超出',
  [SYSTEM_ERRORS.MAINTENANCE_MODE]: '系统维护中，请稍后再试'
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

export function getErrorCode(statusCode: number): number {
  switch(statusCode) {
    case HTTP_STATUS.UNAUTHORIZED:
      return HTTP_STATUS.UNAUTHORIZED; // 未授权
    case HTTP_STATUS.FORBIDDEN:
      return NAMING_ERRORS.NOT_ENOUGH_POINTS; // 积分不足
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return API_ERRORS.RATE_LIMITED; // 请求频率限制
    default:
      return statusCode;
  }
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
