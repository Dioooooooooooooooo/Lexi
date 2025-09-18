import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import { client } from '../api/requests/client.gen';
import {
  authControllerChangePassword,
  authControllerLogin,
  authControllerLogout,
  authControllerRefreshToken,
  authControllerRegister,
  authControllerUpdateProfile,
} from '../api/requests/sdk.gen';
import { transformRegistrationData } from '../utils/authTransformers';

// =============================================================================
// AUTH MUTATIONS - Data Modification Hooks
// =============================================================================

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: Record<string, any>) => {
      console.log('🔍 Registration Debug - EXPO_PUBLIC_IPADDRESS:', process.env.EXPO_PUBLIC_IPADDRESS);
      console.log('🔍 Registration Debug - Client config:', client.getConfig());
      console.log('🔍 Registration Debug - Form data:', formData);

      const transformedData = transformRegistrationData(formData);
      console.log('🔍 Registration Debug - Transformed data:', transformedData);
      console.log('🔍 Registration Debug - Starting registration request...');

      return authControllerRegister({
        body: transformedData,
      });
    },
    onSuccess: async response => {
      console.log('🎉 Registration Success - Response:', response);

      // Check if response contains an error (hey-api might call onSuccess for failed requests)
      if (response.error) {
        console.error('❌ Registration failed but onSuccess called:', response.error);
        throw new Error(response.error.message || 'Registration failed');
      }

      // Check for HTTP error status codes that hey-api treats as success
      if (response.response?.status && response.response.status >= 400) {
        console.error('❌ Registration failed with status:', response.response.status);
        console.error('❌ Registration error body:', response.data);
        throw new Error(response.data?.message || `Registration failed with status ${response.response.status}`);
      }

      // Response is AuthResponseDto (register returns this directly)
      if (response.data && response.data.access_token) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
        if (response.data.refresh_token) {
          await AsyncStorage.setItem(
            'refresh_token',
            response.data.refresh_token,
          );
        }

        // Update client configuration with new token
        await setupAuthToken();

        // Use the user data that's already in the response
        queryClient.setQueryData(queryKeys.auth.me(), response.data.user);

        // Invalidate auth queries
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      } else {
        console.error('❌ Registration response missing required data:', response.data);
        throw new Error('Registration response missing access token');
      }
    },
    onError: (error: any) => {
      console.error('❌ Registration failed:', error);
      console.error('❌ Registration error details:', {
        message: error.message,
        status: error.status,
        body: error.body,
        stack: error.stack
      });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => {
      console.log(
        '🔍 Login Debug - EXPO_PUBLIC_IPADDRESS:',
        process.env.EXPO_PUBLIC_IPADDRESS,
      );
      console.log('🔍 Login Debug - Client config:', client.getConfig());
      console.log('🔍 Login Debug - Starting login request...');

      return authControllerLogin({
        body: {
          email: credentials.email,
          password: credentials.password,
        },
      });
    },
    onSuccess: async response => {
      // Store tokens from response.data (login returns SuccessResponseDto)
      if (response.data && response.data.data) {
        const authData = response.data.data as any;
        if (authData.access_token) {
          await AsyncStorage.setItem('access_token', authData.access_token);
        }

        if (authData.refresh_token) {
          await AsyncStorage.setItem('refresh_token', authData.refresh_token);
        }
      }

      // Update client configuration with new token
      await setupAuthToken();

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
  console.log('refresh tok');
  return useMutation({
    mutationFn: (refreshToken: string) =>
      authControllerRefreshToken({
        body: { refresh_token: refreshToken },
      }),
    onSuccess: async response => {
      // Store new tokens from response.data
      if (response.data && response.data.data) {
        const authData = response.data.data as any;
        if (authData.access_token) {
          await AsyncStorage.setItem('access_token', authData.access_token);
        }

        if (authData.refresh_token) {
          await AsyncStorage.setItem('refresh_token', authData.refresh_token);
        }
      }

      // Update client configuration with new token
      await setupAuthToken();

      // Invalidate to trigger user query
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error: any) => {
      console.error('Refresh token failed:', error);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      await setupAuthToken();
      return authControllerUpdateProfile({
        body: data,
      });
    },
    onSuccess: response => {
      // Update profile in cache from response.data (update returns SuccessResponseDto)
      if (response.data && response.data.data) {
        queryClient.setQueryData(queryKeys.auth.me(), response.data.data);
      }
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error: any) => {
      console.error('Profile update failed:', error.body);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      await setupAuthToken();
      return authControllerChangePassword({
        body: {
          current_password: data.currentPassword,
          new_password: data.newPassword,
        },
      });
    },
    onError: (error: any) => {
      console.error('Password change failed:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await setupAuthToken();
      return authControllerLogout();
    },
    onSuccess: () => {
      // Clear tokens
      AsyncStorage.removeItem('access_token');
      AsyncStorage.removeItem('refresh_token');
      // Update client configuration without token
      setupAuthToken();
      // Clear all queries
      queryClient.clear();
    },
    onError: (error: any) => {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local tokens
      AsyncStorage.removeItem('access_token');
      AsyncStorage.removeItem('refresh_token');
      setupAuthToken();
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
    onSuccess: async response => {
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
    onSuccess: async response => {
      // TODO: Store tokens and set user data like other auth mutations
      console.log('Facebook login success - TODO: implement');
    },
    onError: (error: any) => {
      console.error('Facebook login failed:', error);
    },
  });
};
