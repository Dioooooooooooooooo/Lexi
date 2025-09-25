import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useUserStore } from '@/stores/userStore';
import { useClassroomStore } from '@/stores/classroomStore';
import {
  searchPupils as apiSearchPupils,
  usePupilsFromClassroom,
} from '@/services/ClassroomService';
import {
  useUpdateClassroom,
  useDeleteClassroom,
  useEnrollPupils,
  useUnEnrollPupils,
  useLeaveClassroom,
} from '@/hooks/mutation/useClassroomMutations';
import TeacherSetting from '@/components/Classroom/TeacherSetting';
import PupilSetting from '@/components/Classroom/PupilSetting';
import BackHeader from '@/components/BackHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { useLocalSearchParams } from 'expo-router';

export default function ClassroomSettings() {
  const params = useLocalSearchParams<{ id: string }>();
  const selectedClassroom = useClassroomStore(state => state.selectedClassroom);
  const setSelectedClassroom = useClassroomStore(
    state => state.setSelectedClassroom,
  );

  const user = useUserStore(state => state.user);

  const { data: enrolledPupils, isLoading: loadingPupils } =
    usePupilsFromClassroom(selectedClassroom!); // GI BALHIN NAKOS SERVICES SO I CAN REUSE TTOTT

  const { mutateAsync: editClassroomMutation } = useUpdateClassroom();
  const { mutateAsync: deleteClassroomMutation } = useDeleteClassroom();
  const { mutateAsync: addPupilMutation } = useEnrollPupils();
  const { mutateAsync: removePupilMutation } = useUnEnrollPupils();

  // return user?.role === 'Teacher' ? (
  //   <TeacherSetting
  //     selectedClassroom={selectedClassroom}
  //     setSelectedClassroom={setSelectedClassroom}
  //     enrolledPupils={enrolledPupils}
  //     loadingPupils={loadingPupils}
  //     editClassroomMutation={editClassroomMutation}
  //     deleteClassroomMutation={deleteClassroomMutation}
  //     addPupilMutation={addPupilMutation}
  //     removePupilMutation={removePupilMutation}
  //     apiSearchPupils={apiSearchPupils}
  //   />
  // ) : (
  //   <PupilSetting
  //     selectedClassroom={selectedClassroom}
  //     setSelectedClassroom={setSelectedClassroom}
  //   />
  // );
  // buwag nani ha

  return (
    <View className="flex-1">
      <ScrollView className="bg-background p-8">
        <View>
          <BackHeader />
          <View className="justify-items-center self-center mb-8">
            <Text className="font-poppins-bold text-center text-2xl">
              Classroom
            </Text>
            <Text>
              Teacher: {user?.first_name} {user?.last_name} to fetch pa hahahah
            </Text>
          </View>
        </View>
        {user?.role === 'Teacher' ? (
          <TeacherSetting
            selectedClassroom={selectedClassroom}
            setSelectedClassroom={setSelectedClassroom}
            enrolledPupils={enrolledPupils}
            loadingPupils={loadingPupils}
            editClassroomMutation={editClassroomMutation}
            deleteClassroomMutation={deleteClassroomMutation}
            addPupilMutation={addPupilMutation}
            removePupilMutation={removePupilMutation}
            apiSearchPupils={apiSearchPupils}
          />
        ) : (
          <PupilSetting
            selectedClassroom={selectedClassroom}
            setSelectedClassroom={setSelectedClassroom}
            params={params.id}
          />
        )}
      </ScrollView>
    </View>
  );
}
