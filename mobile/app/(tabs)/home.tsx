import ReadingContent from '@/components/ReadingContent';
import { ReadingMaterial } from '@/models/ReadingMaterial';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

//Components
import { Text } from '@/components/ui/text';
import {
  Dimensions,
  Image,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import { HeaderSearchBar } from '@/components/HeaderSearchBar';
import {
  useReadingMaterials,
  useReadingMaterialsRecommendations,
} from '@/hooks';
import { useReadingContentStore } from '@/stores/readingContentStore';
import { useUserStore } from '@/stores/userStore';

function HomeScreen() {
  const { data: stories, isLoading: isStoriesLoading } = useReadingMaterials();
  const [showStreak, setShowStreakModal] = useState(false);
  const user = useUserStore(state => state.user);
  const { data: recommendations, isLoading: isRecommendationsLoading } =
    useReadingMaterialsRecommendations();
  const lastLoginStreak = useUserStore(state => state.lastLoginStreak);
  const setLastLoginStreak = useUserStore(state => state.setLastLoginStreak);
  const setSelectedContent = useReadingContentStore(
    state => state.setSelectedContent,
  );
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const fullDate = new Date().toString();
    console.log('TODAY', today, 'LOGINTREAKS:', lastLoginStreak);
    console.log('🔍 VM Full Date:', fullDate);
    console.log(
      '🔍 VM Timezone:',
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    console.log('🔍 Streak Modal Debug - User:', user);
    console.log('🔍 Streak Modal Debug - User role:', user?.role);

    // Temporary test mode - set to true to always show modal for testing
    const FORCE_SHOW_MODAL_FOR_TESTING = false;

    if (
      (today !== lastLoginStreak || FORCE_SHOW_MODAL_FOR_TESTING) &&
      user?.role === 'Pupil'
    ) {
      console.log('🎉 Streak Modal - Showing modal for new day login');
      const timer = setTimeout(() => {
        setShowStreakModal(true);
        if (!FORCE_SHOW_MODAL_FOR_TESTING) {
          setLastLoginStreak(today);
        }
      }, 500);

      return () => clearTimeout(timer);
    } else {
      console.log('🔍 Streak Modal - Not showing because:', {
        sameDay: today === lastLoginStreak,
        notPupil: user?.role !== 'Pupil',
        noUser: !user,
        testMode: FORCE_SHOW_MODAL_FOR_TESTING,
      });
    }
  }, [user, lastLoginStreak]); // Added dependencies

  const performSearch = useCallback(
    (query: string) => {
      if (query.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      if (!stories) return;

      setIsSearching(true);

      const filtered = stories.filter(story => {
        const matchesTitle = story.title
          .toLowerCase()
          .includes(query.trim().toLowerCase());
        const matchesAuthor = story.author
          ?.toLowerCase()
          .includes(query.trim().toLowerCase());
        const matchesGenre = story.genres?.some((genre: string) =>
          genre.toLowerCase().includes(query.trim().toLowerCase()),
        );

        return matchesTitle || matchesAuthor || matchesGenre;
      });

      setSearchResults(filtered);
      setIsSearching(false);
    },
    [stories],
  );

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchQuery('');
        setSearchResults([]);
      };
    }, []),
  );

  const streak = useUserStore(state => state.streak);
  const activeWeekdays = [true, true, true, false, false, false, false];

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );

  useEffect(() => {
    const dimensionHandler = Dimensions.addEventListener(
      'change',
      ({ window }) => {
        setScreenWidth(window.width);
      },
    );

    return () => {
      dimensionHandler.remove();
    };
  }, []);

  const handleSearchFocus = () => {
    console.log('Search focused');
  };

  const handleSearchBlur = () => {
    console.log('Search blur');
  };

  const handleResultPress = (item: ReadingMaterial) => {
    console.log('Item selected:', item.id);

    setSelectedContent(item);
    setSearchQuery('');
    setSearchResults([]);

    router.push(`/content/${item.id}`);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const imageWidth = Math.min(200, screenWidth * 0.4);
  const imageHeight = imageWidth;

  const showSearchResults = searchQuery.trim() !== '';

  // if (!isStoriesLoading) {
  //   console.log(stories, 'gidle');
  // } else {
  //   console.log('loading stories...');
  // }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="bg-background"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={{ position: 'relative' }}>
          <HeaderSearchBar
            user={user}
            streak={streak}
            showStreak={showStreak}
            setShowStreakModal={setShowStreakModal}
            activeWeekdays={activeWeekdays}
            placeholder="Search for stories..."
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchFocus={handleSearchFocus}
            onSearchBlur={handleSearchBlur}
            onClearSearch={handleClearSearch}
          />
        </View>

        {/* Search Results Section */}
        {showSearchResults && (
          <View className="flex-1 w-full p-4">
            <View className="mb-4">
              <Text className="text-lg font-poppins-semibold text-gray-600">
                {isSearching
                  ? 'Searching...'
                  : `${searchResults.length} result${
                      searchResults.length !== 1 ? 's' : ''
                    } for "${searchQuery}"`}
              </Text>
            </View>

            {isSearching ? (
              <View className="flex-1 items-center justify-center py-8">
                <Text className="text-gray-500 ">Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <View className="flex flex-col gap-4">
                {searchResults.map((item, index) => (
                  <TouchableOpacity onPress={() => handleResultPress(item)}>
                    <ReadingContent
                      key={index}
                      type="QueryView"
                      id={item.id}
                      title={item.title}
                      author={item.author}
                      description={item.description}
                      cover={item.cover}
                      content={item.content}
                      genres={item.genres}
                      difficulty={item.difficulty}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="flex-1 items-center justify-center py-8">
                <Text className="text-gray-500  text-center">
                  No stories found matching "{searchQuery}"
                </Text>
                <Text className="text-gray-400 text-center  mt-2 text-sm">
                  Try different keywords or check spelling
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Normal Content - Only show when not searching */}
        {!showSearchResults && (
          <>
            <View
              className="flex flex-row items-center px-4 py-4 mb-2 bg-yellowOrange"
              style={{ borderBottomLeftRadius: 40 }}
            >
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{
                    padding: 12,
                    fontFamily: 'Poppins-Bold',
                    fontSize: screenWidth < 400 ? 24 : 30,
                    flexWrap: 'wrap',
                  }}
                  className="text-black font-poppins-bold"
                >
                  Ready for a Journey?
                </Text>
              </View>
              <Image
                source={require('@/assets/images/woman-reading-2.png')}
                style={{
                  width: imageWidth,
                  height: imageHeight,
                }}
                resizeMode="contain"
              />
            </View>
            {user?.role === 'Pupil' && (
              <View className="flex-1  w-full h-60 p-4">
                <Text className="text-2xl px-4 font-poppins-bold">
                  Recommended
                </Text>

                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {isRecommendationsLoading ? (
                    <Text>Loading stories...</Text>
                  ) : (
                    recommendations.map((r, index) => (
                      <View className="w-[90vw]" key={index}>
                        <ReadingContent
                          type={'Recommended'}
                          id={r.id}
                          content={r.content}
                          title={r.title}
                          author={r.author}
                          description={r.description}
                          cover={r.cover}
                          genres={r.genres}
                          difficulty={r.difficulty}
                        />
                      </View>
                    ))
                  )}
                </ScrollView>
              </View>
            )}

            <View className="flex-1 gap-4 w-full p-8">
              <Text className="text-2xl font-poppins-bold">Explore</Text>
              {isStoriesLoading || !stories ? (
                <Text>Loading stories...</Text>
              ) : (
                <View className="flex flex-row justify-between flex-wrap">
                  {stories.length > 0 ? (
                    stories?.map(item => (
                      <View key={item.id}>
                        <ReadingContent
                          type="ScrollView"
                          id={item.id}
                          title={item.title}
                          author={item.author}
                          description={item.description}
                          cover={item.cover}
                          content={item.content}
                          genres={item.genres}
                          difficulty={item.difficulty}
                        />
                      </View>
                    ))
                  ) : (
                    <Text className="text-gray-500 ">
                      No stories available.
                    </Text>
                  )}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

export default memo(HomeScreen);
