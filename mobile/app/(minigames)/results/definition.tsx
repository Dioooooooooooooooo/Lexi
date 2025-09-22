import BackHeader from '@/components/BackHeader';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useDictionaryDefinition } from '@/hooks';
import { useLocalSearchParams } from 'expo-router';
import { Volume2 } from 'lucide-react-native';
import React from 'react';
import { View, Image, Pressable } from 'react-native';
import Tts from 'react-native-tts';

export default function Definition() {
  const params = useLocalSearchParams();
  const { data, isLoading: isDictionaryLoading } = useDictionaryDefinition(
    params.word as string,
  );
  const word = params.word as string;

  // console.log('word def', params);
  const onAudioPress = (word: string) => {
    Tts.speak(word);
  };

  const onPress = () => {};
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

      <View className="items-center gap-2 pt-8">
        <View className="items-center">
          <Text>You guessed...</Text>
          <View className="flex-row gap-2 justify-center items-center">
            <Text className="font-poppins-bold text-4xl">
              {word.toUpperCase()}
            </Text>
            <Pressable onPress={() => onAudioPress(bubble.text)}>
              <Volume2 fill={'#2F1E38'} />
            </Pressable>
          </View>
          <Text className="text-center">{data}</Text>
        </View>

        <Image
          source={require('@/assets/images/Juicy/Woman-reading.png')}
          style={{ width: '80%' }}
          resizeMode="contain"
        />

        <Button variant="secondary" fullWidth onPress={onPress}>
          <Text className="font-poppins-bold text-black">NEXT</Text>
        </Button>
      </View>
    </View>
  );
}
