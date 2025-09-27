import ReadingContent from '@/components/ReadingContent';
import { useLibraryStories } from '@/hooks/query/useLibraryQueries';
import { ReadingMaterial } from '@/models/ReadingMaterial';
import { useLibraryStore } from '@/stores/libraryStore';
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';

function library() {
  const storiesInLibrary = useLibraryStore(state => state.library);
  const setLibrary = useLibraryStore(state => state.setLibrary);
  const { data: readingMaterials, isLoading } = useLibraryStories();

  useEffect(() => {
    if (readingMaterials) {
      setLibrary(readingMaterials);
    }
  }, [readingMaterials]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-background">
      <View>
        <View className="flex-1 p-5 w-full">
          <Text className="text-[24px] font-poppins-bold py-3">Library</Text>
          <View className="flex flex-row flex-wrap justify-between">
            {readingMaterials && readingMaterials.length > 0 ? (
              readingMaterials?.map(
                (material: ReadingMaterial, index: number) => (
                  <View key={index}>
                    <ReadingContent
                      type="ScrollView"
                      id={material.id}
                      title={material.title}
                      description={material.description}
                      cover={material.cover}
                      content={material.content}
                      genres={material.genres}
                      difficulty={material.difficulty}
                    />
                  </View>
                ),
              )
            ) : (
              <Text className="text-gray-500 ">No stories in library, yet.</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default library;
