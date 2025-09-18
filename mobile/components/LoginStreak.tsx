import { useUserStore } from '@/stores/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { useUserStreak } from '@/hooks/query/useUserQueries';
import { useUpdateUserStreak } from '@/hooks/mutation/useUserMutations';
import React, { useEffect, useState } from 'react';
import { Text } from '@/components/ui/text';
import { View, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface LoginStreakProps {
  isVisible: boolean;
  onClose: () => void;
  activeWeekdays: boolean[];
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const { width, height } = Dimensions.get('window');

const LoginStreak: React.FC<LoginStreakProps> = ({ isVisible, onClose }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const streak = useUserStore(state => state.streak);
  const setStreak = useUserStore(state => state.setStreak);

  const [activeWeekdays, setActiveWeekdays] = useState<boolean[]>(
    Array(7).fill(false),
  );
  const queryClient = useQueryClient();

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  // Convert to our format (0 = Monday, 6 = Sunday)
  const today = new Date().getDay();
  const currentDayIndex = today === 0 ? 6 : today - 1;

  // Use the proper TanStack Query hook for streak data
  const { data: streakData, isLoading: isStreakLoading } = useUserStreak();

  // Use the proper hey-api mutation for recording streak
  const updateStreakMutation = useUpdateUserStreak();

  // Update streak from query data when available
  useEffect(() => {
    if (streakData && streakData.currentStreak !== undefined) {
      console.log('Setting streak from query data:', streakData.currentStreak);
      setStreak(streakData.currentStreak);
    }
  }, [streakData, setStreak]);

  const activeWeekdaysDisplay = () => {
    const updatedActiveWeekdays = Array(7).fill(false);
    for (let i = currentDayIndex; i > currentDayIndex - streak && i >= 0; i--) {
      updatedActiveWeekdays[i] = true;
    }
    setActiveWeekdays(updatedActiveWeekdays);
  };

  // Record login streak when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      updateStreakMutation.mutate(undefined, {
        onSuccess: (data) => {
          console.log('✅ Login streak recorded successfully:', data);
          if (data && data.currentStreak !== undefined) {
            setStreak(data.currentStreak);
          }
        },
        onError: (error) => {
          console.error('❌ Error recording login streak:', error);
        }
      });
    }
  }, [isVisible]);

  useEffect(() => {
    activeWeekdaysDisplay();
  }, [streak, currentDayIndex]);

  useEffect(() => {
    if (isVisible) {
      scale.value = withSpring(1);
      opacity.value = withSpring(1);
    } else {
      scale.value = withSpring(0.8);
      opacity.value = withSpring(0);
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={[
            {
              width: 320,
              height: 500,
              backgroundColor: '#FEFDF8',
              borderRadius: 16,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              paddingVertical: 60,
              paddingHorizontal: 30,
            },
            animatedStyle,
          ]}
        >
          {/* Streak number */}
          <Text
            style={{
              fontSize: 70,
              fontWeight: 'bold',
              color: '#2D1832', // Dark purple color
            }}
          >
            {streak}
          </Text>

          {/* Day streak text */}
          <Text className="font-poppins-bold text-2xl">day streak</Text>

          {/* Calendar container */}
          <View
            style={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 14,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#E5E5E5',
            }}
          >
            {/* Weekday labels */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              {WEEKDAYS.map((day, index) => {
                const isToday = index === currentDayIndex;
                return (
                  <Text
                    key={`label-${index}`}
                    style={{
                      width: 28,
                      textAlign: 'center',
                      color: isToday ? '#FFCD37' : '#888',
                      fontSize: isToday ? 16 : 14,
                    }}
                    className="font-poppins-bold"
                  >
                    {day}
                  </Text>
                );
              })}
            </View>

            {/* Circles for days */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              {activeWeekdays.map((isActive, index) => (
                <View
                  key={`circle-${index}`}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: isActive ? '#FFCD4D' : '#E5E5E5',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              ))}
            </View>
          </View>

          {/* Instructions text */}
          <Text className="text-center ">
            Read everyday to keep your streak, skipping a day resets it!
          </Text>

          {/* Continue button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#FFCD4D',
              paddingVertical: 14,
              borderRadius: 8,
              width: '100%',
              alignItems: 'center',
              marginTop: 'auto',
            }}
            activeOpacity={0.7}
            onPress={onClose}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#2D1832',
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default LoginStreak;
