import React, { useEffect, useRef } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Text } from '@/components/ui/text';
import BackHeader from './BackHeader';

export default function ReadContentHeader({
  title,
  handleBack,
  background,
}: {
  title: string;
  handleBack: () => void;
  background?: 'white';
}) {
  return (
    <View className={`bg-${background ?? 'white'}`}>
      <View className="flex flex-row px-6 py-4 items-center justify-between ">
        <View className="flex flex-row">
          <BackHeader onPress={handleBack} />
          <Text className="text-xl px-4 font-poppins-bold">{title}</Text>
        </View>
      </View>
    </View>
  );
}
