import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useUserStore } from '@/stores/userStore';
import { useClassroomStore } from '@/stores/classroomStore';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  editClassroom as apiEditClassroom,
  deleteClassroom as apiDeleteClassroom,
  addPupilToClassroom as apiAddPupilToClassroom,
  searchPupils as apiSearchPupils,
  removePupilFromClassroom as apiRemovePupilFromClassroom,
  getPupilsFromClassroom,
  leaveClassroom as apiLeaveClassroom,
  usePupilsFromClassroom,
} from '@/services/ClassroomService';
import TeacherSetting from '@/components/Classroom/TeacherSetting';
import PupilSetting from '@/components/Classroom/PupilSetting';
import BackHeader from '@/components/BackHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { useLocalSearchParams } from 'expo-router';

export default function ClassroomSettings() {
  const queryClient = useQueryClient();

  const params = useLocalSearchParams<{ id: string }>();
  const selectedClassroom = useClassroomStore(state => state.selectedClassroom);
  const setSelectedClassroom = useClassroomStore(
    state => state.setSelectedClassroom,
  );

  const user = useUserStore(state => state.user);

  const { data: enrolledPupils, isLoading: loadingPupils } =
    usePupilsFromClassroom(selectedClassroom!); // GI BALHIN NAKOS SERVICES SO I CAN REUSE TTOTT

  const { mutateAsync: editClassroomMutation } = useMutation({
    mutationFn: ({
      classroomForm,
      classroomId,
    }: {
      classroomForm: Record<string, any>;
      classroomId: string;
    }) => apiEditClassroom(classroomForm, classroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classroomsData'] });
    },
  });

  const { mutateAsync: deleteClassroomMutation } = useMutation({
    mutationFn: ({ classroomId }: { classroomId: string }) =>
      apiDeleteClassroom(classroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classroomsData'] });
    },
  });

  const { mutateAsync: addPupilMutation } = useMutation({
    mutationFn: ({
      classroomId,
      pupilId,
    }: {
      classroomId: string;
      pupilId: string;
    }) => apiAddPupilToClassroom(classroomId, pupilId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['classroomPupils', selectedClassroom?.id],
      });
    },
  });

  const { mutateAsync: removePupilMutation } = useMutation({
    mutationFn: ({
      classroomId,
      pupilId,
    }: {
      classroomId: string;
      pupilId: string;
    }) => apiRemovePupilFromClassroom(classroomId, pupilId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['classroomPupils', selectedClassroom?.id],
      });
    },
  });

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

  console.log('unsa', user?.role);

  return (
    <View className="flex-1">
      <ScrollView className="bg-background p-8">
        <View>
          <BackHeader />
          <View className="justify-items-center self-center mb-8">
            <Text className="font-poppins-bold text-2xl">Classroom</Text>
            <Text>
              Teacher: {user?.firstName} {user?.lastName}
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
