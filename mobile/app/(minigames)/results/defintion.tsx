import BackHeader from '@/components/BackHeader';
import { Text } from '@/components/ui/text';
import { useDictionaryDefinition } from '@/hooks';
import { useWordsFromLettersMiniGameStore } from '@/stores/miniGameStore';
import React from 'react';
import { View } from 'react-native';

export default function Definition() {
  const { firstWord, setFirstWord } = useWordsFromLettersMiniGameStore();
  const { data, isLoading: isDictionaryLoading } = useDictionaryDefinition(
    firstWord || '',
  );

  if (!isDictionaryLoading) {
    return (
      <View>
        <Text>Loading Word Definition...</Text>
      </View>
    );
  }

  return (
    <View>
      <BackHeader />
      <Text>You guessed...</Text>
      <Text>{firstWord}</Text>
      <Text>{data}</Text>
    </View>
  );
}
