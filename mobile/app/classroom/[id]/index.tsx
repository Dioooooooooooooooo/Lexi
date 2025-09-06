import { Text } from '@/components/ui/text';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { AddActivity } from '../../../components/Classroom/MainClassroomBtns';
import { SettingsIcon } from 'lucide-react-native';
import ClassroomHeader from '@/components/Classroom/ClassroomHeader';
import { useClassroomStore } from '@/stores/classroomStore';
import { useUserStore } from '@/stores/userStore';
import { useReadingAssignmentStore } from '@/stores/readingAssignmentStore';
import {
  useActiveReadingAssignments,
  useReadingAssigmentsWStats,
} from '@/services/ClassroomService';
import AssignmentCard from '@/components/Classroom/AssignmentCard';

export default function CurrentClassroom() {
  const params = useLocalSearchParams<{ id: string }>();
  const selectedClassroom = useClassroomStore(state => state.selectedClassroom);
  const user = useUserStore(state => state.user);
  console.log('SELECTED CLASSROOM:', selectedClassroom?.id);

  const setReadingAssignments = useReadingAssignmentStore(
    state => state.setReadingAssignments,
  );

  const setSelectedReadingAssignment = useReadingAssignmentStore(
    state => state.setSelectedReadingAssignment,
  );

  const {
    data: readingAssignments,
    isLoading: isReadingAssignmentsLoading,
    refetch: refetchAssignments,
  } = user?.role === 'Teacher'
    ? useReadingAssigmentsWStats(selectedClassroom?.id || '')
    : useActiveReadingAssignments(selectedClassroom?.id || '');

  useFocusEffect(
    useCallback(() => {
      refetchAssignments();

      setSelectedReadingAssignment(null);
    }, [selectedClassroom?.id]),
  );

  useEffect(() => {
    if (readingAssignments) {
      setReadingAssignments(readingAssignments);
      // console.log("READING ASSIGNMENTS:", readingAssignments.index));
    }
  }, [readingAssignments, setReadingAssignments]);

  return (
    <ScrollView>
      <View>
        <ClassroomHeader
          name={`${selectedClassroom?.name}`}
          joinCode={`${selectedClassroom?.join_code}`}
        />
        <View className="p-8">
          {/* <Text>id:{params.id}</Text> */}
          <View className="items-center justify-between flex-row w-full">
            <View className="flex flex-row justify-between items-center w-full">
              <Text className="font-poppins-bold text-[22px]">Activities</Text>

              <SettingsIcon
                color="black"
                onPress={() => {
                  router.push(`/classroom/${params.id}/classroomsettings`);
                }}
              />
            </View>
          </View>
          {user?.role === 'Teacher' ? <AddActivity /> : null}
          {isReadingAssignmentsLoading && (
            <View className="flex-1 justify-center items-center m-8">
              <Text>Loading activities...</Text>
            </View>
          )}

          {/* <LoadingScreenForm visible={isReadingAssignmentsLoading} /> */}
          {!isReadingAssignmentsLoading &&
          readingAssignments &&
          readingAssignments!.length > 0 ? (
            <View className="flex flex-col gap-4">
              {readingAssignments!.map(item => (
                <AssignmentCard key={item.id} assignment={item} />
              ))}
            </View>
          ) : (
            !isReadingAssignmentsLoading && (
              <View className="flex-1 justify-center items-center m-8">
                <Text className="text-gray-500">No activities available.</Text>
              </View>
            )
          )}
        </View>
      </View>
    </ScrollView>
  );
}
