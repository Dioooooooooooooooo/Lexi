import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

export default function MinigamesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WordHunt" />
      <Stack.Screen name="wordsfromletters" />
      <Stack.Screen name="Choices" />
      <Stack.Screen name="fillintheblanks" />
      <Stack.Screen name="SentenceRearrangement" />
    </Stack>
  );
}

const styles = StyleSheet.create({});
