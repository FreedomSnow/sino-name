import { APP_CONFIG } from '@/config/appConfig';
import { AI_REST_CONFIG } from '@/config/aiRestConfig';
import { SurnameItem, NameItem } from '@/types/restRespEntities';
import { getUserAuth } from "@/services/tokenService";
import { getErrorMessage, getErrorCode, HTTP_STATUS } from '@/app/features/error-handler/errorCodes';

// 自由命名请求参数接口
interface FreedomNamingRequest {
  name: string;
  desc: string;
}

// 自由命名响应接口
interface FreedomNamingResponse {
  success: boolean;
  message?: string;
  names?: NameItem[];
  code?: number; // 服务器返回的错误码
}

// API 返回的自定义命名项目接口
interface ApiCustomNameItem {
  name?: string;
  pinyin?: string;
  explanation_cn?: string;
  explanation_en?: string;
}

/**
 * 调用AI自由命名接口
 * @param data 请求参数，包含姓名和描述
 * @param token 授权token，默认使用'braveray'
 * @returns 命名结果
 */
export async function getFreedomNaming(
  data: FreedomNamingRequest,
): Promise<FreedomNamingResponse> {
  try {
    console.log('调用AI自由命名接口，参数:', data);
    // 确保URL格式正确，添加斜杠检查
    const baseUrl = AI_REST_CONFIG.BACKEND.BASE_URL;
    const endpoint = AI_REST_CONFIG.BACKEND.ENDPOINTS.CUSTOM_NAMING;
    const url = baseUrl + (baseUrl.endsWith('/') || endpoint.startsWith('/') ? '' : '/') + endpoint;
    
    console.log('完整请求URL:', url);
    
    console.log('开始获取用户认证信息...');
    let authCache;
    try {
      authCache = await getUserAuth();
      console.log('获取用户认证信息完成:', authCache ? '成功' : '失败');
    } catch (authError) {
      console.error('获取用户认证信息时出错:', authError);
      authCache = null;
    }
    
    const token = authCache?.tokens?.access_token || '';
    console.log('token值:', token);

    console.log('准备发送请求...');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `${APP_CONFIG.APP.NAME} ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('AI自由命名接口返回结果:', result);

    // 确保返回结果符合预期的格式
    return {
      success: true,
      names: Array.isArray(result.data) ? result.data.map((item: ApiCustomNameItem): NameItem => ({
        name: item.name || '',
        pinyin: item.pinyin || '',
        explanation_cn: item.explanation_cn || '',
        explanation_en: item.explanation_en || ''
      })) : [],
      code: result.code || HTTP_STATUS.OK // 使用标准的成功状态码
    };
  } catch (error) {
    console.error('AI自由命名接口调用失败:', error);
    let errorCode = HTTP_STATUS.INTERNAL_SERVER_ERROR; // 默认服务器错误码
    let errorMessage = getErrorMessage(errorCode);
    
    if (error instanceof Error) {
      errorMessage = error.message;
      // 尝试从错误消息中提取状态码
      const statusMatch = error.message.match(/请求失败: (\d+)/);
      if (statusMatch && statusMatch[1]) {
        const statusCode = parseInt(statusMatch[1]);
        errorCode = getErrorCode(statusCode);
        errorMessage = getErrorMessage(errorCode, error.message);
      }
    }
    
    return {
      success: false,
      message: errorMessage,
      names: [],
      code: errorCode
    };
  }
}

interface SurnameRequest {
  lang: string;
  lastName: string;
}

interface SurnameResponse {
  success: boolean;
  message?: string;
  surnames?: SurnameItem[];
  code?: number; // 服务器返回的错误码
}

// API 返回的姓氏项目接口
interface ApiSurnameItem {
  name?: string;
  pinyin?: string;
  explanation_cn?: string;
  explanation_en?: string;
}

/**
 * 调用AI姓氏接口
 * @param data 请求参数
 * @param token 授权token
 * @returns 命名结果
 */
export async function getSurname(
  data: SurnameRequest,
): Promise<SurnameResponse> {
  try {
    console.log('调用AI接口，参数:', data);
    // 确保URL格式正确，添加斜杠检查
    const baseUrl = AI_REST_CONFIG.BACKEND.BASE_URL;
    const endpoint = AI_REST_CONFIG.BACKEND.ENDPOINTS.FAMILY_NAMING;
    const url = baseUrl + (baseUrl.endsWith('/') || endpoint.startsWith('/') ? '' : '/') + endpoint;
    
    console.log('完整请求URL:', url);

    console.log('开始获取用户认证信息...');
    let authCache;
    try {
      authCache = await getUserAuth();
      console.log('获取用户认证信息完成:', authCache ? '成功' : '失败');
    } catch (authError) {
      console.error('获取用户认证信息时出错:', authError);
      authCache = null;
    }
    
    const token = authCache?.tokens?.access_token || '';
    console.log('token值:', token);
    
    console.log('准备发送请求...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': APP_CONFIG.APP.NAME + ` ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('AI命名接口返回结果:', result);

    // 确保返回结果符合预期的格式
    return {
      success: true,
      surnames: Array.isArray(result.data) ? result.data.map((item: ApiSurnameItem): SurnameItem => ({
        name: item.name || '',
        pinyin: item.pinyin || '',
        explanation_cn: item.explanation_cn || '',
        explanation_en: item.explanation_en || ''
      })) : [],
      code: result.code || HTTP_STATUS.OK // 使用标准的成功状态码
    };
  } catch (error) {
    console.error('AI命名接口调用失败:', error);
    let errorCode = HTTP_STATUS.INTERNAL_SERVER_ERROR; // 默认服务器错误码
    let errorMessage = getErrorMessage(errorCode);
    
    if (error instanceof Error) {
      errorMessage = error.message;
      // 尝试从错误消息中提取状态码
      const statusMatch = error.message.match(/请求失败: (\d+)/);
      if (statusMatch && statusMatch[1]) {
        const statusCode = parseInt(statusMatch[1]);
        errorCode = getErrorCode(statusCode);
        errorMessage = getErrorMessage(errorCode, error.message);
      }
    }
    
    return {
      success: false,
      message: errorMessage,
      surnames: [],
      code: errorCode
    };
  }
}

// 定制全名请求参数接口
interface BespokeNamingRequest {
  surname: string;
  givenName: string;
  gender: string;
  birth?: string;
  classicReference?: string;
  description?: string;
}

// 定制全名响应接口
interface BespokeNamingResponse {
  success: boolean;
  message?: string;
  names?: NameItem[];
  code?: number; // 服务器返回的错误码
}

// API 返回的定制全名项目接口
interface ApiFullNameItem {
  name?: string;
  pinyin?: string;
  explanation_cn?: string;
  explanation_en?: string;
}

/**
 * 调用AI定制全名接口
 * @param data 请求参数，包含姓氏、性别、出生时间和特殊要求
 * @param token 授权token，默认使用'braveray'
 * @returns 命名结果
 */
export async function getBespokeNaming(
  data: BespokeNamingRequest,
): Promise<BespokeNamingResponse> {
  try {
    console.log('调用AI定制全名接口，参数:', data);
    // 确保URL格式正确，添加斜杠检查
    const baseUrl = AI_REST_CONFIG.BACKEND.BASE_URL;
    const endpoint = AI_REST_CONFIG.BACKEND.ENDPOINTS.FULL_NAMING;
    const url = baseUrl + (baseUrl.endsWith('/') || endpoint.startsWith('/') ? '' : '/') + endpoint;
    
    console.log('完整请求URL:', url);

    console.log('开始获取用户认证信息...');
    let authCache;
    try {
      authCache = await getUserAuth();
      console.log('获取用户认证信息完成:', authCache ? '成功' : '失败');
    } catch (authError) {
      console.error('获取用户认证信息时出错:', authError);
      authCache = null;
    }
    
    const token = authCache?.tokens?.access_token || '';
    console.log('token值:', token);
    
    console.log('准备发送请求...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': APP_CONFIG.APP.NAME + ` ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('AI定制全名接口返回结果:', result);

    // 确保返回结果符合预期的格式
    return {
      success: true,
      names: Array.isArray(result.data) ? result.data.map((item: ApiFullNameItem): NameItem => ({
        name: item.name || '',
        pinyin: item.pinyin || '',
        explanation_cn: item.explanation_cn || '',
        explanation_en: item.explanation_en || ''
      })) : [],
      code: result.code || HTTP_STATUS.OK // 使用标准的成功状态码
    };
  } catch (error) {
    console.error('AI定制全名接口调用失败:', error);
    let errorCode = HTTP_STATUS.INTERNAL_SERVER_ERROR; // 默认服务器错误码
    let errorMessage = getErrorMessage(errorCode);
    
    if (error instanceof Error) {
      errorMessage = error.message;
      // 尝试从错误消息中提取状态码
      const statusMatch = error.message.match(/请求失败: (\d+)/);
      if (statusMatch && statusMatch[1]) {
        const statusCode = parseInt(statusMatch[1]);
        errorCode = getErrorCode(statusCode);
        errorMessage = getErrorMessage(errorCode, error.message);
      }
    }
    
    return {
      success: false,
      message: errorMessage,
      names: [],
      code: errorCode
    };
  }
}
