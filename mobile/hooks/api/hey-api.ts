// Runtime configuration for @hey-api/openapi-ts client

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CreateClientConfig } from './requests/client.gen';
export const createClientConfig: CreateClientConfig = config => {
  const ipAddress = process.env.EXPO_PUBLIC_IPADDRESS;

  return {
    ...config,
    baseUrl: `http://${ipAddress}:3000`,
  };
};
