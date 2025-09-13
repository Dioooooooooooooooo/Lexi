import { StyleSheet, ScrollView, View, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import ClassroomScreen from '../classroom';
import {
  JoinClassroomBtn,
  NewClassroomBtn,
} from '@/components/Classroom/MainClassroomBtns';
import { useUserStore } from '@/stores/userStore';

export default function Classroom() {
  const user = useUserStore(state => state.user);
  return (
    <ScrollView className="bg-white">
      <View>
        <View className="h-[150px] w-full rounded-bl-[40px] bg-yellowOrange p-4">
          <View className="flex-row items-center justify-between px-4 h-full">
            <Text className="text-[22px] font-poppins-bold leading-tight">
              Your{'\n'}Classrooms
            </Text>

            <Image
              source={require('@/assets/images/Juicy/Office-desk.png')}
              resizeMode="contain"
              className="h-64 w-64"
            />
          </View>
        </View>

        <View className="p-8">
          {user?.role === 'Teacher' ? (
            <NewClassroomBtn />
          ) : (
            <JoinClassroomBtn />
          )}
        </View>
        <ClassroomScreen />
      </View>
    </ScrollView>
  );
}
