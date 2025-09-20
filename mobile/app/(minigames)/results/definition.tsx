import BackHeader from '@/components/BackHeader';
import { Text } from '@/components/ui/text';
import { useDictionaryDefinition } from '@/hooks';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Image } from 'react-native';

export default function Definition() {
  const params = useLocalSearchParams();
  const { data, isLoading: isDictionaryLoading } = useDictionaryDefinition(
    params.word as string,
  );

  console.log('word def', params);

  if (isDictionaryLoading) {
    return (
      <View>
        <Text>Loading Word Definition...</Text>
      </View>
    );
  }

  return (
    <View className="bg-lightGray p-8 flex-1">
      <BackHeader />
      <View className="items-center gap-2">
        <View className="items-center">
          <Text>You guessed...</Text>
          <Text className="font-poppins-bold text-3xl">{params.word}</Text>
        </View>
        <Text className="text-center">{data}</Text>

        <Image
          source={require('@/assets/images/Juicy/Woman-reading.png')}
          style={{ width: '70%', height: '70%' }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
