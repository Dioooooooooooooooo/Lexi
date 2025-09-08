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
      return AuthenticationService.postAuthRegister({ 
        requestBody: transformedData 
      });
    },
    onSuccess: async (response) => {
      // Response already has user data (AuthResponseDto)
      await AsyncStorage.setItem('access_token', response.access_token);
      if (response.refresh_token) {
        await AsyncStorage.setItem('refresh_token', response.refresh_token);
      }
      
      // Set token in OpenAPI config
      OpenAPI.TOKEN = response.access_token;
      
      // Use the user data that's already in the response
      queryClient.setQueryData(queryKeys.auth.me(), response.user);
      
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
    mutationFn: (credentials: { email: string; password: string }) => {
      const data: PostAuthLoginData = {
        requestBody: {
          email: credentials.email,
          password: credentials.password,
        },
      };
      return AuthenticationService.postAuthLogin(data);
    },
    onSuccess: async (response) => {
      const data = (response as any)?.data;
      
      // Store tokens
      if (data?.access_token) {
        await AsyncStorage.setItem('access_token', data.access_token);
        OpenAPI.TOKEN = data.access_token;
      }
      
      if (data?.refresh_token) {
        await AsyncStorage.setItem('refresh_token', data.refresh_token);
      }
      
      // Invalidate to trigger user query (login doesn't return user data)
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

// =============================================================================
// PROVIDER AUTH MUTATIONS - TODO: Implement these to replace authStore.providerAuth()
// =============================================================================

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // TODO: Implement Google OAuth login flow
      // 1. Call signInWithGoogle()
      // 2. Call tokenAuth(0, token)
      // 3. Return response
      throw new Error('Google login not implemented yet');
    },
    onSuccess: async (response) => {
      // TODO: Store tokens and set user data like other auth mutations
      console.log('Google login success - TODO: implement');
    },
    onError: (error: any) => {
      console.error('Google login failed:', error);
    },
  });
};

export const useFacebookLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // TODO: Implement Facebook OAuth login flow
      // 1. Call signInWithFacebook()
      // 2. Call tokenAuth(1, token)
      // 3. Return response
      throw new Error('Facebook login not implemented yet');
    },
    onSuccess: async (response) => {
      // TODO: Store tokens and set user data like other auth mutations
      console.log('Facebook login success - TODO: implement');
    },
    onError: (error: any) => {
      console.error('Facebook login failed:', error);
    },
  });
};