import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';
import { useAuthStore } from '../stores/authStore';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: 'teacher' | 'pupil';
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    profile_picture?: string;
  };
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

// Query Keys
export const AUTH_KEYS = {
  all: ['auth'] as const,
  profile: () => [...AUTH_KEYS.all, 'profile'] as const,
  refresh: () => [...AUTH_KEYS.all, 'refresh'] as const,
} as const;

// API Functions
const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post('/auth/login', credentials);
  },

  register: async (registerForm: RegisterForm): Promise<AuthResponse> => {
    // Transform field names for backend compatibility
    const fieldMap: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      confirmPassword: 'confirm_password'
    };

    const transformedForm = Object.keys(registerForm).reduce((acc, key) => {
      const backendKey = fieldMap[key] || key;
      acc[backendKey] = registerForm[key];
      return acc;
    }, {} as Record<string, any>);

    return apiClient.post('/auth/register', transformedForm);
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    return apiClient.post('/auth/refresh', { refresh_token: refreshToken });
  },

  getProfile: async (): Promise<AuthResponse['user']> => {
    return apiClient.get('/auth/profile');
  },

  logout: async (): Promise<void> => {
    return apiClient.post('/auth/logout');
  },
};

// Custom Hooks

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Save token to API client and storage
      await apiClient.setToken(data.access_token);
      
      // Update auth store
      setUser(data.user);
      
      // Invalidate and refetch any cached data
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      // Save token to API client and storage
      await apiClient.setToken(data.access_token);
      
      // Update auth store
      setUser(data.user);
      
      // Invalidate and refetch any cached data
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
    },
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: async (data) => {
      // Save new token
      await apiClient.setToken(data.access_token);
      
      // Invalidate queries that might need fresh data
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
    },
    retry: false, // Don't retry refresh token failures
  });
};

export const useProfile = (enabled: boolean = true) => {
  return useQuery({
    queryKey: AUTH_KEYS.profile(),
    queryFn: authApi.getProfile,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.statusCode === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      // Clear token from API client and storage
      await apiClient.clearToken();
      
      // Clear auth store
      setUser(null);
      
      // Clear all cached data
      queryClient.clear();
    },
    onError: async () => {
      // Even if logout fails on server, clear local state
      await apiClient.clearToken();
      setUser(null);
      queryClient.clear();
    },
  });
};

// Utility hook for checking auth status
export const useAuthStatus = () => {
  const user = useAuthStore((state) => state.user);
  
  return {
    isAuthenticated: !!user,
    user,
    isTeacher: user?.role === 'teacher',
    isPupil: user?.role === 'pupil',
  };
};