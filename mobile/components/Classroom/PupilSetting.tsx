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
import { Input } from '../ui/input';

type PupilSettingsProps = {
  selectedClassroom: any;
  setSelectedClassroom: (classroom: any) => void;
  params: string;
};

export default function PupilSetting({
  selectedClassroom,
  setSelectedClassroom,
  params,
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

  // return (
  //   <View className="flex-1 border">
  //     <ScrollView className="bg-background p-8">
  //       <View className="p-5 bottom-0 my-5">
  //         <Button className="m-5 bg-orange" onPress={handleLeaveClassroomPress}>
  //           <Text className="text-black font-semibold">Leave Classroom</Text>
  //         </Button>
  //       </View>
  //     </ScrollView>

  //     <ConfirmModal
  //       visible={showDeleteClassroomModal}
  //       title="Leave Classroom"
  //       message={`Are you sure you want to leave your classroom ${selectedClassroom?.name}? This action cannot be undone.`}
  //       confirmText="Leave"
  //       cancelText="Cancel"
  //       onConfirm={handleLeaveClassroom}
  //       onCancel={() => setShowLeaveClassroomModal(false)}
  //       icon="logout"
  //       highlightedText={selectedClassroom?.name}
  //     />
  //     <LoadingScreenForm visible={isLoading} />
  //   </View>
  // );

  return (
    <View className="flex-1">
      <View>
        <Text>Classroom Name</Text>
        <View>
          <View className="border border-lightGray rounded-md p-2 my-2">
            <Text>{selectedClassroom.name}</Text>
          </View>
        </View>
      </View>

      <View>
        <Text>Classroom Description</Text>
        <View>
          <View className="border border-lightGray rounded-md p-2 my-2 h-3/5">
            <Text>{selectedClassroom.description}</Text>
          </View>
        </View>
      </View>

      <View className="gap-2">
        <View>
          <Button
            variant="dropshadow"
            size={null}
            className={`border-lightGray !border-2 !my-0`}
          >
            <Text className="font-semibold text-center">My Progress</Text>
          </Button>
        </View>

        <View>
          <Button
            variant="dropshadow"
            size={null}
            className={`border-lightGray !border-2 !my-0`}
            onPress={() => router.push(`/classroom/${params}/studentslist`)}
          >
            <Text className="font-semibold text-center">View Pupils</Text>
          </Button>
        </View>

        <View>
          <Button
            variant="dropshadow"
            size={null}
            className={`border-lightGray !border-2 !my-0`}
            onPress={handleLeaveClassroomPress}
          >
            <Text className="font-semibold text-center">Leave Classroom</Text>
          </Button>
        </View>

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
    </View>
  );
}
