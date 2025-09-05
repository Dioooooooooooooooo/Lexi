import React, { useState } from 'react';
import { Text } from '@/components/ui/text';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import BackHeader from '@/components/BackHeader';
import { router } from 'expo-router';
import ConfirmModal from '../Modal';
import LoadingScreen from '../LoadingScreen';
import LoadingScreenForm from '../LoadingScreenForm';
import { useMutation } from '@tanstack/react-query';
import { useLeaveClassroom } from '@/services/ClassroomService';

type PupilSettingsProps = {
  selectedClassroom: any;
  setSelectedClassroom: (classroom: any) => void;
};

export default function PupilSetting({
  selectedClassroom,
  setSelectedClassroom,
}: PupilSettingsProps) {
  const [showDeleteClassroomModal, setShowLeaveClassroomModal] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log('mao mn kaha ni');
  const handleLeaveClassroom = async () => {
    if (selectedClassroom?.id) {
      console.log('wait', selectedClassroom.id);
      try {
        setIsLoading(true);
        // await leaveClassroomMutation({
        //   classroomId: selectedClassroom?.id,
        // });
        useLeaveClassroom(selectedClassroom.id);
        setSelectedClassroom(null);
        router.replace('/home');
      } catch (error) {
        console.error('Error leaving classroom:', error);
      } finally {
        setIsLoading(true);
      }
    }
  };

  const handleLeaveClassroomPress = () => {
    setShowLeaveClassroomModal(true);
  };

  return (
    <View className="flex-1">
      <ScrollView className="bg-background p-8">
        <BackHeader />
        <View className="py-1">
          <Text className="text-[22px] text-center m-5 font-bold">
            Classroom
          </Text>
        </View>
        <View className="p-5 bottom-0 my-5">
          <Button className="m-5 bg-orange" onPress={handleLeaveClassroomPress}>
            <Text className="text-black font-semibold">Leave Classroom</Text>
          </Button>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showDeleteClassroomModal}
        title="Leave Classroom"
        message={`Are you sure you want to leave your classroom ${selectedClassroom?.name}? This action cannot be undone.`}
        confirmText="Leave"
        cancelText="Cancel"
        onConfirm={handleLeaveClassroom}
        onCancel={() => setShowLeaveClassroomModal(false)}
        icon="logout"
        highlightedText={selectedClassroom?.name}
      />
      <LoadingScreenForm visible={isLoading} />
    </View>
  );
}
