export default {
  input: 'swagger.json',
  output: './hooks/api/requests',
  plugins: [
    {
      name: '@hey-api/client-fetch',
      runtimeConfigPath: '../hey-api',
      exportFromIndex: true,
      schemaMappings: {
        // map binary strings to File
        string: ({ format }) => {
          if (format === 'binary') return 'File';
          return null;
        },
      },
    },
  ],
};
