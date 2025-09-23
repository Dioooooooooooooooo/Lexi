import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, setupAuthToken } from '../api/apiUtils';
import { client } from '../api/requests/client.gen';
import {
  authControllerChangePassword,
  authControllerDeleteUser,
  authControllerLogin,
  authControllerLogout,
  authControllerRefreshToken,
  authControllerRegister,
  authControllerUpdateProfile,
  imagekitControllerUploadImage,
} from '../api/requests/sdk.gen';
import { transformRegistrationData } from '../utils/authTransformers';
import { useUserStore } from '@/stores/userStore';

// =============================================================================
// AUTH MUTATIONS - Data Modification Hooks
// =============================================================================

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: Record<string, any>) => {
      console.log(
        '🔍 Registration Debug - EXPO_PUBLIC_IPADDRESS:',
        process.env.EXPO_PUBLIC_IPADDRESS,
      );
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
      console.log(
        '🔍 Registration Success - Status:',
        response.response?.status,
      );
      console.log('🔍 Registration Success - Data:', response.data);

      // Check if response contains an error (hey-api might call onSuccess for failed requests)
      if (response.error) {
        console.error(
          '❌ Registration failed but onSuccess called:',
          response.error,
        );
        throw new Error(response.error.message || 'Registration failed');
      }

      // Check for HTTP error status codes that hey-api treats as success
      if (response.response?.status && response.response.status >= 400) {
        console.error(
          '❌ Registration failed with status:',
          response.response.status,
        );
        console.error('❌ Registration error body:', response.data);
        throw new Error(
          response.data?.message ||
            `Registration failed with status ${response.response.status}`,
        );
      }

      // Check for successful status codes (200, 201)
      if (
        response.response?.status &&
        (response.response.status < 200 || response.response.status >= 300)
      ) {
        console.error(
          '❌ Registration unexpected status:',
          response.response.status,
        );
        throw new Error(
          `Registration failed with unexpected status ${response.response.status}`,
        );
      }

      // Validate that we have the expected response data structure
      if (!response.data) {
        console.error('❌ Registration response missing data');
        throw new Error('Registration response missing data');
      }

      // Backend returns: { data: { access_token, refresh_token }, message }
      // So we need to check response.data.data.access_token, not response.data.access_token
      const authData = response.data.data;
      if (!authData || !authData.access_token) {
        console.error(
          '❌ Registration response missing access token:',
          response.data,
        );
        throw new Error(
          'Registration response missing access token - user may not have been created in database',
        );
      }

      console.log('✅ Registration validation passed, storing tokens...');

      try {
        // Store tokens from the nested data structure
        await AsyncStorage.setItem('access_token', authData.access_token);
        if (authData.refresh_token) {
          await AsyncStorage.setItem('refresh_token', authData.refresh_token);
        }

        // Update client configuration with new token
        await setupAuthToken();

        // Since the registration response doesn't include user data,
        // invalidate auth queries to trigger a fresh user fetch
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

        console.log('✅ Registration completed successfully');
      } catch (storageError) {
        console.error('❌ Failed to store registration data:', storageError);
        throw new Error(
          'Registration succeeded but failed to store authentication data',
        );
      }
    },
    onError: (error: any) => {
      console.error('❌ Registration failed:', error);
      console.error('❌ Registration error details:', {
        message: error.message,
        status: error.status,
        body: error.body,
        stack: error.stack,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      current_password: string;
      new_password: string;
    }) => {
      await setupAuthToken();
      return authControllerChangePassword({
        body: {
          current_password: data.current_password,
          new_password: data.new_password,
        },
      });
    },
    onSuccess: response => {
      console.log('success');
      // Update profile in cache from response.data (update returns SuccessResponseDto)
      if (response.data && response.data.data) {
        queryClient.setQueryData(queryKeys.auth.me(), response.data.data);
      }
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error: any) => {
      console.error('Password change failed:', error.message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore(state => state.setUser);
  const setLastLoginStreak = useUserStore(state => state.setLastLoginStreak);

  return useMutation({
    mutationFn: async () => {
      await setupAuthToken();
      return authControllerLogout();
    },
    onSuccess: () => {
      // Clear tokens
      AsyncStorage.removeItem('access_token');
      AsyncStorage.removeItem('refresh_token');

      // Clear user from store (this will also clear the persisted user data)
      setUser(null);

      // Reset login streak to allow fresh streak modal on next login
      setLastLoginStreak(null);

      // Update client configuration without token
      setupAuthToken();

      // Clear all queries
      queryClient.clear();
    },
    onError: (error: any) => {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local tokens and user
      AsyncStorage.removeItem('access_token');
      AsyncStorage.removeItem('refresh_token');
      setUser(null);
      setLastLoginStreak(null);
      setupAuthToken();
      queryClient.clear();
    },
  });
};

export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: async (file: { uri: string; type: string; name: string }) => {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);

      await imagekitControllerUploadImage({
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: data => {
      console.log('Upload successfuljjj: ', data);
    },
    onError: error => {
      console.error('Error uploading avatar:', error.message);
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await setupAuthToken();
      const res = await authControllerDeleteUser();
      console.log('use mutation delete: ', res);
      return res.data?.message;
    },
    onSuccess: () => {
      // Invalidate all classroom queries
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      console.error('Failed to delete user:', error);
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
