import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  AuthenticationService,
  OpenAPI,
  type PostAuthRegisterData,
  type PostAuthLoginData,
  type PostAuthRefreshData,
  type PatchAuthMeData,
  type PostAuthChangePasswordData,
  type PostAuthLogoutData,
} from '../api/requests';
import { setupAuthToken, queryKeys } from '../api/apiUtils';
import { transformRegistrationData } from '../utils/authTransformers';

// =============================================================================
// AUTH MUTATIONS - Data Modification Hooks
// =============================================================================

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: Record<string, any>) => {
      const transformedData = transformRegistrationData(formData);
      return AuthenticationService.postAuthRegister({ requestBody: transformedData });
    },
    onSuccess: (data) => {
      // Set token in OpenAPI config
      const token = (data as any)?.access_token;
      if (token) {
        OpenAPI.TOKEN = token;
        AsyncStorage.setItem('access_token', token);
      }
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PostAuthLoginData) => AuthenticationService.postAuthLogin(data),
    onSuccess: (data) => {
      // Set token in OpenAPI config
      const token = (data as any)?.data?.access_token;
      if (token) {
        OpenAPI.TOKEN = token;
        AsyncStorage.setItem('access_token', token);
      }
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PostAuthRefreshData) => AuthenticationService.postAuthRefresh(data),
    onSuccess: (data) => {
      // Update token
      const token = (data as any)?.data?.access_token;
      if (token) {
        OpenAPI.TOKEN = token;
        AsyncStorage.setItem('access_token', token);
      }
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error: any) => {
      console.error('Token refresh failed:', error);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PatchAuthMeData) => {
      await setupAuthToken();
      return AuthenticationService.patchAuthMe(data);
    },
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(queryKeys.auth.me(), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error: any) => {
      console.error('Profile update failed:', error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: PostAuthChangePasswordData) => {
      await setupAuthToken();
      return AuthenticationService.postAuthChangePassword(data);
    },
    onError: (error: any) => {
      console.error('Password change failed:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PostAuthLogoutData = {}) => {
      await setupAuthToken();
      return AuthenticationService.postAuthLogout(data);
    },
    onSuccess: () => {
      // Clear token
      OpenAPI.TOKEN = undefined;
      AsyncStorage.removeItem('access_token');
      // Clear all queries
      queryClient.clear();
    },
    onError: (error: any) => {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local token
      OpenAPI.TOKEN = undefined;
      AsyncStorage.removeItem('access_token');
      queryClient.clear();
    },
  });
};