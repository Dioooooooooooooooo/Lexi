import { Stack } from 'expo-router';

export default function MinigamesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="choices" />
      <Stack.Screen name="sentencerearrangement" />
      <Stack.Screen name="wordsfromletters" />
      <Stack.Screen name="results/achievements" />
      <Stack.Screen name="results/definition" />
      <Stack.Screen name="results/levelup" />
      <Stack.Screen name="results/recommendation" />
    </Stack>
  );
}