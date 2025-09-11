import ChoicesBubble from '@/app/(minigames)/choices';
import SentenceArrangementBubble from '@/app/(minigames)/sentencearrangement';
import ReadContentHeader from '@/components/ReadContentHeader';
import ChatBubble from '@/components/Reading/ChatBubble';
import { Button } from '@/components/ui/button';
import { useDictionary } from '@/services/DictionaryService';
import { useReadingContentStore } from '@/stores/readingContentStore';
import { arrange, bubble, choice } from '@/types/bubble';
import { MessageTypeEnum, personEnum } from '@/types/enum';
import { makeBubble } from '@/utils/makeBubble';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Message } from '@/types/message';
import { useGetRandomMinigames } from '@/services/New-MinigameService';
import { Minigame } from '@/models/Minigame';
import { useThrottle } from '@/hooks/utils/useThrottle';

const iconMap: Record<string, any> = {
  Story: require('@/assets/images/storyIcons/narrator.png'),
  b1: require('@/assets/images/storyIcons/b1.png'),
  g1: require('@/assets/images/storyIcons/g1.png'),
  b2: require('@/assets/images/storyIcons/b2.png'),
  g2: require('@/assets/images/storyIcons/g2.png'),
};

export function getIconSource(icon: string) {
  return iconMap[icon] || iconMap['Story'];
}

function minigameProvider(
  minigameCount: number,
  bubbleCount: number,
  minigames: Minigame[],
) {
  // temp type:1 = choices, 0: arrangement
  const minigame = minigames[minigameCount];
  const metadata = JSON.parse(minigame.metadata);

  // CHOICES
  if (minigame.minigame_type === 1) {
    const choicesBubble: Message = {
      id: bubbleCount,
      type: MessageTypeEnum.CHOICES,
      payload: metadata as choice,
    };
    return choicesBubble;
  } else if (minigame.minigame_type === 0) {
    const arrangeBubble: Message = {
      id: bubbleCount,
      type: MessageTypeEnum.ARRANGE,
      payload: metadata as arrange,
    };
    return arrangeBubble;
  }
}

const Read = () => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [word, setWord] = useState<string | null>(null);
  const { data, isLoading: isDictionaryLoading } = useDictionary(word || '');
  const bubbleCount = useRef(0);
  const minigameCount = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { height: screenHeight } = useWindowDimensions();
  const selectedContent = useReadingContentStore(
    state => state.selectedContent,
  );
  const [isFinished, setIsFinished] = useState(false);
  const { data: minigames, isLoading: isMinigameLoading } =
    useGetRandomMinigames(selectedContent?.id);
  console.log('MINIGAMES:', minigames);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, [messages]);

  // parse each chunk into (chat/story) bubble type with props
  const parsedBubbles = useMemo<Message[]>(() => {
    if (!selectedContent?.content || !minigames) return [];

    return selectedContent.content
      .split(/(?=\[\w*\])|(?=\$[A-Z]+\$)/g)
      .map(chunk => chunk.trim())
      .filter(chunk => chunk.length > 0)
      .map(chunk => {
        const match = chunk.match(/^\[(\w*)\](.+)|^(\$[A-Z]+\$)/s);
        if (!match) return null;
        const [, person, text] = match;
        if (chunk.includes('$MINIGAME')) {
          return minigameProvider(
            minigameCount.current++,
            bubbleCount.current++,
            minigames,
          );
        }

        const storyBubble: Message = {
          id: bubbleCount.current++,
          type: MessageTypeEnum.STORY,
          payload: makeBubble(text.trim(), person || 'Story', personEnum.Story),
        };
        return storyBubble;
      })
      .filter((b): b is Message => b !== null);
  }, [selectedContent?.content, minigames]);

  // Word definition bubble
  useEffect(() => {
    if (!word || isDictionaryLoading) return;

    if (word) {
      const newMessage: Message = {
        id: bubbleCount.current++,
        type: MessageTypeEnum.STORY,
        payload: {
          text: word,
          definition: data,
          person: 'Story',
          type: personEnum.Description,
        },
      };

      if (
        (messages[messages.length - 1].payload as bubble).type ==
        personEnum.Description
      ) {
        setMessages(prev => [...prev.slice(0, -1), newMessage]);
      } else {
        setMessages(prev => [...prev, newMessage]);
      }
      setWord(null);
    }
  }, [data, isDictionaryLoading]);

  // next btn
  const onPress = useThrottle(() => {
    if (chunkIndex < parsedBubbles!.length) {
      const newMessage = parsedBubbles[chunkIndex];
      setMessages(prev => [...prev, newMessage]);
      setChunkIndex(prev => prev + 1);
    }

    if (chunkIndex == parsedBubbles.length) {
      setIsFinished(true);
    }
  });

  const defineWord = (word: string) => {
    if (word.length < 2) return;
    setWord(word);
  };

  const onClosePress = (id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const addStoryMessage = (msg: bubble, msgType: MessageTypeEnum) => {
    const newMsg: Message = {
      id: bubbleCount.current++,
      type: msgType,
      payload: msg,
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const isNextDisabled = () => {
    const bubble = messages[messages.length - 1];
    if (bubble) {
      if (
        bubble.type === MessageTypeEnum.ARRANGE ||
        bubble.type === MessageTypeEnum.CHOICES
      ) {
        return true;
      }
    }

    return false;
  };

  if (isMinigameLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading story & minigames…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-lightGray">
      <ReadContentHeader
        title={selectedContent?.title!}
        handleBack={() => router.back()}
        background="white"
      />

      <View className="flex-1 px-6 my-4">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          <View
            style={{ minHeight: screenHeight }}
            className="flex justify-end"
          >
            {messages.map(msg => (
              <View key={msg.id} className="py-1">
                {msg.type === MessageTypeEnum.STORY
                  ? (() => {
                      const bubblePayload = msg.payload as bubble;
                      return (
                        <ChatBubble
                          bubble={bubblePayload}
                          icon={getIconSource(bubblePayload.person)}
                          showIcon={
                            bubblePayload.type === personEnum.Story ||
                            bubblePayload.type === personEnum.Game
                          }
                          onWordPress={defineWord}
                          onClosePress={() => onClosePress(msg.id)}
                        />
                      );
                    })()
                  : // feel nako better ba naay minigame middle layer somewhere here??
                    msg.type === MessageTypeEnum.CHOICES
                    ? (() => {
                        const choicesPayload = msg.payload as choice;
                        console.log(choicesPayload, 'huehuehui');

                        return (
                          <ChoicesBubble
                            question={choicesPayload.question}
                            choices={choicesPayload.choices}
                            onPress={addStoryMessage}
                          />
                        );
                      })()
                    : msg.type === MessageTypeEnum.ARRANGE
                      ? (() => {
                          const arrangePayload = msg.payload as arrange;
                          console.log(arrangePayload, ':OOO');

                          return (
                            <SentenceArrangementBubble
                              correctAnswer={arrangePayload.correct_answer.join(
                                '',
                              )}
                              partsblocks={arrangePayload.parts}
                              explanation={arrangePayload.explanation}
                              onPress={addStoryMessage}
                            />
                          );
                        })()
                      : null}
              </View>
            ))}
          </View>
          <View className="py-4">
            {!isFinished ? (
              <Button
                onPress={() => {
                  onPress();
                }}
                disabled={isNextDisabled()}
              >
                <Text className="font-poppins-bold text-black">Next</Text>
              </Button>
            ) : (
              <View className="items-center">
                <Text className="py-4">End of Story</Text>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onPress={() => {
                    router.push('/(minigames)/test');
                  }}
                >
                  <Text className="font-poppins-bold text-black">
                    Story Completed
                  </Text>
                </Button>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Read;
