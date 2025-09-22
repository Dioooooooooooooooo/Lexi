export default {
  input: 'swagger.json',
  output: './hooks/api/requests',
  plugins: [
    {
      name: '@hey-api/client-fetch',
      runtimeConfigPath: '../hey-api',
      exportFromIndex: true,
      config: {
        throwOnError: true,
      },
    },
  ],
};
