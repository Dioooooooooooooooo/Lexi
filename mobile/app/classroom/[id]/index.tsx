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
import { useActivitiesByClassroom } from '@/hooks/query/useActivityQueries';

// Helper function to get the correct classroom ID
const getCorrectClassroomId = (classroom: any, userRole: string) => {
  // For pupils, the API returns enrollment data with classroom_id field
  // For teachers, the API returns classroom data with id field
  if (userRole === 'Pupil' && classroom.classroom_id) {
    return classroom.classroom_id;
  }
  return classroom.id;
};
import AssignmentCard from '@/components/Classroom/AssignmentCard';

export default function CurrentClassroom() {
  const params = useLocalSearchParams<{ id: string }>();
  const selectedClassroom = useClassroomStore(state => state.selectedClassroom);
  const user = useUserStore(state => state.user);

  // Debug logging
  console.log('Classroom params:', params);
  console.log('Selected classroom:', selectedClassroom);
  console.log('User:', user);

  const setReadingAssignments = useReadingAssignmentStore(
    state => state.setReadingAssignments,
  );

  const setSelectedReadingAssignment = useReadingAssignmentStore(
    state => state.setSelectedReadingAssignment,
  );

  // Safety check: ensure we have a classroom ID before making the query  
  const rawClassroomId = selectedClassroom?.id || params.id || '';
  const classroomId = selectedClassroom && user?.role 
    ? getCorrectClassroomId(selectedClassroom, user.role)
    : rawClassroomId;
  
  console.log('🔍 ACTIVITIES: selectedClassroom:', selectedClassroom);
  console.log('🔍 ACTIVITIES: user role:', user?.role);
  console.log('🔍 ACTIVITIES: rawClassroomId:', rawClassroomId);
  console.log('🔍 ACTIVITIES: corrected classroomId:', classroomId);
  
  const {
    data: readingAssignments,
    isLoading: isReadingAssignmentsLoading,
    refetch: refetchAssignments,
  } = useActivitiesByClassroom(classroomId);

  useFocusEffect(
    useCallback(() => {
      if (classroomId) {
        refetchAssignments();
      }
      setSelectedReadingAssignment(null);
    }, [classroomId, refetchAssignments]),
  );

  // Early return if no classroom data
  if (!selectedClassroom && !params.id) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading classroom...</Text>
      </View>
    );
  }

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
          <View className="items-center justify-between flex-row w-full">
            <View className="flex flex-row justify-between items-center w-full">
              <Text className="font-poppins-bold text-[22px]">Activities</Text>

              <TouchableOpacity
                onPress={() => {
                  router.push(`/classroom/${params.id}/classroomsettings`);
                }}
              >
                <SettingsIcon color="black" />
              </TouchableOpacity>
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
