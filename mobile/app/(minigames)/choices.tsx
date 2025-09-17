import {
  Choice,
  useChoicesGameStore,
  useMiniGameStore,
} from '@/stores/miniGameStore';
import { bubble, choice } from '@/types/bubble';
import { MessageTypeEnum, personEnum } from '@/types/enum';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { makeBubble } from '@/utils/makeBubble';
import { Choices, Minigame } from '@/models/Minigame';

const ChoicesBubble = ({
  minigame,
  onPress,
}: {
  minigame: Minigame;
  onPress: (msg: bubble, msgType: MessageTypeEnum) => void;
}) => {
  const metadata = JSON.parse(minigame.metadata) as Choices;
  const [isPressed, setIsPressed] = useState(false);
  const [score, setScore] = useState(0);
  const { setCurrentMinigame, gameOver } = useMiniGameStore();

  useEffect(() => {
    setCurrentMinigame(minigame);
  }, []);

  useEffect(() => {
    gameOver({ score });
  }, [isPressed]);

  const onBtnPress = (ans: Choice) => {
    let answer = '';
    if (ans.answer) {
      setScore(1);
      answer = "That's correct!";
    } else {
      answer = 'Aww, try again next time!';
    }

    const bubble = makeBubble(ans.choice, '', personEnum.Self);
    const responseBubble = makeBubble(answer, 'Story', personEnum.Game);

    onPress(bubble, MessageTypeEnum.STORY);
    setTimeout(() => onPress(responseBubble, MessageTypeEnum.STORY), 500);
  };

  return (
    <View className="flex flex-row gap-2 items-end">
      <Image
        source={require('@/assets/images/storyIcons/narrator.png')}
        className="rounded-full"
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
      <View className="flex-1 border-2 border-accentBlue border-b-4 rounded-md p-3 bg-vibrantBlue">
        <Text>{metadata.question}</Text>
        {metadata.choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white p-1 rounded-md justify-center items-center my-1"
            onPress={() => {
              onBtnPress(choice);
              setIsPressed(true);
            }}
            disabled={isPressed}
          >
            <Text>{choice.choice}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ChoicesBubble;
