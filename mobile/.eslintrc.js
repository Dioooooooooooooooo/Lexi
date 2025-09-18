// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  rules: {
    // Disable import resolution errors - TypeScript handles this
    'import/no-unresolved': 'off'
  }
};
