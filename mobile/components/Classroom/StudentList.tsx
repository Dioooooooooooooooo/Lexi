import React, { useState } from 'react';
import { ScrollView, View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import ClassroomHeader from './ClassroomHeader';
import { useClassroomStore } from '@/stores/classroomStore';
import { PupilInClassroom } from '@/models/User';

// Default Avatar component using initials
const DefaultAvatar = ({
  name,
  size = 12,
}: {
  name: string;
  size?: number;
}) => {
  // Get first letter of first and last name (if available)
  const initials = name
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <View
      style={{ width: size * 4, height: size * 4 }}
      className="rounded-full bg-gray-300 items-center justify-center"
    >
      <Text className="font-semibold text-gray-700">{initials}</Text>
    </View>
  );
};

export default function StudentsList() {
  const selectedClassroom = useClassroomStore(state => state.selectedClassroom);

  // Replace this with your actual pupils fetching logic
  // For now, assume selectedClassroom.pupils is an array of PupilInClassroom
  const pupils: PupilInClassroom[] = [
    {
      id: '13',
      classroomId: selectedClassroom?.id!,
      firstName: 'ja',
      lastName: 'ha',
      level: 2,
      pupilId: '23456',
    },
    {
      id: '12',
      classroomId: selectedClassroom?.id!,
      firstName: 'ja',
      lastName: 'ha',
      level: 2,
      pupilId: '23456',
    },
  ];

  return (
    <ScrollView className="bg-background flex-1">
      <ClassroomHeader
        name={selectedClassroom?.name || ''}
        joinCode={selectedClassroom?.join_code || ''}
      />
      <View className="p-8">
        {/* Tabs */}
        <View className="flex-col">
          <Text className="font-poppins-bold pb-4 text-lg">Pupils</Text>
          <View className="border-b border-black"></View>
        </View>

        {/* Content based on active tab */}
        <View>
          {pupils.map((student: PupilInClassroom) => (
            <TouchableOpacity
              key={student.id}
              className="flex-row items-center bg-white rounded-lg p-4 mb-3 shadow-sm"
            >
              {/* Use DefaultAvatar for all students */}
              <View className="mr-4">
                <DefaultAvatar
                  name={`${student.firstName} ${student.lastName}`}
                  size={12}
                />
              </View>

              <View className="flex-1">
                <Text className="font-semibold text-base">
                  {`${student.firstName} ${student.lastName}`}
                </Text>
              </View>

              <View className="flex-row items-center">
                <MaterialIcons
                  name="bar-chart"
                  size={22}
                  color="#666"
                  style={{ marginRight: 16 }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
