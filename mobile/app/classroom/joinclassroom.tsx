import BackHeader from '@/components/BackHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { joinClassroom as apiJoinClassroom } from '@/services/ClassroomService';
import { useClassroomStore } from '@/stores/classroomStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { useJoinClassroom } from '@/hooks';

export default function JoinClassroom() {
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const setSelectedClassroom = useClassroomStore(
    state => state.setSelectedClassroom,
  );
  const { mutateAsync: joinClassroom } = useJoinClassroom();

  // const { mutateAsync: joinClassroomMutation } = useMutation({
  //   mutationFn: apiJoinClassroom,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['classroomsData'] });
  //   },
  // });

  return (
    <View className="flex-1">
      <ScrollView className="p-8">
        <View>
          <BackHeader />
          <View className="py-8">
            <Text className="font-poppins-bold text-[22px]">
              Join Classroom
            </Text>
            <Input
              placeholder="Enter Classroom Code..."
              className="my-3"
              value={joinCode}
              onChangeText={joinCode => {
                setJoinCode(joinCode);
              }}
            ></Input>
            <Text className="text-red-500">{error}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="p-5">
        <Button
          className="bg-yellowOrange m-5 mb-24 shadow-main"
          variant="default"
          onPress={async () => {
            if (joinCode.length <= 6) {
              setError('Please enter a valid classroom code.');
              return;
            }
            try {
              const response = await joinClassroom(joinCode);
              const classroom = response.data;

              setSelectedClassroom(classroom);
              router.replace(`/classroom/${classroom.id}`);
            } catch (error) {
              console.error('Error joining classroom:', error);
              setError(`Classroom with ${joinCode} does not exist.`);
            }
          }}
        >
          <Text className="font-semibold">Finish</Text>
        </Button>
      </View>
    </View>
  );
}
