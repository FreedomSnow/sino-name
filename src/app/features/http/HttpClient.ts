import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { AxiosResponse } from 'axios';


export class HttpClient {
  static async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axios<T>(config);
      return response.data;
    } catch (error: any) {
      // 可以根据需要扩展错误处理
      throw error;
    }
  }

  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return HttpClient.request<T>({ ...config, method: 'get', url });
  }

  static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return HttpClient.request<T>({ ...config, method: 'post', url, data });
  }

  // 可扩展 put、delete 等方法
}
