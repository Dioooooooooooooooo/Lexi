import {
  useMiniGameStore,
  useSentenceRearrangementMiniGameStore,
} from '@/stores/miniGameStore';
import { bubble } from '@/types/bubble';
import { MessageTypeEnum, personEnum } from '@/types/enum';
import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { makeBubble } from '@/utils/makeBubble';
import { Minigame, SentenceRearrangement } from '@/models/Minigame';
import { useCreateSentenceRearrangementLog } from '@/hooks';

const SentenceRearrangementBtn = ({
  text,
  disabled,
  onPress,
}: {
  text: string;
  disabled: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      className="bg-white py-1 px-4 rounded-md"
      onPress={onPress}
      disabled={disabled}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

// TODO: decouple from zustand
const SentenceRearrangementBubble = ({
  minigame,
  onPress,
}: {
  minigame: Minigame;
  onPress: (msg: bubble, msgType: MessageTypeEnum) => void;
}) => {
  // const [isAudio, setIsAudio] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const {
    currentAnswer,
    addPartToCurrentAnswer,
    removePartFromCurrentAnswer,
    parts,
    resetGameState,
    setParts,
  } = useSentenceRearrangementMiniGameStore();
  const metadata = JSON.parse(minigame.metadata) as SentenceRearrangement;
  const { setCurrentMinigame, gameOver } = useMiniGameStore();
  const { mutateAsync: createLog } = useCreateSentenceRearrangementLog();

  // init bruh
  useEffect(() => {
    resetGameState();
    setParts(metadata.parts);
    setCurrentMinigame(minigame);
  }, []);

  console.log('correct answer', metadata.correct_answer?.join(''));
  console.log('current asnwer joined', currentAnswer.join(''));
  console.log('parts', parts);

  useEffect(() => {
    const initSession = async () => {
      let score = 0;
      if (
        currentAnswer.length === metadata.parts.length &&
        isAnswered === true
      ) {
        let bubble;
        console.log('Sentence Rearrangement minigame finished!');
        if (metadata.correct_answer.join('') === currentAnswer.join('')) {
          bubble = makeBubble("That's correct!", '', personEnum.Game);
          score = 1;
        } else {
          bubble = makeBubble('Aww, try again next time!', '', personEnum.Game);
        }

        setTimeout(() => onPress(bubble, MessageTypeEnum.STORY), 500);
        setIsFinished(true);
        const minigameLog = gameOver({
          answers: currentAnswer,
          score: score,
        });

        console.log('minigame log created', minigameLog);
        const log = await createLog(minigameLog);
        console.log('log:', log);

        return;
      }
      setIsAnswered(true);
    };

    initSession();
  }, [currentAnswer]);

  return (
    <View>
      {/* answers bubble */}
      <View className="flex-row gap-2 items-end">
        <Image
          source={require('@/assets/images/storyIcons/narrator.png')}
          className="rounded-full"
          style={{ width: 32, height: 32 }}
          resizeMode="contain"
        />
        <View className="flex-1 border-2 border-accentBlue border-b-4 rounded-md p-3 bg-vibrantBlue">
          <Text className="mb-2">What do you think the next sentence is?</Text>
          <View className="flex-row flex-wrap gap-2">
            {currentAnswer.map((part, index) => (
              <SentenceRearrangementBtn
                key={index}
                text={part}
                onPress={() => removePartFromCurrentAnswer(index)}
                disabled={isFinished}
              />
            ))}
          </View>
        </View>
      </View>
      {/* choices bubble */}
      {isFinished ? null : (
        <View className="flex-row gap-2 pt-1 items-end">
          <View className="flex-1 border-2 border-accentBlue border-b-4 rounded-md p-3 bg-vibrantBlue">
            <View className="flex-wrap flex-row gap-2">
              {parts.map((part, index) => (
                <SentenceRearrangementBtn
                  key={index}
                  text={part}
                  onPress={() => {
                    addPartToCurrentAnswer(part);
                    setParts(parts.filter((_, i) => i !== index));
                  }}
                  disabled={isFinished}
                />
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default SentenceRearrangementBubble;
