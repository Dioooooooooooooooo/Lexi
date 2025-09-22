import BackHeader from '@/components/BackHeader';
import React, { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textarea';
import { router } from 'expo-router';
import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '~/components/ui/input';
import { Description } from '@rn-primitives/dialog';
import { useClassroomStore } from '@/stores/classroomStore';
import { useCreateClassroom } from '@/hooks/mutation/useClassroomMutations';

export default function CreateClassroom() {
  console.log('hmmmmm?');
  const setSelectedClassroom = useClassroomStore(
    state => state.setSelectedClassroom,
  );

  const [classroomForm, setClassroomForm] = useState({
    name: '',
    description: '',
  });

  const { mutateAsync: createClassroomMutation } = useCreateClassroom();

  return (
    <View className="flex-1">
      <ScrollView className="p-8">
        <View>
          <BackHeader />
          <View className="py-8">
            <Text className="font-poppins-bold text-[22px]">
              Create Classroom
            </Text>
            <Input
              placeholder="Classroom Name..."
              className="my-3"
              value={classroomForm.name}
              onChangeText={(name: string) => {
                setClassroomForm({ ...classroomForm, name: name });
              }}
            ></Input>
            <TextArea
              placeholder="Classroom Description..."
              className="my-3"
              value={classroomForm.description}
              onChangeText={(desc: string) => {
                setClassroomForm({ ...classroomForm, description: desc });
              }}
            ></TextArea>
          </View>
        </View>
      </ScrollView>

      <View className="p-5">
        <Button
          className="bg-yellowOrange m-5 mb-24 shadow-main"
          onPress={async () => {
            try {
              const response = await createClassroomMutation(classroomForm);
              const classroom = response?.data;

              setSelectedClassroom(classroom as any);
              router.replace(`/classroom/${classroom?.id}`);
            } catch (error) {
              console.error('Error creating classroom:', error);
            }
          }}
        >
          <Text>Finish</Text>
        </Button>
      </View>
    </View>
  );
}
