import { memo } from 'react';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { View, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useReadingContentStore } from '@/stores/readingContentStore';

import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookOpen, faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import BackHeader from '@/components/BackHeader';
import { useGetCoverFromGDrive } from '@/hooks/utils/useExtractDriveField';
import { useLibraryStore } from '@/stores/libraryStore';
import { useGlobalStore } from '@/stores/globalStore';
import Toast from 'react-native-toast-message';
import {
  useAddToLibrary,
  useRemoveFromLibrary,
} from '@/hooks/mutation/useLibraryMutations';

function ContentIndex() {
  const lib = useLibraryStore(state => state.library);
  const setLibrary = useLibraryStore(state => state.setLibrary);

  const setIsLoading = useGlobalStore(state => state.setIsLoading);

  const addToLibrary = useAddToLibrary();
  const removeFromLibrary = useRemoveFromLibrary();

  const isInLibrary = (materialId: string) => {
    return lib.some(m => m.id === materialId);
  };

  const selectedContent = useReadingContentStore(
    state => state.selectedContent,
  );
  const imageUrl = useGetCoverFromGDrive(selectedContent!.cover);
  if (!selectedContent) {
    return (
      <ScrollView
        className="flex flex-col z-50 p-8 gap-6 bg-background"
        contentContainerStyle={{ alignItems: 'center', gap: 24 }}
      >
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-lg ">Book not found</Text>
        </View>
      </ScrollView>
    );
  }

  const handleAddToLibrary = async () => {
    try {
      setIsLoading(true);
      await addToLibrary.mutateAsync(selectedContent.id);

      lib.push(selectedContent);
      setLibrary(lib);
      Toast.show({
        type: 'success',
        text1: 'Successfully added story to Library',
      });
    } catch (error: any) {
      Toast.show({
        type: error,
        text1: 'Failed to add story in Library',
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromLibrary = async () => {
    try {
      setIsLoading(true);
      await removeFromLibrary.mutateAsync(selectedContent.id);

      const newLib = lib.filter(item => item.id !== selectedContent.id);
      setLibrary(newLib);
      Toast.show({
        type: 'success',
        text1: 'Successfully removed story from Library',
      });
    } catch (error: any) {
      Toast.show({
        type: error,
        text1: 'Failed to remove story from Library',
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        className="flex flex-col z-50 p-8 bg-white"
        contentContainerStyle={{ alignItems: 'center', gap: 20 }}
      >
        <View
          style={{
            zIndex: -1,
            position: 'absolute',
            width: '120%',
          }}
          className="-top-8 -left-8 bg-yellowOrange h-[25vh] w-full"
        />

        <BackHeader />

        <Image
          source={{
            uri: imageUrl,
          }}
          className="rounded-lg mr-4"
          style={{ width: 130, height: 185 }}
          alt=""
        />

        <View className="flex flex-col items-center gap-2">
          <Text className="flex text-2xl font-poppins-bold text-center">
            {selectedContent.title}
          </Text>
          <MaterialDifficulty difficulty={selectedContent.difficulty} />
        </View>

        {selectedContent.author && (
          <Text className="text-m mb-2">{selectedContent.author}</Text>
        )}
        <View className="flex flex-row w-full justify-center gap-6">
          <View className="flex flex-col justify-center items-center gap-2">
            <Button
              style={{ borderRadius: '100%', width: 65, height: 65 }}
              className="bg-primary"
              variant={'default'}
              onPress={() => {
                router.push(`/content/${selectedContent.id}/read`);
              }}
            >
              <FontAwesomeIcon size={30} icon={faBookOpen} />
            </Button>
            <Text className="font-poppins-bold">Read</Text>
          </View>

          {!!!isInLibrary(selectedContent.id) && (
            <View className="flex flex-col justify-center items-center gap-2">
              <Button
                style={{ borderRadius: '100%', width: 65, height: 65 }}
                className="bg-primary"
                variant={'default'}
                onPress={handleAddToLibrary}
              >
                <FontAwesomeIcon size={30} icon={faPlus} />
              </Button>
              <Text className="font-poppins-bold">Add to Library</Text>
            </View>
          )}

          {isInLibrary(selectedContent.id) && (
            <View className="flex flex-col justify-center items-center gap-2">
              <Button
                style={{ borderRadius: '100%', width: 65, height: 65 }}
                className="bg-primary"
                variant={'default'}
                onPress={handleRemoveFromLibrary}
              >
                <FontAwesomeIcon size={30} icon={faX} />
              </Button>
              <Text className="font-poppins-bold">Remove from Library</Text>
            </View>
          )}
        </View>

        {selectedContent.description && (
          <Text className="text-sm text-center ">
            {selectedContent.description}
          </Text>
        )}

        {/* <View className="mt-4 flex-row justify-between">
          <Text>Genre: {selectedContent.genres}</Text>
          <Text>Difficulty: {selectedContent.difficulty}</Text>
        </View> */}
      </ScrollView>
    </>
  );
}
export default memo(ContentIndex);

export function MaterialDifficulty({ difficulty }: { difficulty: number }) {
  var difficultyName, difficultyColor;
  switch (true) {
    case difficulty <= 40:
      difficultyName = 'Easy';
      difficultyColor = '#90E190';
      break;
    case difficulty <= 80:
      difficultyName = 'Medium';
      difficultyColor = '#99D6E9';
      break;
    case difficulty <= 100:
      difficultyName = 'Hard';
      difficultyColor = '#FF663E';
      break;
  }

  return (
    <View
      className="px-4 py-1 rounded-xl"
      style={{ backgroundColor: difficultyColor }}
    >
      <Text className="font-poppins-bold text-md">{difficultyName}</Text>
    </View>
  );
}
