import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  statusCode?: number;
}

class ApiClient {
  private baseURL = 'http://localhost:3000';
  private token: string | null = null;

  constructor() {
    this.initializeToken();
  }

  private async initializeToken() {
    try {
      this.token = await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('Failed to get token from storage:', error);
    }
  }

  async setToken(token: string) {
    this.token = token;
    try {
      await AsyncStorage.setItem('accessToken', token);
    } catch (error) {
      console.error('Failed to save token to storage:', error);
    }
  }

  async clearToken() {
    this.token = null;
    try {
      await AsyncStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Failed to remove token from storage:', error);
    }
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Ensure we have the latest token
    if (!this.token) {
      await this.initializeToken();
    }

    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText,
        statusCode: response.status,
      }));
      
      throw {
        message: errorData.message || 'An error occurred',
        statusCode: response.status,
        error: errorData.error,
      } as ApiError;
    }

    const data = await response.json();
    return data;
  }

  // HTTP Methods
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
    });
  }

  async put<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body,
    });
  }

  async patch<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body,
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;