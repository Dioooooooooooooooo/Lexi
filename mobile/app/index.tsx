import React, { useEffect } from 'react';
import { Redirect, router } from 'expo-router'; // Or useNavigation if using React Navigation
import { useUserStore } from '@/stores/userStore';
import { useMiniGameStore } from '@/stores/miniGameStore';
import { useAuthMe } from '@/hooks/query/useAuthQueries';

//Components
import { ScrollView, View, Image, TouchableOpacity, Text } from 'react-native';
import { useRefreshToken } from '@/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);
  const [isValidatingAuth, setIsValidatingAuth] = React.useState(true);
  const {
    data: authData,
    isLoading: isAuthLoading,
    error: authError,
  } = useAuthMe();

  useRefreshToken();

  // console.log('Clearing asyncstorage rq');
  // AsyncStorage.clear();

  // Validate authentication state on app start
  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Check if we have stored tokens
        const accessToken = await AsyncStorage.getItem('access_token');

        if (!accessToken) {
          console.log('🔍 No access token found, clearing user state');
          setUser(null);
          setIsValidatingAuth(false);
          return;
        }

        // If we have a token but the auth query failed with 401, clear everything
        if (authError && (authError as any)?.status === 401) {
          console.log('🔍 Invalid token detected, clearing auth state');
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('refresh_token');
          setUser(null);
          setIsValidatingAuth(false);
          return;
        }

        // If auth query succeeded, update user state
        if (authData) {
          console.log('✅ Valid authentication confirmed');
          setUser(authData);
        }

        setIsValidatingAuth(false);
      } catch (error) {
        console.error('❌ Auth validation error:', error);
        setUser(null);
        setIsValidatingAuth(false);
      }
    };

    validateAuth();
  }, [authData, authError, setUser]);

  function splashscreen() {
    router.replace('/(auth)/carousel');
  }

  // Show loading while validating authentication
  if (isValidatingAuth || isAuthLoading) {
    return (
      <View className="bg-yellowOrange flex-1 justify-center items-center">
        <Text className="text-lg">Validating authentication...</Text>
        <Text className="text-3xl font-poppins-bold">LexiLearner</Text>
      </View>
    );
  }

  // If user is authenticated and valid, redirect to home
  if (user && authData) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    // No valid authentication, show splash and redirect to auth
    setTimeout(splashscreen, 1000);
  }

  return (
    <View className="bg-yellowOrange flex-1">
      <View className="items-center justify-center">
        <Text className="justify-center text-lg ">Welcome to</Text>
        <Text className="text-3xl font-poppins-bold">LexiLearner</Text>
      </View>
    </View>
  );
}
