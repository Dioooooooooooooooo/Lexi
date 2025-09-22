import BackHeader from '@/components/BackHeader';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCompleteMinigameSession, useDictionaryDefinition } from '@/hooks';
import { CompletedReadingSession } from '@/models/ReadingSession';
import { useReadingSessionStore } from '@/stores/readingSessionStore';
import { router, useLocalSearchParams } from 'expo-router';
import { Volume2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View, Image, Pressable } from 'react-native';
import Tts from 'react-native-tts';

export default function Definition() {
  const params = useLocalSearchParams();
  const currentSession = useReadingSessionStore(state => state.currentSession);
  const { data: defintion, isLoading: isDictionaryLoading } =
    useDictionaryDefinition(params.word as string);
  const { mutateAsync: completeSession } = useCompleteMinigameSession();
  const [data, setData] = useState<CompletedReadingSession>(null);
  const word = params.word as string;

  useEffect(() => {
    const init = async () => {
      const complete = await completeSession(currentSession?.id);
      console.log('completed session data:', complete);
      setData(complete);
    };

    init();
  }, []);

  const onAudioPress = (word: string) => {
    Tts.speak(word);
  };

  const onPress = () => {
    const routePath =
      data?.achievements?.length > 0
        ? '/(minigames)/results/achievements'
        : '/(minigames)/results/levelup';

    router.push({
      pathname: routePath,
      params: {
        data: JSON.stringify(data),
      },
    });
  };

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
            <Pressable onPress={() => onAudioPress(word)}>
              <Volume2 fill={'#2F1E38'} />
            </Pressable>
          </View>
          <Text className="text-center">{defintion}</Text>
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
