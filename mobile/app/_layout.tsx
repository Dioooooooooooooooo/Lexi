// app/_layout.tsx (fix)
import '~/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font'; // ✅ correct

import React from 'react';
import { PortalHost } from '@rn-primitives/portal';

import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Platform, View } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGlobalStore } from '@/stores/globalStore';
import { LogBox } from 'react-native';
import LoadingScreenForm from '@/components/LoadingScreenForm';
import useScreenTime from '@/hooks/utils/useScreenTime';
import { SplashScreen, Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { OpenAPI } from '@/hooks/api/requests';
import { setupAuthToken } from '@/hooks';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const isLoading = useGlobalStore(state => state.isLoading);
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
  });

  // useScreenTime();

  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setupAuthToken().then(() => {
      console.log('🔑 Token after setup:', OpenAPI.TOKEN);
      console.log('🌐 Base after setup:', OpenAPI.BASE);
      setReady(true);
    });
  }, []);

  React.useEffect(() => {
    setupAuthToken().then(() => setReady(true));
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setIsColorSchemeLoaded(true);
    SplashScreen.hideAsync();

    hasMounted.current = true;
  }, []);

  // LogBox.ignoreAllLogs(false); // show all logs

  // // Add this at app startup:
  // ErrorUtils.setGlobalHandler((error, isFatal) => {
  //   console.error('Global error handler:', error);
  // });

  if (!ready || !isColorSchemeLoaded || !fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <QueryClientProvider client={queryClient}>
        <LoadingScreenForm visible={isLoading} />

        <StatusBar style={'dark'} />
        <SafeAreaView className="flex-1 bg-background">
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="content" />
              <Stack.Screen name="minigames" />
              <Stack.Screen name="(minigames)" />
              <Stack.Screen name="classroom" />
            </Stack>
            <PortalHost />
            <Toast />
          </GestureHandlerRootView>
        </SafeAreaView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect;
