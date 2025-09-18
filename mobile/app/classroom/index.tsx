import { Text } from '@/components/ui/text';
import { ScrollView, View, Image } from 'react-native';
import {
  JoinClassroomBtn,
  NewClassroomBtn,
} from '../../components/Classroom/MainClassroomBtns';
import ClassroomCard from '../../components/Classroom/ClassroomCard';
import { useUserStore } from '@/stores/userStore';
import LoadingScreen from '@/components/LoadingScreen';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useGetClassrooms } from '@/services/ClassroomService';
import { useClassrooms } from '@/hooks';

export default function ClassroomScreen() {
  const user = useUserStore(state => state.user);
  const { data: classrooms, isLoading, isError, refetch } = useClassrooms();

  if (!isLoading) console.log('teddy bear', classrooms);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [user?.role, refetch]),
  );

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error fetching classrooms</Text>
      </View>
    );
  }

  return (
    <View className="px-8">
      {isLoading ? (
        <Text>Loading classrooms...</Text>
      ) : classrooms ? (
        <View>
          {classrooms.map(item => (
            <ClassroomCard key={item.id} classroom={{ ...item }} />
          ))}
        </View>
      ) : (
        <Text className="text-center mt-4">No classrooms found</Text>
      )}
    </View>
  );
}
