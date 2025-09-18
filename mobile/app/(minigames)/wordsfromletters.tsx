import React, { useEffect, useState, useCallback, memo } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useWordsFromLettersMiniGameStore } from '@/stores/miniGameStore';
import { useMiniGameStore } from '@/stores/miniGameStore';
import { View, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { Text } from '~/components/ui/text';
import { Heart, Shuffle } from 'lucide-react-native';
import { CorrectSound, IncorrectSound } from '@/utils/sounds';
import { Progress } from '@/components/ui/progress';
import { Minigame, MinigameType } from '@/models/Minigame';
import { useCreateMinigameLog } from '@/services/minigameService';
import { useUserStore } from '@/stores/userStore';
import { useWordsFromLettersMinigame } from '@/hooks';
import { useReadingContentStore } from '@/stores/readingContentStore';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';

export default function WordsFromLetters() {
  const { mutate: triggerCreateMinigameLog } = useCreateMinigameLog();
  const userRole = useUserStore(state => state.user?.role);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const {
    lives,
    decrementLives,
    letters,
    words,
    guess,
    setGuess,
    shuffleLetters,
    usedIndices,
    addUsedIndex,
    removeUsedIndex,
    resetUsedIndices,
    correctAnswers,
    addCorrectAnswer,
    incorrectAnswers,
    addIncorrectAnswer,
    resetGameState,
    setFirstWord,
  } = useWordsFromLettersMiniGameStore();

  const { gameOver } = useMiniGameStore();
  const [firstGuess, isFirstGuess] = useState(false);
  console.log('wfl words:', words, 'wfl letters:', letters);

  console.log('correct answers', correctAnswers);

  useEffect(() => {
    resetGameState();
  }, []);

  useEffect(() => {
    if (!guess.includes('')) {
      const word = guess.join('').toLowerCase();
      if (words.includes(word)) {
        setIsCorrect(true);
        CorrectSound.play();

        if (!correctAnswers.includes(word)) {
          addCorrectAnswer(word);
          if (!firstGuess) {
            setFirstWord(word);
            isFirstGuess(true);
          }
        }

        setTimeout(resetGuess, 500);
      } else {
        IncorrectSound.play();
        addIncorrectAnswer(word);
        decrementLives();
        setIsCorrect(false);
        setTimeout(resetGuess, 500);
      }
    }
  }, [guess]);

  useEffect(() => {
    if (words.length === 0) return;
    if (lives <= 0 || correctAnswers.length === words.length) {
      try {
        console.log('Words from letters Game Over');

        if (userRole === 'Pupil') {
          const minigameLog = gameOver({
            correctAnswers,
            incorrectAnswers,
            // streak,
          });

          if (!minigameLog) {
            throw Error('Minigame Log is null');
          }

          triggerCreateMinigameLog({
            minigameLog,
            type: MinigameType.WordsFromLetters,
          });
        }

        setTimeout(() => {
          resetGameState();
        }, 500);
        router.push('/(minigames)/results/definition');
      } catch (error) {
        console.error(
          'Error during Words From Letter game over logic: ',
          error,
        );
      }
    }
  }, [lives, correctAnswers]);

  const resetGuess = useCallback(() => {
    setGuess(Array(5).fill(''));
    resetUsedIndices();
    setIsCorrect(null);
  }, []);

  const addLetterToGuess = useCallback(
    (letter: string, index: number) => {
      if (lives <= 0) return;
      const updated = [...guess];
      const emptyIndex = updated.indexOf('');
      if (emptyIndex !== -1) {
        updated[emptyIndex] = letter;
        setGuess(updated);
        addUsedIndex(emptyIndex, index);
      }
    },
    [guess, setGuess],
  );

  const removeLetterFromGuess = useCallback(
    (slotIndex: number) => {
      if (guess[slotIndex] === '') return;

      const updatedGuess = [...guess];
      updatedGuess[slotIndex] = '';

      setGuess(updatedGuess);
      removeUsedIndex(slotIndex);
    },
    [guess, setGuess, removeUsedIndex],
  );

  return (
    <ScrollView className="bg-lightGray h-full">
      <View className="flex p-8">
        <Progress
          value={
            words.length === 0
              ? 0
              : Math.floor((correctAnswers.length / words.length) * 100)
          }
          className="web:w-[60%] bg-background"
          indicatorClassName="bg-[#8383FF]"
        />

        <View className="flex gap-14 py-16">
          <View className="flex gap-4">
            <View className="flex flex-row gap-2 justify-center items-center">
              <Text className="text-3xl font-poppins-bold text-indigo-600">
                Words From Letters
              </Text>
            </View>
            <View className="flex flex-row justify-center gap-3">
              {Array.from({ length: lives }).map((_, i) => (
                <Heart key={i} fill="#8383FF" />
              ))}
            </View>
            <Text className="text-center font-medium">
              Match and create words with the jumbled letters below!
            </Text>
          </View>

          <View className="flex flex-col gap-6">
            <GuessContainer
              guess={guess}
              isCorrect={isCorrect}
              removeLetterFromGuess={removeLetterFromGuess}
            />

            <View className="flex flex-col gap-2 justify-center items-center">
              <TouchableOpacity
                onPress={useCallback(shuffleLetters, [letters, usedIndices])}
              >
                <Shuffle size={30} color="black" />
              </TouchableOpacity>

              <View className="flex-row flex-wrap justify-center gap-3 pt-16">
                {letters && letters.length > 0 ? (
                  letters.map((letter: string, i: number) => (
                    <LetterButton
                      key={`letter-${i}`}
                      letter={letter}
                      disabled={usedIndices.includes(i)}
                      onPress={() => addLetterToGuess(letter, i)}
                    />
                  ))
                ) : (
                  <Text>Loading letters...</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const LetterButton = memo(
  ({
    letter,
    onPress,
    disabled = false,
  }: {
    letter: string;
    onPress: (event: any) => void;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ opacity: disabled ? 0.4 : 1 }}
      className="w-12 h-12 justify-center items-center rounded-xl shadow-sm active:bg-gray-50 active:scale-95"
    >
      <Text className="text-4xl font-poppins-bold">{letter}</Text>
    </TouchableOpacity>
  ),
);

const GuessSlot = memo(
  ({
    letter,
    onPress,
    isCorrect,
  }: {
    letter: string;
    onPress: (event: any) => void;
    isCorrect: boolean | null;
  }) => {
    const shake = useSharedValue(0);

    useEffect(() => {
      if (isCorrect === false) {
        shake.value = withSequence(
          withTiming(-5, { duration: 50 }),
          withTiming(5, { duration: 50 }),
          withTiming(-5, { duration: 50 }),
          withTiming(0, { duration: 50 }),
        );
      }
    }, [isCorrect]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: shake.value }],
    }));

    const borderClass =
      isCorrect === true
        ? 'border-green-500'
        : isCorrect === false
          ? 'border-red-500'
          : '';

    const textClass =
      isCorrect === true
        ? 'text-green-500'
        : isCorrect === false
          ? 'text-red-500'
          : '';

    // return (
    //   <Animated.View
    //     style={animatedStyle}
    //     className={`rounded-md ${borderClass}`}
    //   >
    //     <TouchableOpacity onPress={onPress} className="bg-white">
    //       <Text className={`text-4xl font-poppins-bold ${textClass} m-4`}>
    //         {letter}
    //       </Text>
    //     </TouchableOpacity>
    //   </Animated.View>
    // );

    return (
      <Animated.View
        style={animatedStyle}
        className={`rounded-xl ${borderClass} shadow-sm bg-white min-w-[60px] min-h-[60px]`}
      >
        <TouchableOpacity
          onPress={onPress}
          className="flex-1 justify-center items-center px-4 py-3 active:opacity-70"
        >
          <Text className={`text-3xl font-poppins-bold ${textClass}`}>
            {letter || ' '}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

const GuessContainer = memo(
  ({
    guess,
    isCorrect,
    removeLetterFromGuess,
  }: {
    guess: string[];
    isCorrect: boolean | null;
    removeLetterFromGuess: (i: number) => void;
  }) => (
    <View className="flex flex-row gap-2 justify-center">
      {guess.map((letter: string, i: number) => (
        <GuessSlot
          key={`slot-${i}`}
          letter={letter}
          onPress={() => letter !== '' && removeLetterFromGuess(i)}
          isCorrect={isCorrect}
        />
      ))}
    </View>
  ),
);
