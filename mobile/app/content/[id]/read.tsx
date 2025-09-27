import ChoicesBubble from '@/app/(minigames)/choices';
import SentenceRearrangementBubble from '@/app/(minigames)/sentencerearrangement';
import ReadContentHeader from '@/components/ReadContentHeader';
import ChatBubble from '@/components/Reading/ChatBubble';
import { Button } from '@/components/ui/button';
import { useDictionary } from '@/services/DictionaryService';
import { useReadingContentStore } from '@/stores/readingContentStore';
import { bubble } from '@/types/bubble';
import { MessageTypeEnum, personEnum } from '@/types/enum';
import { makeBubble } from '@/utils/makeBubble';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { Message } from '@/types/message';
import { Minigame } from '@/models/Minigame';
import { useThrottle } from '@/hooks/utils/useThrottle';
import {
  useCreateReadingSession,
  useMinigameLogsBySessionId,
  useUpdateReadingSession,
} from '@/hooks';
import {
  useMiniGameStore,
  useWordsFromLettersMiniGameStore,
} from '@/stores/miniGameStore';
import { useReadingSessionStore } from '@/stores/readingSessionStore';

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
  // 1 = choices, 0 = arrangement
  const minigame = minigames[minigameCount];

  // CHOICES
  if (minigame.minigame_type === 1) {
    const choicesBubble: Message = {
      id: bubbleCount,
      type: MessageTypeEnum.CHOICES,
      payload: minigame,
    };
    return choicesBubble;
  } else if (minigame.minigame_type === 0) {
    const arrangeBubble: Message = {
      id: bubbleCount,
      type: MessageTypeEnum.ARRANGE,
      payload: minigame,
    };

    return arrangeBubble;
  } else {
    return null;
  }
}

const Read = () => {
  const [chunkIndex, setChunkIndex] = useState(0);
  const [word, setWord] = useState<string | null>(null);
  const [minigames, setMinigames] = useState<Minigame[]>();
  const minigamesCount = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { height: screenHeight } = useWindowDimensions();

  // Optimized smooth scroll function
  const smoothScrollToEnd = (delay = 50) => {
    // Clear any pending scroll
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
        duration: 300, // Smooth 300ms animation
      });
    }, delay);
  };

  const selectedContent = useReadingContentStore(
    state => state.selectedContent,
  );
  const { data, isLoading: isDictionaryLoading } = useDictionary(word || '');
  const { mutateAsync: createReadingSession } = useCreateReadingSession();
  const { mutateAsync: updateReadingSession } = useUpdateReadingSession();
  const { setWords, setLetters } = useWordsFromLettersMiniGameStore();
  const getPastSession = useReadingSessionStore(state => state.getPastSession);
  const updateReadingSessionProgress = useReadingSessionStore(
    state => state.updateReadingSessionProgress,
  );
  const setCurrentSession = useReadingSessionStore(
    state => state.setCurrentSession,
  );
  const currentSession = useReadingSessionStore(state => state.currentSession);
  const addSession = useReadingSessionStore(state => state.addSession);
  const { data: minigameLogs, isLoading: isMinigameLogsLoading } =
    useMinigameLogsBySessionId(currentSession?.id || '');
  const addMessage = useReadingSessionStore(state => state.addMessage);
  const replaceLastMessage = useReadingSessionStore(
    state => state.replaceLastMessage,
  );
  const removeMessage = useReadingSessionStore(state => state.removeMessage);
  const setCurrentMinigame = useMiniGameStore(
    state => state.setCurrentMinigame,
  );

  // Smooth scroll when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      smoothScrollToEnd();
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages?.length]); // Depend on message count instead of function reference

  useEffect(() => {
    const initSession = async () => {
      const pastSession = getPastSession(selectedContent.id);

      if (!pastSession) {
        const newReadingSession = await createReadingSession({
          reading_material_id: selectedContent?.id,
        });
        addSession(newReadingSession);
        setCurrentSession(newReadingSession);
        setMinigames(newReadingSession.minigames);
        setChunkIndex(newReadingSession.completion_percentage);
      } else {
        setCurrentSession(pastSession);
        setMinigames(pastSession.minigames);
        setChunkIndex(pastSession.completion_percentage);
      }
    };

    initSession();
    console.log('init');
  }, []);

  const messages = useReadingSessionStore(state => state.currentMessages);

  // parse each chunk into (chat/story) bubble type with props
  const parsedBubbles = useMemo<Message[]>(() => {
    console.log('parse');
    if (!selectedContent?.content || !minigames) return [];

    let bubbleCount = 0;
    let minigameCount = 0;
    return selectedContent.content
      .split(/(?=\[\w*\])|(?=\$[A-Z]+\$)/g)
      .map(chunk => chunk.trim())
      .filter(chunk => chunk.length > 0)
      .map(chunk => {
        const match = chunk.match(/^\[(\w*)\](.+)|^(\$[A-Z]+\$)/s);
        if (!match) return null;
        const [, person, text] = match;
        if (chunk.includes('$MINIGAME')) {
          return minigameProvider(minigameCount++, bubbleCount++, minigames);
        }

        const storyBubble: Message = {
          id: bubbleCount++,
          type: MessageTypeEnum.STORY,
          payload: makeBubble(text.trim(), person || 'Story', personEnum.Story),
        };
        return storyBubble;
      })
      .filter((b): b is Message => b !== null);
  }, [selectedContent?.content, minigames]);

  const onBackPress = () => {
    if (currentSession) {
      updateReadingSessionProgress(currentSession.id, chunkIndex);
      updateReadingSession({
        id: currentSession.id!,
        body: {
          completion_percentage: Math.max(
            chunkIndex,
            currentSession.completion_percentage,
          ),
        },
      });
    }
    router.back();
    return true;
  };

  // Better BackHandler setup - place this in a separate useEffect
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => {
      backHandler.remove();
    };
  }, [chunkIndex]); // Add chunkIndex as dependency since onBackPress uses it

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // wfl init
  useEffect(() => {
    if (minigames) {
      const metadata = minigames[minigames.length - 1].metadata;
      const data = JSON.parse(metadata);
      const words = data.words;
      const letters = data.letters.map((letter: string) => {
        return letter.toUpperCase();
      });

      setWords(words);
      setLetters(letters);
    }
    console.log('wfl');
  }, [minigames]);

  // Word definition bubble
  useEffect(() => {
    if (!word || isDictionaryLoading) return;

    if (word) {
      const newMessage: Message = {
        id: messages.length,
        type: MessageTypeEnum.STORY,
        payload: {
          text: word,
          definition: data,
          person: 'Story',
          type: personEnum.Description,
        },
      };

      if (
        (messages[messages.length - 1].payload as bubble).type ===
        personEnum.Description
      ) {
        replaceLastMessage(newMessage);
      } else {
        addMessage(newMessage);
      }
      setWord(null);
    }
    console.log('dict');
  }, [word, data, isDictionaryLoading]);

  // next btn
  const onPress = useThrottle(() => {
    if (
      currentSession?.completion_percentage < parsedBubbles!.length ||
      chunkIndex <= parsedBubbles.length
    ) {
      const newMessage = parsedBubbles[chunkIndex];

      // Add message and update index together
      addMessage(newMessage);
      setChunkIndex(prev => prev + 1);

      // Immediate smooth scroll to new message
      smoothScrollToEnd(80);
    }
  });

  const getMinigameLogById = (minigameId: string) => {
    minigamesCount.current++;
    const res = minigameLogs.find(
      minigame => minigame.minigame_id === minigameId,
    );
    // console.log('getminigamebyid', res);o
    return res;
  };

  const completedStory = useThrottle(() => {
    const wfl = minigames[minigames?.length - 1];
    setCurrentMinigame(wfl);
    router.push({ pathname: '/(minigames)/wordsfromletters' });
  });

  const defineWord = (word: string) => {
    if (word.length < 2) return;
    setWord(word);
  };

  const onClosePress = (id: number) => {
    removeMessage(id);
  };

  const addStoryMessage = (msg: bubble, msgType: MessageTypeEnum) => {
    if (!msg) {
      console.warn('tried to add undefined');
      return;
    }

    const newMsg: Message = {
      id: parsedBubbles.length,
      type: msgType,
      payload: msg,
    };

    // console.log('addstorymsg', newMsg);
    addMessage(newMsg);
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

  console.log('@MESSAGES:', messages);
  // console.log('@@CURRENT SESSION', currentSession);
  // console.log('@@@MINIGAMELOGS', minigameLogs);
  // console.log(
  //   '@@@@PARSED BUBBLES LEN',
  //   parsedBubbles.length,
  //   '@@@@@CHUNK INDEX LEN',
  //   chunkIndex,
  // );
  console.log('@@@@MINIGAMES', minigames);

  if (!currentSession || isMinigameLogsLoading || !minigames || !messages) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading story...</Text>
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
          onContentSizeChange={(width, height) => {
            // Smooth scroll when content size changes (new messages)
            smoothScrollToEnd(120);
          }}
        >
          <View
            style={{ minHeight: screenHeight }}
            className="flex justify-end"
          >
            {messages
              .filter(
                (msg): msg is Message => msg !== undefined && msg !== null,
              )
              .map((msg, index) => (
                <View key={index} className="py-1">
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
                          const choicesMinigame = msg.payload as Minigame;
                          return (
                            <ChoicesBubble
                              minigame={choicesMinigame}
                              onPress={addStoryMessage}
                              minigameLog={getMinigameLogById(
                                choicesMinigame.id,
                              )}
                            />
                          );
                        })()
                      : msg.type === MessageTypeEnum.ARRANGE
                        ? (() => {
                            const SentenceRearrange = msg.payload as Minigame;
                            return (
                              <SentenceRearrangementBubble
                                minigame={SentenceRearrange}
                                onPress={addStoryMessage}
                                minigameLog={getMinigameLogById(
                                  SentenceRearrange.id,
                                )}
                              />
                            );
                          })()
                        : null}
                </View>
              ))}
          </View>
        </ScrollView>
        <View className="py-4">
          {!(
            currentSession?.completion_percentage >= parsedBubbles.length ||
            chunkIndex >= parsedBubbles.length
          ) ? (
            <Button
              onPress={() => {
                onPress();
              }}
              disabled={isNextDisabled()}
            >
              <Text className="font-poppins-bold text-black">
                {chunkIndex === 0 ? 'Start' : 'Next'}
              </Text>
            </Button>
          ) : (
            <View className="w-full items-center">
              <View className="w-full flex-row items-center my-6">
                <View className="flex-1 bg-gray-400" />
                <Text className="mx-4 text-gray-600">End of Story</Text>
                <View className="flex-1 bg-gray-400" />
              </View>
              <Button variant="secondary" onPress={() => completedStory()}>
                <Text className="font-poppins-bold text-black">Story Completed</Text>
              </Button>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Read;
