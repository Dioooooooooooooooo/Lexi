// Runtime configuration for @hey-api/openapi-ts client

import type { CreateClientConfig } from './requests/client.gen';
export const createClientConfig: CreateClientConfig = config => {
  const ipAddress = process.env.EXPO_PUBLIC_IPADDRESS;

  return {
    ...config,
    baseUrl: `${ipAddress}`,
    fetch: async (url, init) => {
      const res = await fetch(url, init);

      if (!res.ok) {
        let errorBody: any = {};
        try {
          errorBody = await res.json();
        } catch {
          // ignore if body isn’t JSON
        }

        throw new Error(
          errorBody?.message || errorBody?.error || res.statusText,
        );
      }

      return res;
    },
  };
};
