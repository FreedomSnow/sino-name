import axios from 'axios';

// 定义请求配置类型
interface RequestConfig {
  method?: string;
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
}

export class HttpClient {
  static async request<T>(config: RequestConfig): Promise<T> {
    try {
      const response = await axios<T>({
        ...config,
        data: config.data as T | undefined
      });
      return response.data;
    } catch (error: unknown) {
      // 可以根据需要扩展错误处理
      throw error;
    }
  }

  static async get<T>(url: string, config?: Omit<RequestConfig, 'method' | 'url'>): Promise<T> {
    return HttpClient.request<T>({ ...config, method: 'get', url });
  }

  static async post<T>(url: string, data?: unknown, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>): Promise<T> {
    return HttpClient.request<T>({ ...config, method: 'post', url, data });
  }

  // 可扩展 put、delete 等方法
} 
