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
import { useCreateChoicesLog } from '@/hooks';
import { useUserStore } from '@/stores/userStore';
import {
  MinigameLog,
  MinigameLogResult,
  MinigameLogResultInfo,
} from '@/models/MinigameLog';

const ChoicesBubble = ({
  minigame,
  minigameLog,
  onPress,
}: {
  minigame: Minigame;
  minigameLog: MinigameLog;
  onPress: (msg: bubble, msgType: MessageTypeEnum) => void;
}) => {
  const metadata = JSON.parse(minigame.metadata) as Choices;
  const [isPressed, setIsPressed] = useState(false);
  const { setCurrentMinigame, gameOver } = useMiniGameStore();
  const { mutateAsync: createLog } = useCreateChoicesLog();
  const user = useUserStore(state => state.user);
  const minigameLogResult = minigameLog.result // result can be nullable
    ? (JSON.parse(minigameLog.result) as MinigameLogResult)
    : undefined;

  const responseBubbles = (
    answer: string,
    isCorrect: boolean,
    time: number,
  ) => {
    const response = isCorrect ? "That's correct!" : 'Aww, try again next time';

    const bubble = makeBubble(answer, '', personEnum.Self);
    console.log('answer bubble', bubble);
    const responseBubble = makeBubble(response, 'Story', personEnum.Game);
    console.log('response bubble', responseBubble);

    onPress(bubble, MessageTypeEnum.STORY);
    setTimeout(() => onPress(responseBubble, MessageTypeEnum.STORY), time);
  };

  console.log('pressed answer', isPressed);

  useEffect(() => {
    setCurrentMinigame(minigame);

    if (minigameLogResult) {
      setIsPressed(true);
    }
  }, [minigameLog]);

  const onBtnPress = async (ans: Choice) => {
    let score = 0;
    if (ans.answer) {
      score = 1;
    }

    const minigameLog = gameOver({ answers: ans.choice, score: score });
    // console.log('choices log', minigameLog);

    if (user.role === 'Pupil') {
      const log = await createLog({
        minigame_id: minigame.id,
        reading_session_id: minigameLog?.reading_session_id,
        pupil_id: user?.pupil?.id,
        result: JSON.stringify(minigameLog),
      });
    }
    responseBubbles(ans.choice, score >= 1, 500);
    // console.log('updated choices minigame log', log);
  };

  // console.log('choices minigamelog:', result);

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
