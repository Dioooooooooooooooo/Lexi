import React from 'react';
import { View, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import BackHeader from '../BackHeader';

interface ClassroomDetailsProp {
  name: string;
  joinCode: string;
}

export default function ClassroomHeader({
  name,
  joinCode,
}: ClassroomDetailsProp) {
  return (
    <View className="h-[200px] w-full rounded-bl-[40px] bg-yellowOrange p-4">
      <View className="p-2">
        <BackHeader />
      </View>
      <View className="flex flex-row justify-between items-center px-4 h-full border">
        <View>
          <Text className="text-[22px] font-poppins-bold leading-tight">
            {name}
          </Text>
          <Text selectable={true}>{joinCode}</Text>
        </View>
        <Image
          source={require('@/assets/images/Juicy/Office-desk.png')}
          resizeMode="contain"
          className="h-64 w-64"
        />
      </View>
    </View>
  );
}
